const { EmbedBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = (client, message) => {
  if (message.author.bot) return;

  // Auto-responder
  if (message.content.startsWith("Selamat Malam")) {
    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setTitle("Hello There! ")
      .setDescription(`Selamat malam juga kak ${message.author.username}~`)
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setImage("https://tenor.com/view/walking-anime-goodbye-gif-20674172.gif")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal`, iconURL: FOOTER_ICON });

    return message.reply({ embeds: [embed] });
  }

  if (message.content.startsWith("Selamat Pagi")) {
    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setTitle("Hello There! ")
      .setDescription(`Selamat pagi juga kak ${message.author.username}~`)
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setImage("https://tenor.com/view/walking-anime-goodbye-gif-20674172.gif")
      .setTimestamp()
      .setFooter({ text: `insyaallah halal`, iconURL: FOOTER_ICON });

    return message.reply({ embeds: [embed] });
  }

  // Prefix command handler
  const prefix = "a!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd);
  if (command) command.run(client, message, args);
};
