import { EmbedBuilder, Guild, GuildMember } from "discord.js";
import { BRAND_COLOR, FOOTER_ICON, FOOTER_TEXT } from "./constants.js";

// Deployment-specific channel IDs — moved out of source into env so this
// isn't hardcoded per-server. Falls back to the original server's IDs.
const CHANNEL_IDS = {
  welcome: process.env.WELCOME_CHANNEL_ID ?? "572669418866212888",
  rules: process.env.RULES_CHANNEL_ID ?? "795942687755730944",
  info: process.env.INFO_CHANNEL_ID ?? "802108601627443252",
  roles: process.env.ROLES_CHANNEL_ID ?? "797839158981951528",
  chat: process.env.CHAT_CHANNEL_ID ?? "795909005192724490",
};

export function createWelcomeEmbed(member: GuildMember, guild: Guild): EmbedBuilder {
  const rulesChannel = guild.channels.cache.get(CHANNEL_IDS.rules);
  const infoChannel = guild.channels.cache.get(CHANNEL_IDS.info);
  const rolesChannel = guild.channels.cache.get(CHANNEL_IDS.roles);
  const chatChannel = guild.channels.cache.get(CHANNEL_IDS.chat);

  return new EmbedBuilder()
    .setTitle(`Welcome ${member.user.username}!`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setDescription(
      `Selamat datang di server insyaallah halal!\n` +
        `⊱━━━━━━━ « ⋅ʚ♡ɞ⋅ » ━━━━━━━━⊰\n` +
        `<:Check:797756159783337984> Jangan lupa untuk membaca ${rulesChannel ?? "#rules"} dan ${infoChannel ?? "#info"} terlebih dahulu!\n\n` +
        `<:Check:797756159783337984> Ambil Role kalian di ${rolesChannel ?? "#roles"}\n\n` +
        `<:Check:797756159783337984> Setelah semua selesai, kalian bisa memulai percakapan di ${chatChannel ?? "#chat"}\n` +
        `⊱━━━━━━━ « ⋅ʚ♡ɞ⋅ » ━━━━━━━━⊰\n\n` +
        `*Jika masih ada pertanyaan, silahkan menghubungi <@&795909896532787230>, <@&796692841526067210>, atau <@&802136385149468682>\n\n` +
        `<:BlobCoy:797889947998093322> Enjoy your Stay! <:BlobCoy:797889947998093322>`
    )
    .setImage(FOOTER_ICON)
    .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
    .setColor(BRAND_COLOR);
}

export { CHANNEL_IDS };
