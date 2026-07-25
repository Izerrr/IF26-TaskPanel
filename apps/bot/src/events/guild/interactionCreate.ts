import { Interaction } from "discord.js";
import { ExtendedClient } from "../../types.js";

export const execute = async (interaction: Interaction, client: ExtendedClient) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // args is empty here — slash options are read directly off the
    // interaction inside each command's run(), via context.options.
    await command.run(client, interaction, []);
  } catch (error) {
    console.error(error);
    const errorPayload = {
      content: "❌ Terjadi kesalahan saat menjalankan command ini!",
      ephemeral: true,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorPayload);
    } else {
      await interaction.reply(errorPayload);
    }
  }
};
