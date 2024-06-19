import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

export default {
    name: "config",
    description: "Configure Polaris settings",
    options: [
        {
            name: "access",
            description: "Manage a role or user to modify the configuration",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "add",
                    description: "Add a role or user to the configuration",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to add",
                            type: ApplicationCommandOptionType.Role,
                            required: false,
                        },
                        {
                            name: "user",
                            description: "User to add",
                            type: ApplicationCommandOptionType.User,
                            required: false,
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a role or user from the configuration",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to remove",
                            type: ApplicationCommandOptionType.Role,
                            required: false,
                        },
                        {
                            name: "user",
                            description: "User to remove",
                            type: ApplicationCommandOptionType.User,
                            required: false,
                        }
                    ]
                }
            ]
        }
    ]
};