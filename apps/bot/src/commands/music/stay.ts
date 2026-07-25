import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";

// Deployment-specific — moved out of source into env so this isn't hardcoded
// per-server. Falls back to the original channel ID if unset.
const TARGET_VOICE_ID = process.env.STAY_VOICE_CHANNEL_ID ?? "1420739800268279928";

const command: Command = {
  name: "stay",
  category: "utility",
  description: "Membuat bot masuk dan standby di Voice Channel secara permanen",
  data: new SlashCommandBuilder().setName("stay").setDescription("Membuat bot masuk dan standby di Voice Channel secara permanen"),

  async run(client, context) {
    const guild = context.guild;
    if (!guild) return;

    try {
      joinVoiceChannel({
        channelId: TARGET_VOICE_ID,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true, // Hemat resource panel Pterodactyl
        selfMute: true,
      });

      await reply(context, {
        content: "🔊 **Bot Stay Mode:** Berhasil masuk dan standby di Voice Channel.",
        ephemeral: false,
      });
    } catch (error) {
      console.error(error);
      await reply(context, {
        content: "❌ Gagal memasuki Voice Channel. Pastikan bot punya izin!",
        ephemeral: true,
      });
    }
  },
};

export default command;
