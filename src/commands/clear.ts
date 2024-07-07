import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { clearContextMessage } from "../../config.json";


export default {
    name: "clear",
    description: "cleaning functions",
    options: [
        {
            name: "context",
            description: "Clear the context given to the AI",
            type: ApplicationCommandOptionType.Subcommand,
            execute: async (interaction: ChatInputCommandInteraction) => {
                interaction.reply(clearContextMessage);
            }
        },
    ]
};