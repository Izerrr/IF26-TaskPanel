import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { isSlash, reply } from "../../lib/context.js";

const command: Command = {
  name: "ship",
  category: "fun",
  description: "Ship dua orang!",
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Menghitung tingkat kecocokan (match percentage) antara dua orang user")
    .addUserOption((option) => option.setName("user1").setDescription("Orang pertama").setRequired(true))
    .addUserOption((option) => option.setName("user2").setDescription("Orang kedua").setRequired(true)),

  async run(client, context, args) {
    const guild = context.guild;
    if (!guild) return;

    let firstUser: GuildMember | null | undefined;
    let secondUser: GuildMember | null | undefined;

    if (isSlash(context)) {
      firstUser = context.options.getMember("user1") as GuildMember | null;
      secondUser = context.options.getMember("user2") as GuildMember | null;
    } else {
      if (!args[0]) {
        await reply(context, { content: "You forgot to mention someone!" });
        return;
      }
      if (!args[1]) {
        await reply(context, { content: "You need to mention someone else!" });
        return;
      }

      firstUser = context.mentions.members?.first() ?? guild.members.cache.get(args[0]);
      secondUser = context.mentions.members?.at(1) ?? guild.members.cache.get(args[1]);
    }

    if (!firstUser) {
      await reply(context, {
        content: `I couldn't find someone named **${isSlash(context) ? "user1" : args[0]}**!`,
        ephemeral: true,
      });
      return;
    }
    if (!secondUser) {
      await reply(context, {
        content: `I couldn't find someone named **${isSlash(context) ? "user2" : args[1]}**!`,
        ephemeral: true,
      });
      return;
    }

    const firstSliced = firstUser.user.username.slice(0, Math.ceil(firstUser.user.username.length / 2));
    const secondSliced = secondUser.user.username.slice(Math.floor(secondUser.user.username.length / 2));

    const percentage = Math.floor(Math.random() * 101);
    const replyText = `💕 ${firstUser.user.username} + ${secondUser.user.username} = **${firstSliced}${secondSliced}** (${percentage}% match)`;

    await reply(context, { content: replyText });
  },
};

export default command;
