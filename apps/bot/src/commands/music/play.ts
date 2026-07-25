import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import ytdl from "ytdl-core";
import ytSearch from "yt-search";
import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getStringArg, isSlash, reply, sendChannel } from "../../lib/context.js";
import queue from "../../handlers/musicQueue.js";

function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

const command: Command = {
  name: "play",
  category: "music",
  description: "Joins and plays a video from youtube",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Memutar musik dari YouTube lewat Voice Channel")
    .addStringOption((option) => option.setName("query").setDescription("Nama lagu atau URL YouTube").setRequired(true)),

  async run(client, context, args) {
    const guild = context.guild;
    const member = context.member as GuildMember;
    if (!guild || !member) return;

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await reply(context, { content: "You need to be in a voice channel to run this command!", ephemeral: true });
      return;
    }

    const permissions = client.user && voiceChannel.permissionsFor(client.user);
    if (!permissions?.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
      await reply(context, { content: "You don't have the correct permissions", ephemeral: true });
      return;
    }

    const queryInput = getStringArg(context, args, "query");
    if (!queryInput) {
      await reply(context, { content: "You need to input the song name or a URL", ephemeral: true });
      return;
    }

    // Tunda balasan khusus untuk Slash karena proses search yt membutuhkan waktu lebih dari 3 detik
    if (isSlash(context)) await context.deferReply();

    let videoUrl: string;
    let videoTitle: string;
    const firstWord = isSlash(context) ? queryInput : args[0];

    if (isURL(firstWord)) {
      videoUrl = firstWord;
      videoTitle = "Music from a Link";
    } else {
      const searchResult = await ytSearch(queryInput).catch(() => null);
      const video = searchResult?.videos?.[0];
      if (!video) {
        if (isSlash(context)) await context.editReply({ content: "No video results found" });
        else await sendChannel(context.channel, { content: "No video results found" });
        return;
      }
      videoUrl = video.url;
      videoTitle = video.title;
    }

    let serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      connection.subscribe(player);

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
      } catch {
        connection.destroy();
        if (isSlash(context)) await context.editReply({ content: "Failed to join the voice channel." });
        else await sendChannel(context.channel, { content: "Failed to join the voice channel." });
        return;
      }

      const textChannel = context.channel;
      if (!textChannel) return;

      serverQueue = { connection, player, textChannel };
      queue.set(guild.id, serverQueue);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        queue.delete(guild.id);
      });

      player.on("error", (err) => {
        console.error(err);
        if (textChannel.isSendable()) textChannel.send("An error occurred while playing audio.");
        connection.destroy();
        queue.delete(guild.id);
      });
    }

    try {
      const stream = ytdl(videoUrl, { filter: "audioonly", highWaterMark: 1 << 25 });
      const resource = createAudioResource(stream);
      serverQueue.player.play(resource);

      const playText = `Now playing "**${videoTitle}**"! Please enjoy your music! 🎶`;
      if (isSlash(context)) await context.editReply({ content: playText });
      else await context.reply(playText);
    } catch {
      const errPlay = "Failed to play that track. Try another link or search term.";
      if (isSlash(context)) await context.editReply({ content: errPlay });
      else await sendChannel(context.channel, { content: errPlay });
    }
  },
};

export default command;
