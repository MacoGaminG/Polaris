import path         from "path";
import Handler      from "./helpers/handler";
import { config }   from "dotenv";
import { Client }   from "discord.js";

// Load environment variables from a .env file
config();

// Create a Discord.js client instance with required intents
const client:Client     = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });

// Get an instance of the Handler class using the singleton pattern
const handler:Handler   = Handler.getInstance();

(async () => {
    
    // Load and register events asynchronously
    await handler.handleEvents(client, path.join(__dirname, "events"));
    
    // Load and register commands asynchronously
    await handler.handleCommands(client, path.join(__dirname, "commands"));
})();

// Attempt to login the Discord bot using the environment variable
try {
    client.login(process.env["DISCORD_TOKEN"]);
} catch (error) {
    console.error("Error logging in:", error);
}