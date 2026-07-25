import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as math from "mathjs";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "calculate",
  category: "utility",
  description: "Kalkulator matematika",
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Kalkulator matematika")
    .addStringOption((option) => option.setName("ekspresi").setDescription("Rumus/angka matematika (Contoh: 10 + 5 * 2)").setRequired(true)),

  async run(client, context, args) {
    const author = getAuthor(context);
    const expression = isSlash(context) ? context.options.getString("ekspresi") : args.join(" ");

    if (!expression) {
      await reply(context, {
        content: isSlash(context) ? "Masukkan rumus matematika!" : "Please provide a math expression",
        ephemeral: true,
      });
      return;
    }

    let resp: unknown;
    try {
      resp = math.evaluate(expression);
    } catch {
      await reply(context, { content: "Please provide a **valid** math expression", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("Calculator")
      .addFields(
        { name: "Expression", value: `\`\`\`css\n${expression}\`\`\`` },
        { name: "Answer", value: `\`\`\`css\n${resp}\`\`\`` }
      )
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    await reply(context, { embeds: [embed] });
  },
};

export default command;
