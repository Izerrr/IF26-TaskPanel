import { Client, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class ExtendedClient extends Client {
  commands: Collection<string, Command> = new Collection();
}
