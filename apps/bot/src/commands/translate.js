const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const translate = require("translate-google");

const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "translate",
  description: "Translate teks ke bahasa lain",
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate teks ke bahasa lain")
    .addStringOption((option) => option.setName("language").setDescription("Kode bahasa target (Contoh: en, id, ja)").setRequired(true))
    .addStringOption((option) => option.setName("text").setDescription("Teks yang ingin diterjemahkan").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    const lang = isSlash ? context.options.getString("language") : args[0];
    const text = isSlash ? context.options.getString("text") : args.slice(1).join(" ");

    if (!lang || !text) {
      return isSlash ? context.reply({ content: "Format salah! Gunakan: `/translate language:en text:Halo`", ephemeral: true }) : channel.send("Usage: `a!translate [language code] [text]`\nExample: `a!translate en Halo dunia`");
    }

    if (isSlash) await context.deferReply();

    try {
      const result = await translate(text, { to: lang });

      const embed = new EmbedBuilder()
        .setColor("#A9908A")
        .setTitle("🌐 Translation")
        .addFields({ name: "Original", value: text }, { name: `Translated (${lang})`, value: result })
        .setTimestamp()
        .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash) {
        await context.editReply({ embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }
    } catch (e) {
      const errMsg = "Translation failed. Make sure you used a valid language code (e.g., `en`, `id`, `ja`)";
      if (isSlash) await context.editReply({ content: errMsg });
      else channel.send(errMsg);
    }
  },
};
