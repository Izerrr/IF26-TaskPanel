import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply, sendChannel } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

interface CovidStat {
  confirmed: { value: number };
  recovered: { value: number };
  deaths: { value: number };
}

const command: Command = {
  name: "covid",
  category: "utility",
  description: "Track COVID-19 cases by country or worldwide",
  data: new SlashCommandBuilder()
    .setName("covid")
    .setDescription("Melacak data kasus statistik COVID-19")
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("Ketik nama negara (Contoh: Indonesia) atau 'all' untuk statistik global")
        .setRequired(true)
    ),

  async run(client, context, args) {
    const author = getAuthor(context);
    const countries = isSlash(context) ? context.options.getString("target") : args.join(" ");

    if (!countries) {
      const noArgsEmbed = new EmbedBuilder()
        .setTitle("Missing arguments")
        .setColor(0xff0000)
        .setDescription("Usage: `a!covid all` or `a!covid Indonesia`")
        .setTimestamp()
        .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });
      await reply(context, { embeds: [noArgsEmbed] });
      return;
    }

    if (isSlash(context)) await context.deferReply();

    const checkType = isSlash(context) ? countries : args[0];
    const url = checkType === "all" ? "https://covid19.mathdro.id/api" : `https://covid19.mathdro.id/api/countries/${countries}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as CovidStat;

      const confirmed = data.confirmed.value.toLocaleString();
      const recovered = data.recovered.value.toLocaleString();
      const deaths = data.deaths.value.toLocaleString();

      const embed = new EmbedBuilder()
        .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
        .setColor(BRAND_COLOR)
        .setTitle("Hello There! ")
        .setThumbnail("https://www.apsf.org/wp-content/uploads/newsletters/2020/3502/coronavirus-covid-19.png")
        .setDescription(checkType === "all" ? "Worldwide COVID-19 Stats 🌎" : `COVID-19 Stats for **${countries}**`)
        .addFields({ name: "➤ Confirmed Cases", value: confirmed }, { name: "➤ Recovered", value: recovered }, { name: "➤ Deaths", value: deaths })
        .setImage(FOOTER_ICON)
        .setTimestamp()
        .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash(context)) await context.editReply({ embeds: [embed] });
      else await sendChannel(context.channel, { embeds: [embed] });
    } catch {
      const errMsg = "Invalid country provided or API error. Try `all` for worldwide stats.";
      if (isSlash(context)) await context.editReply({ content: errMsg });
      else await sendChannel(context.channel, { content: errMsg });
    }
  },
};

export default command;
