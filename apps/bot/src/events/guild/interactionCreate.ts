import { Interaction } from "discord.js";
import { ExtendedClient } from "../../types.js";

export default {
  name: "interactionCreate",
  async execute(interaction: Interaction, client: ExtendedClient) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands?.get(interaction.commandName) as any;
    if (!command) return;

    try {
      // Otomatis tunda respon (defer) kalau command butuh waktu
      // Ini cegah error "The application did not respond" jika proses > 3 detik

      if (typeof command.execute === "function") {
        await command.execute(interaction, client);
      } else if (typeof command.run === "function") {
        // Kirim interaction sebagai param 1 & param 2 buat cover segala bentuk command legacy
        await command.run(interaction, client, []);
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
