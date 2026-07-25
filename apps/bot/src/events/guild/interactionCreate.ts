import { Interaction } from "discord.js";
import { ExtendedClient } from "../../types.js";

export const execute = async (interaction: Interaction, client: ExtendedClient) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Terjadi kesalahan saat menjalankan command ini!",
      ephemeral: true,
    });
  }
};
