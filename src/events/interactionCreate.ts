import { ChatInputCommandInteraction, Client } from "discord.js";

/**
 * Event listener for handling chat input command interactions
 */
export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction: ChatInputCommandInteraction, client:Client, commands: any[]) {
        // Check if the interaction is a chat input command
        if (!interaction.isCommand()) return;

        // Find the matching command from the provided commands array
        const commandsFound = commands.find(command => command.name === interaction.commandName);
        
        // If a matching command is found, traverse and execute it
        if (commandsFound) {
            traverseAndExecute(commandsFound, interaction);
        } else {
            // Handle the case where no matching command is found (optional)
            console.warn(`Command "${interaction.commandName}" not found.`);
        }
    },
}

/**
 * This function recursively traverses a command object and executes the appropriate function.
 * @param obj The command object or subcommand object to traverse.
 * @param interaction The ChatInputCommandInteraction object containing the interaction data.
 */
function traverseAndExecute(obj: any, interaction: ChatInputCommandInteraction) {

    // Check if the current object's name matches the chosen subcommand (if any)
    if (obj.name === interaction.options?.getSubcommand()) {

        // Check if the object has an "execute" function
        if (obj.execute && typeof obj.execute === 'function') {

            // Execute the command's function
            obj.execute(interaction);
        }
    } else if (typeof obj === 'object' && obj !== null) {
        
        // If it's a complex object and not a match, iterate through its properties
        for (let key in obj) {
            traverseAndExecute(obj[key], interaction);
        }
    }
}

