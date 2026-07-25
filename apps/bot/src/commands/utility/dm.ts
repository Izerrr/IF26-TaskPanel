import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getStringArg, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "dm",
  category: "utility",
  description: "Mengirimkan pesan langsung (DM) ke user tertentu lewat bot",
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Mengirimkan pesan langsung (DM) ke user tertentu")
    .addUserOption((option) => option.setName("target").setDescription("User target").setRequired(true))
    .addStringOption((option) => option.setName("pesan").setDescription("Isi pesan yang ingin dikirim").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageMessages))) return;

    const targetUser = isSlash(context)
      ? context.options.getUser("target")
      : context.mentions.users.first() ?? client.users.cache.get(args[0]);
    const messageContent = getStringArg(context, args, "pesan", 1);

    if (!targetUser) {
      await reply(context, { content: "❌ User tidak ditemukan. Berikan mention atau ID yang valid.", ephemeral: true });
      return;
    }
    if (!messageContent) {
      await reply(context, { content: "❌ Mohon tulis isi pesan yang ingin dikirim.", ephemeral: true });
      return;
    }

    try {
      await targetUser.send(messageContent);
      await reply(context, { content: `✅ Sukses mengirimkan DM ke **${targetUser.tag}**.`, ephemeral: true });
    } catch {
      await reply(context, {
        content: `❌ Gagal mengirimkan DM ke ${targetUser.tag} (Mungkin DM mereka ditutup).`,
        ephemeral: true,
      });
    }
  },
};

export default command;
