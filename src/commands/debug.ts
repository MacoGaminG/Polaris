import { APIApplicationCommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, BaseChannel, BaseInteraction, ChatInputCommandInteraction, CommandInteraction, Events, GuildChannel, Interaction, NonThreadGuildBasedChannel } from "discord.js";

export default {
    name: "debug",
    description: "Debug tools for developers",
    options: [
        {
            name: "ticket",
            description: "Test for tickets",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "embeds",
                    description: "Test tickets embed handling",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Channel where the embed is located",
                            type: ApplicationCommandOptionType.Channel,
                            required: false,
                        }
                    ],
                    execute: async (interaction: ChatInputCommandInteraction) => {
                        const messages          = await interaction.channel?.messages.fetch();
                        const firstMessage      = messages?.last();
                        const embeds            = firstMessage?.embeds;

                        if (!embeds) {
                            await interaction.reply({ content: "No embeds found", ephemeral: true });
                            return;
                        }

                        const embedInfo         = embeds[0]?.description;
                        const infoMatch         = embedInfo?.match(/(?<=\*\*Nombre de fois réclamé:\*\* )\d+/);
                        const author            = embedInfo?.match(/(?<=\*\*Créé par:\*\* )<@\d+>/);

                        if(!infoMatch){
                            await interaction.reply({ content: "Count number not found", ephemeral: true })
                            return;
                        }

                        const infoValue         = parseInt(infoMatch[0]);

                        const embedDescription  = embeds[1]?.description;
                        const descriptionMatch  = embedDescription?.match(/```(.*?)```/s);
                        const descriptionValue  = descriptionMatch ? descriptionMatch[1] : null;

                        await interaction.reply({ content: `Count: ${infoValue}\nDescription: ${descriptionValue}\nAuthor: ${author}`, ephemeral: true });
                    }
                },
                {
                    name: "check",
                    description: "Check if a channel is a ticket",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Channel to check",
                            type: ApplicationCommandOptionType.Channel,
                            required: false,
                        }
                    ],
                    execute: async (interaction: ChatInputCommandInteraction) => {
                        const messages          = await interaction.channel?.messages.fetch();
                        const firstMessage      = messages?.last();
                        const embeds            = firstMessage?.embeds;

                        if (!embeds) {
                            await interaction.reply({ content: "No embeds found", ephemeral: true });
                            return;
                        }

                        const embedToCheck       = embeds[0]?.title;
                        interaction.reply({ content: `Channel is a ticket: ${embedToCheck?.includes("Besoin d'aide")}`, ephemeral: true });
                    }
                }
            ]
        },
        {
            name: "emit",
            description: "Emit an event",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "event",
                    description: "Event to emit",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: "channelCreate",
                            value: "channelCreate"
                        }
                    ],
                    required: true,
                }
            ],
            execute: async (interaction: ChatInputCommandInteraction) => {
                const event = interaction.options.getString("event")!;
                if (!(interaction.channel instanceof GuildChannel)) {
                    await interaction.reply({ content: `This command can only be used in a guild channel.`, ephemeral: true });
                    return;
                }
                const channel: NonThreadGuildBasedChannel = interaction.channel;
                interaction.client.emit(event, channel);
                await interaction.reply({ content: `Event ${event} triggered`, ephemeral: true });
            }
        }
    ]
};