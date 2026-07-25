import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "unmute",
  category: "moderation",
  description: "Unmute seorang member",
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Mengembalikan akses bicara seorang member (unmute)")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-unmute").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async run(client, context) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageRoles))) return;

    const guild = context.guild;
    if (!guild) return;

    const targetUser = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();
    if (!targetUser) {
      await reply(context, { content: "Please mention a user to unmute.", ephemeral: true });
      return;
    }

    const memberTarget = guild.members.cache.get(targetUser.id);
    if (!memberTarget) {
      await reply(context, { content: "Can't find that member!", ephemeral: true });
      return;
    }

    const mainRole = guild.roles.cache.find((role) => role.name === "Visitor");
    const muteRole = guild.roles.cache.find((role) => role.name === "Inmate");

    if (!mainRole || !muteRole) {
      await reply(context, { content: "Required roles (Visitor / Inmate) not found.", ephemeral: true });
      return;
    }

    if (!memberTarget.roles.cache.has(muteRole.id)) {
      await reply(context, { content: `${targetUser.username} is not muted.`, ephemeral: true });
      return;
    }

    await memberTarget.roles.remove(muteRole.id);
    await memberTarget.roles.add(mainRole.id);

    await reply(context, { content: `✅ <@${memberTarget.user.id}> has been unmuted.` });
  },
};

export default command;
