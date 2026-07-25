import { Interaction } from "discord.js";
import { ExtendedClient } from "../../types.js";

export default {
  name: "interactionCreate",
  // 1. Event dari Discord mengirim (interaction, client)
  async execute(interaction: Interaction, client: ExtendedClient) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands?.get(interaction.commandName) as any;
    if (!command) return;

    try {
      // 2. TAPI File Command kamu (ping.ts dll) mintanya (client, interaction)
      // Jadi kita lemparnya WAJIB (client, interaction)
      if (typeof command.execute === "function") {
        await command.execute(client, interaction);
      } else if (typeof command.run === "function") {
        await command.run(client, interaction, []);
      } else {
        console.error(`❌ Command ${interaction.commandName} tidak valid.`);
      }
    } catch (error) {
      console.error(`❌ Error executing /${interaction.commandName}:`, error);

      const errorMessage = {
        content: "Terjadi kesalahan saat menjalankan perintah ini!",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage).catch(() => {});
      } else {
        await interaction.reply(errorMessage).catch(() => {});
      }
    }
  },
};
