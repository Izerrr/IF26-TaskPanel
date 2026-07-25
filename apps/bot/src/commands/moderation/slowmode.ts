import ms from "ms";
import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "slowmode",
  category: "moderation",
  description: "Set slowmode di channel",
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Mengatur durasi jeda pengiriman pesan (slowmode) pada channel ini")
    .addStringOption((option) => option.setName("time").setDescription("Durasi slowmode (Contoh: 10s, 1m, atau ketik 'off')").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Alasan mengaktifkan slowmode").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageChannels))) return;

    const channel = context.channel as TextChannel;
    const author = getAuthor(context);

    const timeInput = isSlash(context) ? context.options.getString("time") : args[0];
    if (!timeInput) {
      await reply(context, {
        content: "You did not specify a time! Example: `a!slowmode 10s` or `a!slowmode off`",
        ephemeral: true,
      });
      return;
    }

    const reason = (isSlash(context) ? context.options.getString("reason") : args[1] ? args.slice(1).join(" ") : null) ?? "no reason";

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setColor(BRAND_COLOR)
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    if (timeInput === "off") {
      if (channel.rateLimitPerUser === 0) {
        await reply(context, { content: "Slowmode is already off.", ephemeral: true });
        return;
      }

      embed.setTitle("Slowmode Disabled");
      await channel.setRateLimitPerUser(0, reason);
      await reply(context, { embeds: [embed] });
      return;
    }

    const msVal = ms(timeInput as Parameters<typeof ms>[0]);
    const time = (typeof msVal === "number" ? msVal : 0) / 1000;
    if (Number.isNaN(time)) {
      await reply(context, { content: "Not a valid time! Try `10s`, `1m`, `1h`", ephemeral: true });
      return;
    }
    if (time >= 21600) {
      await reply(context, { content: "Slowmode limit too high. Max is 6 hours.", ephemeral: true });
      return;
    }
    if (channel.rateLimitPerUser === time) {
      await reply(context, { content: `Slowmode is already set to ${timeInput}`, ephemeral: true });
      return;
    }

    embed.setTitle("Slowmode Enabled").addFields({ name: "Slowmode", value: timeInput }, { name: "Reason", value: reason });

    await channel.setRateLimitPerUser(time, reason);
    await reply(context, { embeds: [embed] });
  },
};

export default command;
