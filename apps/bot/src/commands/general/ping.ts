import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, sendChannel } from "../../lib/context.js";

const command: Command = {
  name: "ping",
  description: "Cek latensi bot",
  data: new SlashCommandBuilder().setName("ping").setDescription("Cek latensi bot"),

  async run(client, context) {
    const latency = Date.now() - context.createdTimestamp;
    const content = `🏓 | This Bot's Latency is: **${latency}ms.**`;

    if (isSlash(context)) {
      await context.reply({ content });
    } else {
      await sendChannel(context.channel, { content });
    }
  },
};

export default command;
