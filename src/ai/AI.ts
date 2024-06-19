import Groq         from "groq-sdk";
import { config }   from "dotenv";

// Load environment variables from a .env file
config();

// Create a Groq client instance with API key
const groq = new Groq({
    apiKey: process.env['GROQ_API_KEY']
});

// Define an interface for the expected response format from Groq
interface GroqChatCompletion {
    choices: Array<{ message: { content: string } }>;
}

/**
 * This function fetches a chat completion from Groq based on provided parameters.
 * @param author The name of the user interacting with the bot (optional).
 * @param input The user's input message.
 * @param context An optional array of previous messages for context (role and content).
 * @returns A Promise resolving to a GroqChatCompletion object containing the response.
 */
async function getGroqChatCompletion(author: string, input: string, context: Array<{ role: string, content: string }> | null): Promise<GroqChatCompletion> {

    // Define a default set of messages including a system prompt and the user input
    const messages: Array<{ role: string, content: string }> = [
        {
            role    : "system",
            content : `
                ${systemPrompt}

                If hello has already been said, you musn't say hello anymore.
                ${author ? `You must call the user by his name that is ${author}.` : ""}
            `,
        },
        {
            role    : "user",
            content : `${input}`,
        }
    ];

    // If context is provided, append it to the message list
    if (context && context.length > 0) {
        messages.push(...context);
    }

    // Use Groq client to create a chat completion request
    return groq.chat.completions.create({
        messages    : messages,
        model       : "llama3-70b-8192",    // Specifying the Groq model for chat completions
        stream      : false,                // Disabling message streaming
        temperature : 1,                    // Setting the randomness/creativity of the response (1 = default)
    });
}

const systemPrompt  :string         =
`
# [Company] Support Chat Bot Instructions

You are [name of the bot], the support chat bot for [company]. Your role is to assist users in resolving issues based on the provided problem and solution database.

## Creator of the Bot
- The creator is [name of the creator]

## Problem and Solution Database

\`\`\`json
[List problems and solutions here]
\`\`\`

## Response Guidelines

1. [Guideline 1]
2. [Guideline 2]
3. [Guideline 3]

## Compliance Check

- [Compliance Check 1]
- [Compliance Check 2]
- [Compliance Check 3]

## Reminder / Important

- [Reminder 1]
- [Reminder 2]
- [Reminder 3]
`

/**
 * This function is the main entry point for generating AI responses.
 * @param author The name of the user interacting with the bot (optional).
 * @param input The user's input message.
 * @param context An optional array of previous messages for context (role and content).
 * @returns A Promise resolving to a string containing the generated AI response.
 */
async function generate(author: string, input: string, context: Array<{ role: string, content: string }> | null): Promise<string> {
    try {

        // Fetch a chat completion from Groq
        const chatCompletion = await getGroqChatCompletion(author, input, context);

        // Extract the first generated response or return an error message
        const response = chatCompletion.choices[0]?.message?.content || "";

        console.log("\n===== MESSAGE GENERATED\n",response);
        return response;
    } catch(error){
        console.error("\n===== ERROR GENERATED\n", error);

        // Return a fallback message in case of errors
        return "I had a problem generating the response, please try again later.";
    }
}

// Export the AI object with the generate function as the public interface
const AI = {
    generate
}

export default AI;