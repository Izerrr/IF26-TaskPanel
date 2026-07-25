import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`🤖 Bot online! Logged in as ${client.user?.tag}`);
});

// Login pakai token dari file .env
client.login(process.env.DISCORD_BOT_TOKEN);
