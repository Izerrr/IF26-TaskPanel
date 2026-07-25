import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const pingCommand: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Cek respon dan latency bot"),
  async execute(interaction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Latency: ${latency}ms`);
  },
};

export default pingCommand;
