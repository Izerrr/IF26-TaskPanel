import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getAuthor, isSlash, reply } from "../../lib/context.js";
import { requirePermissions } from "../../lib/moderation.js";
import { getWarnings } from "../../lib/warnings.js";
import { AUTHOR_ICON, AUTHOR_NAME, BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "../../lib/constants.js";

const command: Command = {
  name: "warnings",
  category: "moderation",
  description: "Cek warnings seorang member",
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Cek daftar warnings seorang member")
    .addUserOption((option) => option.setName("target").setDescription("Member yang ingin dicek warnings-nya").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async run(client, context, args) {
    if (!(await requirePermissions(context, PermissionFlagsBits.ManageGuild))) return;

    const guild = context.guild;
    if (!guild) return;

    const author = getAuthor(context);
    const userTarget = isSlash(context)
      ? context.options.getUser("target")
      : context.mentions.users.first() ?? (await client.users.fetch(args[0]).catch(() => null));

    if (!userTarget) {
      await reply(context, { content: "Please specify a user via mention or ID", ephemeral: true });
      return;
    }

    const warnings = getWarnings(guild.id, userTarget.id);

    if (warnings.length === 0) {
      await reply(context, { content: `**${userTarget.username} has no warnings**` });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: AUTHOR_NAME, iconURL: AUTHOR_ICON })
      .setTitle(`Warnings for ${userTarget.username}`)
      .setColor(BRAND_COLOR)
      .setDescription(warnings.map((w, i) => `**${i + 1}.** ${w.reason} - by ${w.by} (${w.date})`).join("\n"))
      .setFooter({ text: `${FOOTER_TEXT} | Command requested by: ${author.tag}`, iconURL: FOOTER_ICON })
      .setTimestamp();

    await reply(context, { embeds: [embed] });
  },
};

export default command;
