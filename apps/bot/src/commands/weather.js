const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const weather = require("weather-js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "weather",
  description: "Cek cuaca di suatu kota",
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Cek cuaca di suatu kota")
    .addStringOption((option) => option.setName("city").setDescription("Nama kota yang ingin dicek cuacanya").setRequired(true)),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;
    const city = isSlash ? context.options.getString("city") : args.join(" ");

    if (!city) {
      return isSlash ? context.reply({ content: "Please provide a city name! Example: `/weather Jakarta`", ephemeral: true }) : channel.send("Please provide a city name! Example: `a!weather Jakarta`");
    }

    // Menghindari timeout Discord API 3 detik karena pencarian cuaca butuh proses fetching
    if (isSlash) await context.deferReply();

    weather.find({ search: city, degreeType: "C" }, async (err, result) => {
      if (err || !result || result.length === 0) {
        const noCityMsg = `Couldn't find weather for **${city}**. Try a different city.`;
        return isSlash ? context.editReply({ content: noCityMsg }) : channel.send(noCityMsg);
      }

      const current = result[0].current;
      const location = result[0].location;

      const embed = new EmbedBuilder()
        .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
        .setTitle(`🌤️ Weather in ${location.name}`)
        .setColor("#A9908A")
        .setThumbnail(current.imageUrl)
        .addFields(
          { name: "🌡️ Temperature", value: `${current.temperature}°C`, inline: true },
          { name: "💧 Humidity", value: `${current.humidity}%`, inline: true },
          { name: "💨 Wind Speed", value: `${current.windspeed} km/h`, inline: true },
          { name: "☁️ Sky", value: current.skytext, inline: true },
          { name: "🌅 Feels Like", value: `${current.feelslike}°C`, inline: true },
          { name: "📅 Date", value: `${current.observationtime} ${current.observationpoint}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash) {
        await context.editReply({ embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }
    });
  },
};
