const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "covid",
  description: "Track COVID-19 cases by country or worldwide",
  data: new SlashCommandBuilder()
    .setName("covid")
    .setDescription("Melacak data kasus statistik COVID-19")
    .addStringOption((option) => option.setName("target").setDescription("Ketik nama negara (Contoh: Indonesia) atau 'all' untuk statistik global").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;
    const countries = isSlash ? context.options.getString("target") : args.join(" ");

    if (!countries) {
      const noArgsEmbed = new EmbedBuilder()
        .setTitle("Missing arguments")
        .setColor(0xff0000)
        .setDescription("Usage: `a!covid all` or `a!covid Indonesia`")
        .setTimestamp()
        .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });
      return channel.send({ embeds: [noArgsEmbed] });
    }

    if (isSlash) await context.deferReply();

    const checkType = isSlash ? countries : args[0];
    const url = checkType === "all" ? "https://covid19.mathdro.id/api" : `https://covid19.mathdro.id/api/countries/${countries}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const confirmed = data.confirmed.value.toLocaleString();
      const recovered = data.recovered.value.toLocaleString();
      const deaths = data.deaths.value.toLocaleString();

      const embed = new EmbedBuilder()
        .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
        .setColor("#A9908A")
        .setTitle("Hello There! ")
        .setThumbnail("https://www.apsf.org/wp-content/uploads/newsletters/2020/3502/coronavirus-covid-19.png")
        .setDescription(checkType === "all" ? "Worldwide COVID-19 Stats 🌎" : `COVID-19 Stats for **${countries}**`)
        .addFields({ name: "➤ Confirmed Cases", value: confirmed }, { name: "➤ Recovered", value: recovered }, { name: "➤ Deaths", value: deaths })
        .setImage("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
        .setTimestamp()
        .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

      if (isSlash) {
        await context.editReply({ embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }
    } catch (e) {
      const errMsg = "Invalid country provided or API error. Try `all` for worldwide stats.";
      if (isSlash) await context.editReply({ content: errMsg });
      else channel.send(errMsg);
    }
  },
};
