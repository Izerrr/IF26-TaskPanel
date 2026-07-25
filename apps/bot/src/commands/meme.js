const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "meme",
  description: "Get a random meme from Reddit",
  data: new SlashCommandBuilder().setName("meme").setDescription("Mengambil gambar meme acak dari Reddit secara otomatis"),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    if (isSlash) await context.deferReply();

    const subReddits = ["dankmemes", "meme", "memes", "alterly"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    try {
      const res = await fetch(`https://www.reddit.com/r/${random}/random.json?limit=1`);
      const data = await res.json();
      const post = data[0].data.children[0].data;

      if (!post.url) {
        const noFetch = "Could not fetch a meme right now. Try again!";
        return isSlash ? context.editReply({ content: noFetch }) : channel.send(noFetch);
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
        .setColor("#A9908A")
        .setImage(post.url)
        .setTitle(`From /r/${random}`)
        .setURL(`https://reddit.com/r/${random}`)
        .setTimestamp()
        .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash) {
        await context.editReply({ embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }
    } catch (e) {
      const failMsg = "Could not fetch a meme. Reddit might be down!";
      if (isSlash) await context.editReply({ content: failMsg });
      else channel.send(failMsg);
    }
  },
};
