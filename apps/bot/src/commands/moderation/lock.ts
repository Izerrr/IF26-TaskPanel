import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "lock",
  category: "moderation",
  description: "Lock/unlock semua channel di server",
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Mengunci atau membuka kunci pengiriman pesan untuk seluruh channel")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Nyalakan (on) atau matikan (off) penguncian server")
        .setRequired(true)
        .addChoices({ name: "on (Lock All)", value: "on" }, { name: "off (Unlock All)", value: "off" })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageChannels))) return;

    const guild = context.guild;
    if (!guild) return;

    const statusInput = isSlash(context) ? context.options.getString("status") : args[0];
    const channels = guild.channels.cache.filter((ch) => ch.type !== ChannelType.GuildCategory);

    if (statusInput === "on") {
      channels.forEach((ch) => {
        if ("permissionOverwrites" in ch) {
          ch.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false }).catch(() => {});
        }
      });
      await reply(context, { content: "🔒 Locked all channels." });
    } else if (statusInput === "off") {
      channels.forEach((ch) => {
        if ("permissionOverwrites" in ch) {
          ch.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null }).catch(() => {});
        }
      });
      await reply(context, { content: "🔓 Unlocked all channels." });
    } else {
      await reply(context, { content: "Usage: `a!lock on` or `a!lock off`", ephemeral: true });
    }
  },
};

export default command;
