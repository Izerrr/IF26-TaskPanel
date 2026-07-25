import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";
import queue from "../../handlers/musicQueue.js";

const command: Command = {
  name: "skip",
  category: "music",
  description: "Melewati (skip) lagu musik yang sedang diputar",
  data: new SlashCommandBuilder().setName("skip").setDescription("Melewati (skip) lagu musik yang sedang diputar"),

  async run(client, context) {
    const guild = context.guild;
    const member = context.member as GuildMember;
    if (!guild || !member) return;

    if (!member.voice.channel) {
      await reply(context, { content: "❌ Anda harus berada di voice channel untuk melewati lagu!", ephemeral: true });
      return;
    }

    const serverQueue = queue.get(guild.id);
    if (!serverQueue) {
      await reply(context, { content: "❌ Tidak ada lagu yang sedang diputar saat ini.", ephemeral: true });
      return;
    }

    // Menghentikan player memicu event Idle untuk menghapus koneksi atau memutar lagu berikutnya
    serverQueue.player.stop();

    await reply(context, { content: "⏭️ Lagu berhasil dilewati!" });
  },
};

export default command;
