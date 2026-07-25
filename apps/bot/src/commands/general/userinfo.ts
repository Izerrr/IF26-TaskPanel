import { EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "userinfo",
  category: "general",
  description: "Menampilkan informasi statistik pengguna",
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Menampilkan informasi statistik pengguna")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User yang ingin dicek statistiknya (kosongkan untuk diri sendiri)")
        .setRequired(false)
    ),

  async run(client, context, args) {
    const guild = context.guild;
    if (!guild) return;

    const targetMember: GuildMember | null | undefined = isSlash(context)
      ? (context.options.getMember("target") as GuildMember | null) ?? (context.member as GuildMember)
      : context.mentions.members?.first() ?? guild.members.cache.get(args[0]) ?? (context.member as GuildMember);

    if (!targetMember) {
      await reply(context, { content: "Tidak dapat menemukan user tersebut.", ephemeral: true });
      return;
    }

    const requester = getAuthor(context);

    const presence = targetMember.presence;
    let status = "Offline";
    if (presence) {
      switch (presence.status) {
        case "online":
          status = "Online";
          break;
        case "dnd":
          status = "Do Not Disturb";
          break;
        case "idle":
          status = "Idle";
          break;
        default:
          status = "Offline";
          break;
      }
    }

    const activity = presence?.activities?.[0]?.name ?? "User isn't doing anything!";

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`${targetMember.user.username} stats`)
      .setColor(BRAND_COLOR)
      .setThumbnail(targetMember.user.displayAvatarURL())
      .addFields(
        { name: "➤ Username", value: targetMember.user.username, inline: true },
        { name: "➤ ID", value: targetMember.user.id, inline: true },
        { name: "➤ Current Status", value: status, inline: true },
        { name: "➤ Activity", value: activity, inline: true },
        {
          name: "➤ Avatar link",
          value: `[Click Here](${targetMember.user.displayAvatarURL()})`,
          inline: true,
        },
        {
          name: "➤ Account Created",
          value: targetMember.user.createdAt.toLocaleDateString("en-US"),
          inline: true,
        },
        {
          name: "➤ Joined Server",
          value: targetMember.joinedAt?.toLocaleDateString("en-US") ?? "Unknown",
          inline: true,
        },
        {
          name: "➤ Roles",
          value: targetMember.roles.cache.map((r) => r.toString()).join(", ") || "None",
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${requester.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
