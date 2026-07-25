import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, getStringArg, reply } from "../../lib/context.js";
import { requirePermissions, resolveTargetMember } from "../../lib/moderation.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "ban",
  category: "moderation",
  description: "Ban seorang member dari server",
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban seorang member dari server")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan melakukan ban").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.BanMembers))) return;

    const author = getAuthor(context);
    const targetMember = await resolveTargetMember(context, args);

    if (!targetMember) {
      await reply(context, { content: "Can't seem to find this user. Sorry 'bout that :/", ephemeral: true });
      return;
    }
    if (!targetMember.bannable) {
      await reply(context, { content: "This user can't be banned.", ephemeral: true });
      return;
    }
    if (targetMember.id === author.id) {
      await reply(context, { content: "Bruh, you can't ban yourself!", ephemeral: true });
      return;
    }

    const banReason = getStringArg(context, args, "reason", 1) ?? "Unspecified";

    try {
      await targetMember.ban({ reason: banReason });
    } catch {
      await reply(context, { content: "Something went wrong", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle("Member Banned")
      .setColor(BRAND_COLOR)
      .setThumbnail(targetMember.user.displayAvatarURL())
      .addFields(
        { name: "User Banned", value: `${targetMember}` },
        { name: "Banned by", value: `${author}` },
        { name: "Reason", value: banReason }
      )
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    await reply(context, { embeds: [embed] });
  },
};

export default command;
