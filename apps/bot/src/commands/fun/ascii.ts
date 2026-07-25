import { SlashCommandBuilder } from "discord.js";
import figlet from "figlet";
import { Command } from "../../types.js";
import { getStringArg, reply } from "../../lib/context.js";

const command: Command = {
  name: "ascii",
  description: "Converts text to ASCII art",
  category: "fun",
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Mengubah teks biasa menjadi teks seni ASCII art")
    .addStringOption((option) =>
      option.setName("teks").setDescription("Teks yang ingin diubah menjadi ASCII").setRequired(true)
    ),

  async run(client, context, args) {
    const msg = getStringArg(context, args, "teks");

    if (!msg) {
      await reply(context, { content: "Teks tidak boleh kosong!", ephemeral: true });
      return;
    }

    const data = await new Promise<string | null>((resolve) => {
      figlet.text(msg, (err, result) => resolve(err ? null : result ?? null));
    });

    if (!data) {
      await reply(context, { content: "Something went wrong", ephemeral: true });
      return;
    }
    if (data.length > 2000) {
      await reply(context, { content: "Text is too long!", ephemeral: true });
      return;
    }

    await reply(context, { content: "```" + data + "```" });
  },
};

export default command;
