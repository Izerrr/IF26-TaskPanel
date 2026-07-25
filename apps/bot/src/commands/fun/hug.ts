import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { fetchAnimuGif } from "../../lib/animu.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "hug",
  category: "fun",
  description: "Memeluk seseorang",
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Memeluk seseorang menggunakan gif anime")
    .addUserOption((option) => option.setName("target").setDescription("User yang ingin kamu peluk").setRequired(true)),

  async run(client, context) {
    const author = getAuthor(context);
    const target = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();

    if (!target) {
      await reply(context, { content: "Please mention someone to hug!", ephemeral: true });
      return;
    }

    const gifUrl = await fetchAnimuGif("hug");
    if (!gifUrl) {
      await reply(context, { content: "An error occurred fetching the gif!", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`${author.username} hugs ${target.username}!`)
      .setDescription("That's Sweet")
      .setImage(gifUrl)
      .setColor(BRAND_COLOR)
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
