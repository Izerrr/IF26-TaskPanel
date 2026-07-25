import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { reply } from "../../lib/context.js";
import { createWelcomeEmbed } from "../../lib/welcomeEmbed.js";

const command: Command = {
  name: "welcome",
  category: "system",
  description: "Uji coba tampilan pesan sambutan (welcome)",
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Uji coba pengiriman pesan sambutan (welcome)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild), // Hanya Admin yang bisa ngetes

  async run(client, context) {
    const guild = context.guild;
    const member = context.member as GuildMember;
    if (!guild || !member) return;

    // Membuat embed tes berdasarkan profile user yang mengetik perintah
    const embed = createWelcomeEmbed(member, guild);
    await reply(context, { embeds: [embed] });
  },
};

export default command;
