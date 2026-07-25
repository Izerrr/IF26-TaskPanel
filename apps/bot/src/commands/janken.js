const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "janken",
  description: "Rock Paper Scissors / Janken",
  data: new SlashCommandBuilder().setName("janken").setDescription("Bermain suit Jepang (Batu, Gunting, Kertas) bersama bot"),

  async run(client, context, args) {
    // <-- Perbaikan ada di baris ini
    const isSlash = context.isChatInputCommand?.();
    const author = isSlash ? context.user : context.author;

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle("Janken!")
      .setThumbnail("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
      .setDescription("React untuk mulai bermain!")
      .addFields({ name: "**Batu**", value: "🗻" }, { name: "**Gunting**", value: "✂" }, { name: "**Kertas**", value: "📰" })
      .setColor("#A9908A")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    const msg = isSlash ? await context.reply({ embeds: [embed], fetchReply: true }) : await context.channel.send({ embeds: [embed] });

    await msg.react("🗻");
    await msg.react("✂");
    await msg.react("📰");

    const filter = (reaction, user) => ["🗻", "✂", "📰"].includes(reaction.emoji.name) && user.id === author.id;

    const choices = ["🗻", "✂", "📰"];
    const me = choices[Math.floor(Math.random() * choices.length)];

    msg
      .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
      .then(async (collected) => {
        const reaction = collected.first();

        const resultEmbed = new EmbedBuilder()
          .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
          .setTitle("Hasil Janken!")
          .setThumbnail("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
          .addFields({ name: "Pilihan kamu", value: `${reaction.emoji.name}` }, { name: "Pilihan AVIVIION Helper", value: `${me}` })
          .setColor("#A9908A")
          .setTimestamp()
          .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

        await msg.edit({ embeds: [resultEmbed] });

        const playerWin = (reaction.emoji.name === "🗻" && me === "✂") || (reaction.emoji.name === "✂" && me === "📰") || (reaction.emoji.name === "📰" && me === "🗻");

        if (me === reaction.emoji.name) {
          await msg.reply("Hasilnya Seri!");
        } else if (playerWin) {
          await msg.reply("Kamu Menang! 🎉");
        } else {
          await msg.reply("Kamu Kalah! 😢");
        }
      })
      .catch(async () => {
        await msg.reply("Process cancelled, you failed to respond in time!");
      });
  },
};
