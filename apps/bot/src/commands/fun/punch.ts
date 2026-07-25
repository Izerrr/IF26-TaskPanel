import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "punch",
  category: "fun",
  description: "Memukul seseorang",
  data: new SlashCommandBuilder()
    .setName("punch")
    .setDescription("Memukul seseorang menggunakan gif anime")
    .addUserOption((option) => option.setName("target").setDescription("User yang ingin dipukul").setRequired(true)),

  async run(client, context) {
    const author = getAuthor(context);
    const target = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();

    if (!target) {
      await reply(context, { content: "Please mention someone to punch!", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`${author.username} memukul ${target.username}!`)
      .setDescription("Pasti Sakit..")
      .setImage("https://media.tenor.com/LDSXKWxPpjMAAAAC/anime-punch.gif")
      .setColor(BRAND_COLOR)
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
