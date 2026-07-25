import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import { ExtendedClient, Command } from "../types.js";

export async function loadCommands(client: ExtendedClient) {
  const commandsPath = path.join(process.cwd(), "src/commands");
  if (!fs.existsSync(commandsPath)) return;

  const categories = fs.readdirSync(commandsPath);
  const slashCommandsData = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      const command: Command = (await import(`file://${filePath}`)).default;

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        slashCommandsData.push(command.data.toJSON());
      }
    }
  }

  // Register Slash Commands ke Discord REST API
  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);
  try {
    console.log("🔄 Registering Slash Commands...");
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: slashCommandsData });
    console.log("✅ Slash Commands registered successfully!");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
}
