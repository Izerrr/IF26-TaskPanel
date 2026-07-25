import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";
import { BRAND_COLOR } from "../../lib/constants.js";

const command: Command = {
  name: "utilities",
  category: "utility",
  description: "Menampilkan info sub-menu utilitas",
  data: new SlashCommandBuilder().setName("utilities").setDescription("Menampilkan info sub-menu utilitas"),

  async run(client, context) {
    const embed = new EmbedBuilder()
      .setTitle("🛠️ Utilities Module")
      .setDescription(
        "Gunakan perintah berikut untuk utilitas server:\n- `/weather` - Cek cuaca\n- `/calculate` - Kalkulator\n- `/translate` - Penerjemah bahasa"
      )
      .setColor(BRAND_COLOR)
      .setTimestamp();

    await reply(context, { embeds: [embed] });
  },
};

export default command;
