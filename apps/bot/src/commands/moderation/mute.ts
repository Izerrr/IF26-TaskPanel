import ms from "ms";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getStringArg, isSlash, reply, sendChannel } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "mute",
  category: "moderation",
  description: "Mute seorang member",
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin di-mute").setRequired(true))
    .addStringOption((option) => option.setName("duration").setDescription("Durasi mute (Contoh: 1h, 30m, 10s)").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageRoles))) return;

    const guild = context.guild;
    if (!guild) return;

    const targetUser = isSlash(context) ? context.options.getUser("target") : context.mentions.users.first();
    if (!targetUser) {
      await reply(context, { content: "Please specify a user to mute.", ephemeral: true });
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
      await reply(context, {
        content: "Required roles (Visitor / Inmate) not found. Please set them up first.",
        ephemeral: true,
      });
      return;
    }

    await memberTarget.roles.remove(mainRole.id);
    await memberTarget.roles.add(muteRole.id);

    const durationInput = getStringArg(context, args, "duration", 1);

    if (!durationInput) {
      await reply(context, { content: `<@${memberTarget.user.id}> has been muted` });
      return;
    }

    const duration = ms(durationInput as Parameters<typeof ms>[0]);
    if (!duration) {
      await reply(context, { content: "Invalid time format. Example: `1h`, `30m`, `10s`", ephemeral: true });
      return;
    }

    await reply(context, { content: `<@${memberTarget.user.id}> has been muted for **${ms(duration as any)}**` });

    setTimeout(async () => {
      await memberTarget.roles.remove(muteRole.id).catch(() => {});
      await memberTarget.roles.add(mainRole.id).catch(() => {});
      await sendChannel(context.channel, { content: `<@${memberTarget.user.id}> has been unmuted.` });
    }, duration as any);
  },
};

export default command;
