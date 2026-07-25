const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "suggest",
  description: "Kirim saran ke channel suggestions",
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Kirim saran ke channel suggestions")
    .addStringOption((option) => option.setName("saran").setDescription("Isi saran/rekomendasi untuk server").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const guild = context.guild;
    const author = isSlash ? context.user : context.author;
    const suggestion = isSlash ? context.options.getString("saran") : args.join(" ");

    if (!suggestion) {
      return isSlash ? context.reply({ content: "Saran tidak boleh kosong!", ephemeral: true }) : channel.send("Please provide a suggestion! Example: `a!suggest Add more commands!`");
    }

    const suggestChannel = guild.channels.cache.find((c) => c.name === "suggestions" || c.name === "saran");

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
      .setTitle("💡 New Suggestion")
      .setDescription(suggestion)
      .setColor("#A9908A")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal`, iconURL: FOOTER_ICON });

    const target = suggestChannel || channel;
    const sent = await target.send({ embeds: [embed] });
    await sent.react("👍");
    await sent.react("👎");

    if (suggestChannel && suggestChannel.id !== channel.id) {
      const successText = `✅ Your suggestion has been sent to ${suggestChannel}!`;
      if (isSlash) await context.reply({ content: successText, ephemeral: true });
      else channel.send(successText);
    } else {
      if (isSlash) await context.reply({ content: "✅ Your suggestion has been posted here!", ephemeral: true });
    }
  },
};
