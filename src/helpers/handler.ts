import fs                       from "fs";
import path                     from "path";
import { config }               from "dotenv";
import { Client, REST, Routes } from "discord.js";

// Load environment variables from a .env file
config();

// Read environment variables with type assertion for safety
const GUILD_ID      = process.env["GUILD_ID"]       as string;
const CLIENT_ID     = process.env["CLIENT_ID"]      as string;
const DISCORD_TOKEN = process.env["DISCORD_TOKEN"]  as string;

/**
 * Handler class for managing events and commands
 */
class Handler {

    // Singleton pattern to ensure only one instance exists
    private static instance: Handler;
    private commands: any[] = [];

    private constructor() {}

    /**
     * Gets the singleton instance of the Handler class
     * @returns Handler instance
     */
    public static getInstance(): Handler {
        if (!Handler.instance) {
            Handler.instance = new Handler();
        }
        return Handler.instance;
    }

    /**
     * Handles loading and registering events from a directory
     * @param client The Discord.js client instance
     * @param eventsDir The directory path containing event files
     */
    public async handleEvents(client: Client, eventsDir: string) {
        const files = fs.readdirSync(eventsDir);
        for (const file of files) {
            
            // Only process JavaScript or TypeScript event files
            if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                continue;
            }

            const filePath      = path.join(eventsDir, file);

            // Import the event module dynamically based on platform
            const eventModule   = await import(process.platform === "win32" ? `file://${filePath}` : filePath);
            let event           = eventModule.default;

            // Handle default export from the module
            if (typeof event === 'object' && event.default) {
                event = event.default;
            }

            const { once, name, execute } = event;
            
            // Bind the client and commands to the event execution
            if (once) {
                client.once(name, (...args) => execute(...args, client));
            } else {
                client.on(name, (...args) => execute(...args, client, this.getCommands()));
            }
        }
    }

    /**
     * Handles loading and registering commands from a directory
     * @param client The Discord.js client instance
     * @param commandsDir The directory path containing command files
     */
    public async handleCommands(client: Client, commandsDir: string) {
        const commandFiles = fs.readdirSync(commandsDir);
        for (const file of commandFiles) {

            // Only process JavaScript or TypeScript command files
            if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                continue;
            }
            const filePath = path.join(commandsDir, file);
            const commandModule = await import(process.platform === "win32" ? `file://${filePath}` : filePath);
            let command = commandModule.default;

            // Handle default export from the module
            if (typeof command === 'object' && command.default) {
                command = command.default;
            }
            this.commands.push(command);
        }
        await this.registerCommands();
    }

    /**
     * Gets the list of registered commands
     * @returns An array of command objects
     */
    public getCommands(){
        return this.commands;
    }

    /**
     * Registers all loaded commands with the Discord API
     */
    private async registerCommands() {
        const rest = new REST().setToken(DISCORD_TOKEN);
        try {
            console.log(`Started refreshing ${this.commands.length} application (/) commands.`);

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: this.commands },
            );
        } catch (error) {
            console.error(error);
        }
    }
}

export default Handler;