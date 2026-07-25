const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const math = require("mathjs");

const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "calculate",
  description: "Kalkulator matematika",
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Kalkulator matematika")
    .addStringOption((option) => option.setName("ekspresi").setDescription("Rumus/angka matematika (Contoh: 10 + 5 * 2)").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;
    const expression = isSlash ? context.options.getString("ekspresi") : args.join(" ");

    if (!expression) {
      return isSlash ? context.reply({ content: "Masukkan rumus matematika!", ephemeral: true }) : channel.send("Please provide a math expression");
    }

    let resp;
    try {
      resp = math.evaluate(expression);
    } catch (e) {
      const invalidMsg = "Please provide a **valid** math expression";
      return isSlash ? context.reply({ content: invalidMsg, ephemeral: true }) : channel.send(invalidMsg);
    }

    const embed = new EmbedBuilder()
      .setColor("#A9908A")
      .setTitle("Calculator")
      .addFields({ name: "Expression", value: `\`\`\`css\n${expression}\`\`\`` }, { name: "Answer", value: `\`\`\`css\n${resp}\`\`\`` })
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON });

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
