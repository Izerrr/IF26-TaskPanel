import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";

const command: Command = {
  name: "clear",
  aliases: ["purge", "nuke"],
  category: "moderation",
  description: "Clear/hapus pesan di channel",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear/hapus pesan di channel")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Jumlah pesan yang ingin dihapus (1-100)").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageMessages))) return;

    const channel = context.channel as TextChannel;
    const amountInput = isSlash(context) ? context.options.getInteger("amount") : parseInt(args[0], 10);

    if (!amountInput || Number.isNaN(amountInput) || amountInput <= 0) {
      await reply(context, { content: "Yeah.... That's not a valid number.", ephemeral: true });
      return;
    }

    const deleteAmount = Math.min(amountInput, 100);

    // Hapus pesan perintah asli (hanya untuk jalur Prefix, karena Slash tidak ada pesan teksnya)
    if (!isSlash(context)) {
      await context.delete().catch(() => {});
    }

    try {
      const deleted = await channel.bulkDelete(deleteAmount, true);
      await reply(context, { content: `I deleted \`${deleted.size}\` messages.` });
    } catch (err) {
      await reply(context, { content: `Something went wrong... ${err}`, ephemeral: true });
    }
  },
};

export default command;
