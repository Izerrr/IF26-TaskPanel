import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";
import { clearWarnings, getWarnings } from "../../lib/warnings.js";

const command: Command = {
  name: "deletewarns",
  category: "moderation",
  description: "Hapus semua warnings seorang member",
  data: new SlashCommandBuilder()
    .setName("deletewarns")
    .setDescription("Menghapus total riwayat seluruh pelanggaran (warnings) seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin dibersihkan warning-nya").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageGuild))) return;

    const guild = context.guild;
    if (!guild) return;

    const author = getAuthor(context);
    const userTarget = isSlash(context)
      ? context.options.getUser("target")
      : context.mentions.users.first() ?? (await client.users.fetch(args[0]).catch(() => null));

    if (!userTarget) {
      await reply(context, { content: "Please specify a user via mention or ID", ephemeral: true });
      return;
    }
    if (userTarget.bot) {
      await reply(context, { content: "You can't manage bot warnings", ephemeral: true });
      return;
    }
    if (userTarget.id === author.id) {
      await reply(context, { content: "You can't clear your own warnings", ephemeral: true });
      return;
    }

    const warnings = getWarnings(guild.id, userTarget.id);
    if (warnings.length === 0) {
      await reply(context, { content: `**${userTarget.username} has no warnings**` });
      return;
    }

    clearWarnings(guild.id, userTarget.id);
    await reply(context, { content: `✅ Cleared all warnings for **${userTarget.username}**` });
  },
};

export default command;
