import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { REST, Routes } from "discord.js";
import { ExtendedClient, Command } from "../types.js";

export async function loadCommands(client: ExtendedClient) {
  const commandsPath = path.join(__dirname, "..", "commands");
  if (!fs.existsSync(commandsPath)) return;

  const categories = fs.readdirSync(commandsPath);
  const slashCommandsData = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      const commandModule = await import(pathToFileURL(filePath).href);
      const command: Command = commandModule.default || commandModule;

      // Cek apakah ada 'execute' ATAU 'run'
      const hasExecute = command && "data" in command && ("execute" in command || "run" in command);

      if (hasExecute) {
        command.category ??= category;
        client.commands.set(command.data.name, command);
        slashCommandsData.push(command.data.toJSON());
        console.log(`✅ Loaded command: [${category}] ${command.data.name}`);
      } else {
        console.warn(`⚠️  Skipping ${category}/${file} — missing "data" or "execute/run" export.`);
      }
    }
  }

  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);
  try {
    console.log(`🔄 Registering ${slashCommandsData.length} slash commands to Discord API...`);
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: slashCommandsData,
    });
    console.log("✅ Slash Commands registered successfully!");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
}
