import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getStringArg, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "nickname",
  aliases: ["nick"],
  category: "moderation",
  description: "Ganti nickname seorang member",
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Mengubah nama panggilan (nickname) seorang member server")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin diganti namanya").setRequired(true))
    .addStringOption((option) => option.setName("name").setDescription("Nickname baru").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageNicknames))) return;

    const guild = context.guild;
    if (!guild) return;

    const targetMember: GuildMember | null | undefined = isSlash(context)
      ? (context.options.getMember("target") as GuildMember | null)
      : guild.members.cache.get(context.mentions.users.first()?.id ?? "") ?? guild.members.cache.get(args[0]);

    if (!targetMember) {
      await reply(context, { content: "Please mention a user or provide a valid ID.", ephemeral: true });
      return;
    }

    const newNick = getStringArg(context, args, "name", 1);
    if (!newNick) {
      await reply(context, { content: "Please provide a new nickname.", ephemeral: true });
      return;
    }

    if (!targetMember.manageable) {
      await reply(context, { content: "I can't change this member's nickname (role hierarchy issue).", ephemeral: true });
      return;
    }

    try {
      await targetMember.setNickname(newNick);
    } catch {
      await reply(context, { content: "Failed to change nickname.", ephemeral: true });
      return;
    }

    await reply(context, { content: `✅ Changed **${targetMember.user.tag}**'s nickname to **${newNick}**` });
  },
};

export default command;
