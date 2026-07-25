import { EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "suggest",
  category: "utility",
  description: "Kirim saran ke channel suggestions",
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Kirim saran ke channel suggestions")
    .addStringOption((option) => option.setName("saran").setDescription("Isi saran/rekomendasi untuk server").setRequired(true)),

  async run(client, context, args) {
    const guild = context.guild;
    const channel = context.channel as TextChannel;
    if (!guild || !channel) return;

    const author = getAuthor(context);
    const suggestion = isSlash(context) ? context.options.getString("saran") : args.join(" ");

    if (!suggestion) {
      await reply(context, {
        content: isSlash(context) ? "Saran tidak boleh kosong!" : "Please provide a suggestion! Example: `a!suggest Add more commands!`",
        ephemeral: true,
      });
      return;
    }

    const suggestChannel = guild.channels.cache.find((c) => c.name === "suggestions" || c.name === "saran") as
      | TextChannel
      | undefined;

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
      .setTitle("💡 New Suggestion")
      .setDescription(suggestion)
      .setColor(BRAND_COLOR)
      .setTimestamp()
      .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON });

    const target = suggestChannel ?? channel;
    const sent = await target.send({ embeds: [embed] });
    await sent.react("👍");
    await sent.react("👎");

    if (suggestChannel && suggestChannel.id !== channel.id) {
      await reply(context, { content: `✅ Your suggestion has been sent to ${suggestChannel}!`, ephemeral: true });
    } else if (isSlash(context)) {
      await reply(context, { content: "✅ Your suggestion has been posted here!", ephemeral: true });
    }
  },
};

export default command;
