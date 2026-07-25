const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// ID Channel Bawaan Servermu
const welcomeChannelId = "572669418866212888";
const rulesChannelId = "795942687755730944";
const infoChannelId = "802108601627443252";
const rolesChannelId = "797839158981951528";
const chatChannelId = "795909005192724490";

// Helper untuk membuat tampilan cetakan Embed Welcome agar rapi dan tidak duplikat
function createWelcomeEmbed(member, guild) {
  const rulesChannel = guild.channels.cache.get(rulesChannelId);
  const infoChannel = guild.channels.cache.get(infoChannelId);
  const rolesChannel = guild.channels.cache.get(rolesChannelId);
  const chatChannel = guild.channels.cache.get(chatChannelId);

  return new EmbedBuilder()
    .setTitle(`Welcome ${member.user.username}!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .setDescription(
      `Selamat datang di server insyaallah halal!\n` +
        `⊱━━━━━━━ « ⋅ʚ♡ɞ⋅ » ━━━━━━━━⊰\n` +
        `<:Check:797756159783337984> Jangan lupa untuk membaca ${rulesChannel ?? "#rules"} dan ${infoChannel ?? "#info"} terlebih dahulu!\n\n` +
        `<:Check:797756159783337984> Ambil Role kalian di ${rolesChannel ?? "#roles"}\n\n` +
        `<:Check:797756159783337984> Setelah semua selesai, kalian bisa memulai percakapan di ${chatChannel ?? "#chat"}\n` +
        `⊱━━━━━━━ « ⋅ʚ♡ɞ⋅ » ━━━━━━━━⊰\n\n` +
        `*Jika masih ada pertanyaan, silahkan menghubungi <@&795909896532787230>, <@&796692841526067210>, atau <@&802136385149468682>\n\n` +
        `<:BlobCoy:797889947998093322> Enjoy your Stay! <:BlobCoy:797889947998093322>`,
    )
    .setImage("https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&")
    .setFooter({
      text: `insyaallah halal`,
      iconURL: "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&",
    })
    .setColor("#A9908A");
}

// 1. JALUR LAMA: index.js baris 22 akan mengeksekusi fungsi ini dengan aman tanpa error
const welcomeModule = (client) => {
  client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = createWelcomeEmbed(member, member.guild);
    channel.send({ embeds: [embed] });
  });
};

// 2. JALUR BARU: Menempelkan properti Object ke dalam fungsi agar dibaca oleh slash_handler.js
welcomeModule.name = "welcome";
welcomeModule.description = "Uji coba tampilan pesan sambutan (welcome)";
welcomeModule.category = "system";
welcomeModule.data = new SlashCommandBuilder().setName("welcome").setDescription("Uji coba pengiriman pesan sambutan (welcome)").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild); // Hanya Admin yang bisa ngetes

welcomeModule.run = async (client, context, args) => {
  const isSlash = context.isChatInputCommand?.();
  const channel = context.channel;
  const member = context.member;
  const guild = context.guild;

  // Membuat embed tes berdasarkan profile user yang mengetik perintah
  const embed = createWelcomeEmbed(member, guild);

  if (isSlash) {
    await context.reply({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }
};

// Export fungsi utama yang sudah dimodifikasi
module.exports = welcomeModule;
