import AI                                                                       from "../ai/AI";
import { Client, DMMessageManager, GuildMessageManager, Message, MessageType }  from "discord.js";
import { splitTextIntoChunks } from "../utils/strings";
import constants from "../utils/constants";

/**
 * This event listener handles incoming message creation events.
 */
export default {
    name: "messageCreate",
    once: false, // Set to true for a one-time execution
    async execute(message: Message, client: Client): Promise<void> {
        
        // Ignore messages from bots or those mentioning everyone
        if (message.author.bot || message.mentions.everyone) return;

        // Check if the Discord client is ready (user object exists)
        if (client.user === null) {
            void message.reply("I'm just getting started, so please wait.");
            return;
        }

        // Extract user input from message
        const userInput = message.content;

        try {

            // Show typing indicator
            message.channel.sendTyping();

            // Get a reference to the message manager for context retrieval
            const messages      = message.channel.messages;

            // Retrieve context from previous messages (defined in getContext function)
            const context = await getContext(messages, client);

            // Log user input
            console.log("\n===== INPUT MESSAGE\n", userInput);

            // Generate AI response using user input and context
            const response = (await AI.generate(`<@${message.author.id}>}`, userInput, context));

            // Reply to the message with the generated AI response
            // make sure to not send a message that exceeds discord's message length limit
            const responseChunks: string[] = splitTextIntoChunks(response, constants.MAX_MESSAGE_LENGTH);
            message.reply(responseChunks[0]!); // use reply for the first message
            if (response.length > 1) {
                for (const chunk of responseChunks.slice(1, responseChunks.length)) {
                    message.channel.send(chunk); // then send other messages in the usual way
                }
            }
        } catch (error) {
            
            // Log error for debugging
            console.error("Error generating response:", error);

            // Inform user about the error and suggest retrying
            message.reply("An error has occurred. Please try again later.");
        }
    }
}

/**
 * This function retrieves the conversation context from previous messages in the channel.
 * @param messages Reference to the message manager for the channel.
 * @param client The Discord client instance.
 * @returns An array of objects containing message role ("assistant" or "user") and content.
 */
async function getContext(messages: GuildMessageManager | DMMessageManager, client: Client): Promise<{ role: string; content: string; }[]> {
    
    // Fetch all messages from the channel
    return await messages.fetch().then(messages => {

        // Filter out pinned messages and reverse the order (newest first)
        const contextMessages: Array<{role: string, content: string}> = messages
            .reverse()
            .filter(message => message.type !== MessageType.ChannelPinnedMessage)
            .map(message => {
                const role = message.author.id === client.user?.id ? "assistant" : "user";
                // Extract message content
                const content = message.content;
                return { role, content };
            }
        );

        // Remove the current message from the context
        contextMessages.shift();

        return contextMessages;
    });
}