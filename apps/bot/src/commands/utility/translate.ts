import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import translate from "translate-google";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply, sendChannel } from "../../lib/context.js";
import { BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "translate",
  category: "utility",
  description: "Translate teks ke bahasa lain",
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate teks ke bahasa lain")
    .addStringOption((option) => option.setName("language").setDescription("Kode bahasa target (Contoh: en, id, ja)").setRequired(true))
    .addStringOption((option) => option.setName("text").setDescription("Teks yang ingin diterjemahkan").setRequired(true)),

  async run(client, context, args) {
    const author = getAuthor(context);

    const lang = isSlash(context) ? context.options.getString("language") : args[0];
    const text = isSlash(context) ? context.options.getString("text") : args.slice(1).join(" ");

    if (!lang || !text) {
      await reply(context, {
        content: isSlash(context)
          ? "Format salah! Gunakan: `/translate language:en text:Halo`"
          : "Usage: `a!translate [language code] [text]`\nExample: `a!translate en Halo dunia`",
        ephemeral: true,
      });
      return;
    }

    if (isSlash(context)) await context.deferReply();

    try {
      const result = await translate(text, { to: lang });

      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🌐 Translation")
        .addFields({ name: "Original", value: text }, { name: `Translated (${lang})`, value: result })
        .setTimestamp()
        .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash(context)) await context.editReply({ embeds: [embed] });
      else await sendChannel(context.channel, { embeds: [embed] });
    } catch {
      const errMsg = "Translation failed. Make sure you used a valid language code (e.g., `en`, `id`, `ja`)";
      if (isSlash(context)) await context.editReply({ content: errMsg });
      else await sendChannel(context.channel, { content: errMsg });
    }
  },
};

export default command;
