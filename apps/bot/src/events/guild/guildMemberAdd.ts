import { GuildMember, TextChannel } from "discord.js";
import { createWelcomeEmbed, CHANNEL_IDS } from "../../lib/welcomeEmbed.js";

export const execute = async (member: GuildMember) => {
  const channel = member.guild.channels.cache.get(CHANNEL_IDS.welcome) as TextChannel | undefined;
  if (!channel) return;

  const embed = createWelcomeEmbed(member, member.guild);
  await channel.send({ embeds: [embed] });
};
