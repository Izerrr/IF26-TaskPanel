import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";

const command: Command = {
  name: "leavestay",
  category: "utility",
  description: "Mengeluarkan bot dari Voice Channel tempat ia standby",
  data: new SlashCommandBuilder().setName("leavestay").setDescription("Mengeluarkan bot dari Voice Channel tempat ia standby"),

  async run(client, context) {
    const guild = context.guild;
    if (!guild) return;

    const connection = getVoiceConnection(guild.id);

    if (connection) {
      connection.destroy();
      await reply(context, { content: "👋 **Bot Stay Mode:** Berhasil keluar dari Voice Channel.", ephemeral: false });
    } else {
      await reply(context, { content: "❌ Bot sedang tidak berada di Voice Channel mana pun.", ephemeral: true });
    }
  },
};

export default command;
