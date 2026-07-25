import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";
import { Command } from "../../types.js";
import { getAuthor, isSlash, sendChannel } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

interface RedditPost {
  data: { children: { data: { url?: string } }[] };
}

const SUBREDDITS = ["dankmemes", "meme", "memes", "alterly"];

const command: Command = {
  name: "meme",
  category: "fun",
  description: "Get a random meme from Reddit",
  data: new SlashCommandBuilder().setName("meme").setDescription("Mengambil gambar meme acak dari Reddit secara otomatis"),

  async run(client, context) {
    const author = getAuthor(context);
    if (isSlash(context)) await context.deferReply();

    const random = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];

    try {
      const res = await fetch(`https://www.reddit.com/r/${random}/random.json?limit=1`);
      const data = (await res.json()) as RedditPost[];
      const post = data[0]?.data.children[0]?.data;

      if (!post?.url) {
        const noFetch = "Could not fetch a meme right now. Try again!";
        if (isSlash(context)) await context.editReply({ content: noFetch });
        else await sendChannel(context.channel, { content: noFetch });
        return;
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
        .setColor(BRAND_COLOR)
        .setImage(post.url)
        .setTitle(`From /r/${random}`)
        .setURL(`https://reddit.com/r/${random}`)
        .setTimestamp()
        .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash(context)) {
        await context.editReply({ embeds: [embed] });
      } else {
        await sendChannel(context.channel, { embeds: [embed] });
      }
    } catch {
      const failMsg = "Could not fetch a meme. Reddit might be down!";
      if (isSlash(context)) await context.editReply({ content: failMsg });
      else await sendChannel(context.channel, { content: failMsg });
    }
  },
};

export default command;
