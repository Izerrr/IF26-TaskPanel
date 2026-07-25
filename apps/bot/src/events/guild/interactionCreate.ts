import { Interaction } from "discord.js";
import { ExtendedClient } from "../../types.js";

export default {
  name: "interactionCreate",
  async execute(client: ExtendedClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    // Cast ke type any sementara biar TypeScript gak rewel
    const command = client.commands.get(interaction.commandName) as any;
    if (!command) return;

    try {
      // Prioritaskan execute, jika tidak ada panggil run dengan 3 argumen
      if (typeof command.execute === "function") {
        await command.execute(client, interaction);
      } else if (typeof command.run === "function") {
        await command.run(client, interaction, []);
      } else {
        console.error(`❌ Command ${interaction.commandName} tidak memiliki method execute/run!`);
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
