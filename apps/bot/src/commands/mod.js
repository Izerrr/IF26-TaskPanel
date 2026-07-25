const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "mod",
  description: "Moderation commands list",
  data: new SlashCommandBuilder().setName("mod").setDescription("Menampilkan daftar perintah moderasi server"),

  run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setTitle("Hello There! ")
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setDescription("Command Mod yang bisa digunakan.")
      .setThumbnail("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .addFields(
        { name: "➤ Ban (Mod Only)", value: "`/ban` atau `a!ban @user [reason]`" },
        { name: "➤ Clear (Mod Only)", value: "`/clear` atau `a!clear [amount]`" },
        { name: "➤ Kick (Mod Only)", value: "`/kick` atau `a!kick @user [reason]`" },
        { name: "➤ Warn (Mod Only)", value: "`/warn` atau `a!warn @user [reason]`" },
        { name: "➤ Warnings (Mod Only)", value: "`/warnings` atau `a!warnings @user`" },
        { name: "➤ Delete Warns (Mod Only)", value: "`/deletewarns` atau `a!deletewarns @user`" },
        { name: "➤ Slowmode (Mod Only)", value: "`/slowmode` atau `a!slowmode [time|off]`" },
        { name: "➤ Mute (Mod Only)", value: "`/mute` atau `a!mute @user [time]`" },
        { name: "➤ Unmute (Mod Only)", value: "`/unmute` atau `a!unmute @user`" },
        { name: "➤ Lock (Mod Only)", value: "`/lock` atau `a!lock [on|off]`" },
      )
      .setImage("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    if (isSlash) {
      context.reply({ embeds: [embed] });
    } else {
      channel.send({ embeds: [embed] });
    }
  },
};
