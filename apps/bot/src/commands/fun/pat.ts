import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { fetchAnimuGif } from "../../lib/animu.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "pat",
  category: "fun",
  description: "Mengelus kepala seseorang (pat)",
  data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Mengelus kepala seseorang menggunakan gif anime")
    .addUserOption((option) => option.setName("target").setDescription("User yang ingin dielus").setRequired(true)),

  async run(client, context) {
    const author = getAuthor(context);
    const target = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();

    if (!target) {
      await reply(context, { content: "Please mention someone to pat!", ephemeral: true });
      return;
    }

    const gifUrl = await fetchAnimuGif("pat");
    if (!gifUrl) {
      await reply(context, { content: "An error occurred fetching the gif!", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`${author.username} pats ${target.username}!`)
      .setDescription("Cuteness Overload")
      .setImage(gifUrl)
      .setColor(BRAND_COLOR)
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
