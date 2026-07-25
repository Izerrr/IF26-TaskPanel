import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as weather from "weather-js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply, sendChannel } from "../../lib/context.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "weather",
  category: "utility",
  description: "Cek cuaca di suatu kota",
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Cek cuaca di suatu kota")
    .addStringOption((option) => option.setName("city").setDescription("Nama kota yang ingin dicek cuacanya").setRequired(true)),

  async run(client, context, args) {
    const author = getAuthor(context);
    const city = isSlash(context) ? context.options.getString("city") : args.join(" ");

    if (!city) {
      await reply(context, {
        content: isSlash(context)
          ? "Please provide a city name! Example: `/weather Jakarta`"
          : "Please provide a city name! Example: `a!weather Jakarta`",
        ephemeral: true,
      });
      return;
    }

    // Menghindari timeout Discord API 3 detik karena pencarian cuaca butuh proses fetching
    if (isSlash(context)) await context.deferReply();

    weather.find({ search: city, degreeType: "C" }, async (err, result) => {
      if (err || !result || result.length === 0) {
        const noCityMsg = `Couldn't find weather for **${city}**. Try a different city.`;
        if (isSlash(context)) await context.editReply({ content: noCityMsg });
        else await sendChannel(context.channel, { content: noCityMsg });
        return;
      }

      const current = result[0].current;
      const location = result[0].location;

      const embed = new EmbedBuilder()
        .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
        .setTitle(`🌤️ Weather in ${location.name}`)
        .setColor(BRAND_COLOR)
        .setThumbnail(current.imageUrl)
        .addFields(
          { name: "🌡️ Temperature", value: `${current.temperature}°C`, inline: true },
          { name: "💧 Humidity", value: `${current.humidity}%`, inline: true },
          { name: "💨 Wind Speed", value: `${current.windspeed} km/h`, inline: true },
          { name: "☁️ Sky", value: current.skytext, inline: true },
          { name: "🌅 Feels Like", value: `${current.feelslike}°C`, inline: true },
          { name: "📅 Date", value: `${current.observationtime} ${current.observationpoint}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash(context)) await context.editReply({ embeds: [embed] });
      else await sendChannel(context.channel, { embeds: [embed] });
    });
  },
};

export default command;
