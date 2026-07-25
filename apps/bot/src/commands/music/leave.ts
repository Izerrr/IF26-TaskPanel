import { getVoiceConnection } from "@discordjs/voice";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";
import queue from "../../handlers/musicQueue.js";

const command: Command = {
  name: "leave",
  category: "music",
  description: "Mengeluarkan bot musik dari voice channel",
  data: new SlashCommandBuilder().setName("leave").setDescription("Mengeluarkan bot musik dari voice channel"),

  async run(client, context) {
    const guild = context.guild;
    const member = context.member as GuildMember;
    if (!guild || !member) return;

    if (!member.voice.channel) {
      await reply(context, { content: "❌ Anda harus berada di voice channel untuk mengusir bot!", ephemeral: true });
      return;
    }

    const connection = getVoiceConnection(guild.id);
    if (!connection) {
      await reply(context, { content: "❌ Bot tidak sedang tersambung ke voice channel mana pun.", ephemeral: true });
      return;
    }

    connection.destroy();
    queue.delete(guild.id);

    await reply(context, { content: "👋 Berhasil keluar dari voice channel dan mereset antrean musik." });
  },
};

export default command;
