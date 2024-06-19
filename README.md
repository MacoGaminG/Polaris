# Polaris - Your Discord AI Assistant

Polaris is a Discord bot powered by Groq's powerful LLM, designed to provide insightful responses and assistance within your Discord server.

## Features

* **AI-Powered Conversations:** Engage in natural conversations with Polaris. It leverages Groq's `llama3-70b-8192` model to provide context-aware and engaging responses.
* **Context Retention:** Polaris remembers previous messages in a channel, enabling it to maintain the flow of conversation and deliver more relevant answers.
* **Customizable System Prompt:** Tailor Polaris' behavior and knowledge base by editing the `systemPrompt` variable in `src/ai/AI.ts`.
* **Event-Driven Architecture:** Polaris utilizes Discord.js events to efficiently handle interactions, commands, and incoming messages.
* **Configuration Options:**  Basic configuration settings are available in `config.json`, allowing you to specify channel categories and roles for bot access.
* **Developer-Friendly Debugging:**  The `debug` command provides tools to inspect embeds and test ticket-related functionality.

## Prerequisites

* **Node.js:** Version 18 or later ([https://nodejs.org/](https://nodejs.org/)).
* **pnpm:**  Package manager ([https://pnpm.io/](https://pnpm.io/)).
* **Discord Bot Token:**  Obtain a bot token from the Discord Developer Portal ([https://discord.com/developers/applications](https://discord.com/developers/applications)).
* **Groq API Key:** Create an account and get your API key from Groq ([https://console.groq.com/](https://console.groq.com/)).

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/polaris.git
   cd polaris
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install 
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:

   ```plaintext
        GUILD_ID        =
        CLIENT_ID       =
        GROQ_API_KEY    =
        DISCORD_TOKEN   =
   ```

4. **Configuration:**
   Adjust settings in `config.json`:

   * `channelCategories`:  Array of category IDs where Polaris will be active.
   * `channelToIgnore`: Array of channel IDs within the categories to exclude.
   * `configAccess`: (Not fully implemented)  Placeholder for roles that can manage the bot configuration.
5. **Build and Run:**

   ```bash
   pnpm run build  # Compiles TypeScript code
   pnpm run main   # Starts the bot
   ```

## Usage

* **Invite Polaris to your Server:**  Generate an invite link from the Discord Developer Portal for your bot.
* **Interact with Polaris:** Once Polaris is in your server and active in the configured categories, send messages in those channels to initiate conversations.
* **Developer Commands:** Use the `/debug` slash command for testing and troubleshooting.

## Customization

* **System Prompt:**  Edit `src/ai/AI.ts` to refine Polaris' responses:
  * Modify the system instructions, guidelines, and database to align with your needs.
* **Commands and Events:**  Extend Polaris' functionality by creating new commands in `src/commands` and events in `src/events`.
* **Advanced Configuration:** (Future Development) Implement more robust configuration options for role-based access control and bot management.

## Contributing

Contributions are welcome! Please open issues for bug reports or feature requests. Feel free to submit pull requests for code enhancements or bug fixes.

## License

This project is licensed under the GNU General Public License v3.0.
