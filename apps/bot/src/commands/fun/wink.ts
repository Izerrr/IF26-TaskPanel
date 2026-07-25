import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, reply } from "../../lib/context.js";
import { fetchAnimuGif } from "../../lib/animu.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "wink",
  category: "fun",
  description: "Mengedipkan mata (wink)",
  data: new SlashCommandBuilder().setName("wink").setDescription("Mengirimkan gif anime mengedipkan mata (wink)"),

  async run(client, context) {
    const author = getAuthor(context);

    const gifUrl = await fetchAnimuGif("wink");
    if (!gifUrl) {
      await reply(context, { content: "An error occurred fetching the gif!", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`${author.username} winks! 😉`)
      .setImage(gifUrl)
      .setColor(BRAND_COLOR)
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
