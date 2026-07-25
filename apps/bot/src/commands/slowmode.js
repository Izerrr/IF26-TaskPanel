const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const ms = require("ms");

const AUTHOR_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";
const FOOTER_ICON = "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

module.exports = {
  name: "slowmode",
  description: "Set slowmode di channel",
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Mengatur durasi jeda pengiriman pesan (slowmode) pada channel ini")
    .addStringOption((option) => option.setName("time").setDescription("Durasi slowmode (Contoh: 10s, 1m, atau ketik 'off')").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan mengaktifkan slowmode").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  run: async (client, context, args) => {
    const isSlash = context.isChatInputCommand?.();
    const member = context.member;
    const channel = context.channel;
    const author = isSlash ? context.user : context.author;

    if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const txt = "You do not have **MANAGE_CHANNELS** permission!";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const timeInput = isSlash ? context.options.getString("time") : args[0];
    if (!timeInput) {
      const txt = "You did not specify a time! Example: `a!slowmode 10s` or `a!slowmode off`";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    const reason = (isSlash ? context.options.getString("reason") : args[1] ? args.slice(1).join(" ") : null) || "no reason";

    const embed = new EmbedBuilder()
      .setAuthor({ name: "AVIVIION Helper", iconURL: AUTHOR_ICON })
      .setColor("#A9908A")
      .setFooter({ text: `insyaallah halal | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    if (timeInput === "off") {
      if (channel.rateLimitPerUser === 0) {
        const txt = "Slowmode is already off.";
        return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
      }

      embed.setTitle("Slowmode Disabled");
      await channel.setRateLimitPerUser(0, reason);

      if (isSlash) return context.reply({ embeds: [embed] });
      else return channel.send({ embeds: [embed] });
    }

    const time = ms(timeInput) / 1000;
    if (isNaN(time)) {
      const txt = "Not a valid time! Try `10s`, `1m`, `1h`";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }
    if (time >= 21600) {
      const txt = "Slowmode limit too high. Max is 6 hours.";
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }
    if (channel.rateLimitPerUser === time) {
      const txt = `Slowmode is already set to ${timeInput}`;
      return isSlash ? context.reply({ content: txt, ephemeral: true }) : channel.send(txt);
    }

    embed.setTitle("Slowmode Enabled").addFields({ name: "Slowmode", value: timeInput }, { name: "Reason", value: reason });

    await channel.setRateLimitPerUser(time, reason);

    if (isSlash) {
      await context.reply({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};
