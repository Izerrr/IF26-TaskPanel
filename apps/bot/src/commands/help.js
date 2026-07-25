const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Menampilkan daftar semua perintah bot yang tersedia",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Menampilkan daftar semua perintah bot")
    .addStringOption((option) => option.setName("command").setDescription("Nama perintah spesifik untuk info lebih detail").setRequired(false)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const commandName = isSlash ? context.options.getString("command") : args[0];

    if (commandName) {
      const command = client.commands.get(commandName.toLowerCase());
      if (!command) {
        const noCmd = `❌ Perintah \`${commandName}\` tidak ditemukan.`;
        return isSlash ? context.reply({ content: noCmd, ephemeral: true }) : channel.send(noCmd);
      }

      const embed = new EmbedBuilder()
        .setTitle(`Help: ${command.name}`)
        .setColor("#A9908A")
        .addFields(
          { name: "Deskripsi", value: command.description || "Tidak ada deskripsi." },
          { name: "Kategori", value: command.category || "General" },
          { name: "Aliases", value: command.aliases ? command.aliases.join(", ") : "Tidak ada" },
        )
        .setTimestamp();

      return isSlash ? context.reply({ embeds: [embed] }) : channel.send({ embeds: [embed] });
    }

    // Jika tidak mencari command spesifik, tampilkan seluruh menu
    const categories = {};
    client.commands.forEach((cmd) => {
      const cat = cmd.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(`\`${cmd.name}\``);
    });

    const embed = new EmbedBuilder().setTitle("📚 Menu Perintah AVIVIION Helper").setDescription("Gunakan `/help [nama_command]` untuk melihat detail per-command.").setColor("#A9908A").setTimestamp();

    for (const [category, cmds] of Object.entries(categories)) {
      embed.addFields({ name: `➤ ${category.toUpperCase()}`, value: cmds.join(", "), inline: false });
    }

    if (isSlash) await context.reply({ embeds: [embed] });
    else await channel.send({ embeds: [embed] });
  },
};
