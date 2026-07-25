const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "fun",
  description: "Fun commands list",
  data: new SlashCommandBuilder().setName("fun").setDescription("Menampilkan daftar perintah hiburan/roleplay acak"),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const author = isSlash ? context.user : context.author;

    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setTitle("Hello There! ")
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setDescription("Command RP yang bisa digunakan.")
      .setThumbnail("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .addFields(
        { name: "➤ Janken", value: "`/janken` atau `a!janken`" },
        { name: "➤ Tanya AVIVIION Helper", value: "`/tanya` atau `a!tanya`" },
        { name: "➤ Meme", value: "`/meme` atau `a!meme`" },
        { name: "➤ Hug", value: "`/hug` atau `a!hug @user`" },
        { name: "➤ Pat", value: "`/pat` atau `a!pat @user`" },
        { name: "➤ Wink", value: "`/wink` atau `a!wink`" },
      )
      .setImage("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await context.channel.send({ embeds: [embed] });
    }
  },
};
