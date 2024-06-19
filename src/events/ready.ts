import { Client } from "discord.js";

/**
 * This event listener handles the "ready" event emitted by the Discord client.
 */
export default {
    name: "ready",
    once: true, // This event listener executes only once when the client is ready
    execute(client: Client) {

        // Log a message upon successful login
        console.log(`Logged in as ${client.user?.username} !`);
    },
}