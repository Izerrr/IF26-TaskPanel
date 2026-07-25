import "dotenv/config";
import { GatewayIntentBits } from "discord.js";
import { ExtendedClient } from "./types.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadCommands } from "./handlers/commandHandler.js";

const client = new ExtendedClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function main() {
  await loadEvents(client);
  await loadCommands(client);
  await client.login(process.env.DISCORD_BOT_TOKEN);
}

main();
