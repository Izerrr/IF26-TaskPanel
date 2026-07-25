import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, getStringArg, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";
import { addWarning } from "../../lib/warnings.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "warn",
  category: "moderation",
  description: "Warn seorang member",
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan memberikan warn").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageGuild))) return;

    const guild = context.guild;
    if (!guild) return;

    const author = getAuthor(context);
    const targetUser = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();

    if (!targetUser) {
      await reply(context, { content: "Please specify a user via mention", ephemeral: true });
      return;
    }
    if (targetUser.bot) {
      await reply(context, { content: "You can't warn bots", ephemeral: true });
      return;
    }
    if (targetUser.id === author.id) {
      await reply(context, { content: "You can't warn yourself", ephemeral: true });
      return;
    }

    const reason = getStringArg(context, args, "reason", 1) ?? "No reason provided";
    const warnings = addWarning(guild.id, targetUser.id, {
      reason,
      by: author.tag,
      date: new Date().toLocaleDateString(),
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle("Member Warned")
      .setColor(BRAND_COLOR)
      .addFields(
        { name: "User", value: `${targetUser}` },
        { name: "Warned by", value: `${author}` },
        { name: "Reason", value: reason },
        { name: "Total Warnings", value: `${warnings.length}` }
      )
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    await reply(context, { embeds: [embed] });
  },
};

export default command;
