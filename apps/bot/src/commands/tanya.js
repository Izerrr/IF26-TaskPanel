const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

const answers = [
  "Iya, pasti!",
  "Tidak mungkin.",
  "Mungkin aja~",
  "Woof! Tentu saja!",
  "Hmm... sepertinya tidak.",
  "Coba lagi nanti!",
  "Jawabannya: Ya!",
  "Kayaknya nggak deh...",
  "Sudah jelas iya!",
  "50/50, siapa tau?",
  "AVIVIION Helper rasa iya!",
  "AVIVIION Helper rasa tidak...",
];

module.exports = {
  name: "tanya",
  description: "Tanya AVIVIION Helper pertanyaan apapun!",
  data: new SlashCommandBuilder()
    .setName("tanya")
    .setDescription("Tanya AVIVIION Helper pertanyaan apapun!")
    .addStringOption((option) => option.setName("pertanyaan").setDescription("Pertanyaan yang ingin kamu tanyakan").setRequired(true)),

  run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;
    const question = isSlash ? context.options.getString("pertanyaan") : args.join(" ");

    if (!question) {
      return isSlash ? context.reply({ content: "Tanya apa dulu? Contoh: `/tanya pertanyaan:Apakah aku ganteng?`", ephemeral: true }) : channel.send("Tanya apa dulu? Contoh: `a!tanya Apakah aku cantik?`");
    }

    const answer = answers[Math.floor(Math.random() * answers.length)];
    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setTitle("🔮 Tanya AVIVIION Helper")
      .addFields({ name: "Pertanyaan", value: question }, { name: "Jawaban AVIVIION Helper", value: answer })
      .setTimestamp()
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    if (isSlash) {
      context.reply({ embeds: [embed] });
    } else {
      channel.send({ embeds: [embed] });
    }
  },
};
