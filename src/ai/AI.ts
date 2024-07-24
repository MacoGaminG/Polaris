import Groq         from "groq-sdk";
import { ExtendedModel, ExtendedModelList } from "../types/custom-groq";
import { config }   from "dotenv";
import { supportedModelsID, endDisclaimer } from "../../config.json";

// Load environment variables from a .env file
config();

// Create a Groq client instance with API key
let groq: Groq;
try {
    groq = new Groq({
        apiKey: process.env['GROQ_API_KEY']
    });
} catch (error) {
    console.log("Error while interfacing with the Groq API:", error);
}

async function getModels(): Promise<ExtendedModelList> {
    return await groq.models.list();
};

// Ensure the models are active (usable with Groq's API)
const supportedModels: Array<ExtendedModel> = [];
getModels().then((models) => {
    const availableModels: Array<ExtendedModel> = models.data ?? [];
    for (let modelID of supportedModelsID) {
        const availableModel = availableModels.find(availableModel => availableModel.id === modelID);
        if (availableModel?.active) {
            supportedModels.push(availableModel);
        }
    }
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
 * @param model A string that is the ID of the model that should be used to generate the content
 * @returns A Promise resolving to a GroqChatCompletion object containing the response.
 */
async function getGroqChatCompletion(author: string, input: string, context: Array<{ role: string, content: string }> | null, model: string): Promise<GroqChatCompletion> {

    // Define a default set of messages including a system prompt and the user input
    const messages: Array<{ role: string, content: string }> = [
        {
            role    : "system",
            content : `
                ${systemPrompt}

                If hello has already been said, you musn't say hello anymore.
                ${author ? `You must call the user by his name which is ${author}.` : ""}
            `,
        },
        {
            role    : "user",
            content : `${input}`,
        }
    ];

    // If context is provided, append it to the message list
    if (context && context.length > 0) {
        messages.unshift(...context);
    }

    console.log("Model in use:", model);

    // Use Groq client to create a chat completion request
    return groq.chat.completions.create({
        messages    : messages,
        model       : model,    // Specifying the Groq model for chat completions
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
 * @param model An optional string that is the ID of the model that should be used to generate the content
 * @returns A Promise resolving to a string containing the generated AI response.
 */
async function generate(author: string, input: string, context: Array<{ role: string, content: string }> | null, model: string | null = null): Promise<string> {
    try {
        if (!model) {
            model = supportedModels[0]?.id ?? supportedModelsID[0] ??  "llama3-70b-8192";
        }

        // Fetch a chat completion from Groq
        const chatCompletion = await getGroqChatCompletion(author, input, context, model);

        // Extract the first generated response or return an error message + append endDisclaimer
        const response = (chatCompletion.choices[0]?.message?.content || "") + (endDisclaimer ? "\n-# " + endDisclaimer : "");

        console.log("\n===== MESSAGE GENERATED\n", response);
        return response;
    } catch (error) {
        // Pick the current supported model in use and check if the next one exists
        const modelIdx = supportedModels.findIndex((supportedModel) => supportedModel?.id === model);
        if (modelIdx + 1 >= supportedModels.length) {
            // Return a fallback message in case there are no more supported models available
            console.error("\n===== ERROR OCCURRED\n", error);
            return "I had a problem generating the response, please try again later.";
        }

        console.log(`An error occured, falling back on the ${supportedModels[modelIdx + 1]?.id} model`);
        return generate(author, input, context, supportedModels[modelIdx + 1]?.id);
    }
}

// Export the AI object with the generate function as the public interface
const AI = {
    generate
}

export default AI;