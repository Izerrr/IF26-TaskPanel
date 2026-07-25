import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, reply } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "mod",
  category: "moderation",
  description: "Moderation commands list",
  data: new SlashCommandBuilder().setName("mod").setDescription("Menampilkan daftar perintah moderasi server"),

  async run(client, context) {
    const author = getAuthor(context);

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("Hello There! ")
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setDescription("Command Mod yang bisa digunakan.")
      .setThumbnail(FOOTER_ICON)
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
        { name: "➤ Lock (Mod Only)", value: "`/lock` atau `a!lock [on|off]`" }
      )
      .setImage(FOOTER_ICON)
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
