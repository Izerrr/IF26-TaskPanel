const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "utilities",
  description: "Menampilkan info sub-menu utilitas utilitas",
  data: new SlashCommandBuilder().setName("utilities").setDescription("Menampilkan info sub-menu utilitas"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;

    const embed = new EmbedBuilder()
      .setTitle("🛠️ Utilities Module")
      .setDescription("Gunakan perintah berikut untuk utilitas server:\n- `/weather` - Cek cuaca\n- `/calculate` - Kalkulator\n- `/translate` - Penerjemah bahasa")
      .setColor("#A9908A")
      .setTimestamp();

    if (isSlash) await context.reply({ embeds: [embed] });
    else await channel.send({ embeds: [embed] });
  },
};
