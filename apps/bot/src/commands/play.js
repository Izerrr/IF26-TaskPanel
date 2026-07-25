const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const queue = require("../handlers/musicQueue");

const isURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  name: "play",
  description: "Joins and plays a video from youtube",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Memutar musik dari YouTube lewat Voice Channel")
    .addStringOption((option) => option.setName("query").setDescription("Nama lagu atau URL YouTube").setRequired(true)),

  async run(client, context, args) {
    const isSlash = context.isChatInputCommand?.();
    const guild = context.guild;
    const member = context.member;
    const channel = context.channel;

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return isSlash ? context.reply({ content: "You need to be in a voice channel to run this command!", ephemeral: true }) : channel.send("You need to be in a voice channel to run this command!");
    }

    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
      return isSlash ? context.reply({ content: "You don't have the correct permissions", ephemeral: true }) : channel.send("You don't have the correct permissions");
    }

    const queryInput = isSlash ? context.options.getString("query") : args.join(" ");
    if (!queryInput || queryInput.trim() === "") {
      return isSlash ? context.reply({ content: "You need to input the song name or a URL", ephemeral: true }) : channel.send("You need to input the song name or a URL");
    }

    // Tunda balasan khusus untuk Slash karena proses search yt membutuhkan waktu lebih dari 3 detik
    if (isSlash) await context.deferReply();

    let videoUrl, videoTitle;
    const firstWord = isSlash ? queryInput : args[0];

    if (isURL(firstWord)) {
      videoUrl = firstWord;
      videoTitle = "Music from a Link";
    } else {
      const searchResult = await ytSearch(queryInput).catch(() => null);
      const video = searchResult?.videos?.[0];
      if (!video) {
        const noRes = "No video results found";
        return isSlash ? context.editReply({ content: noRes }) : channel.send(noRes);
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
      } catch (e) {
        connection.destroy();
        const failJoin = "Failed to join the voice channel.";
        return isSlash ? context.editReply({ content: failJoin }) : channel.send(failJoin);
      }

      serverQueue = { connection, player, textChannel: channel };
      queue.set(guild.id, serverQueue);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        queue.delete(guild.id);
      });

      player.on("error", (err) => {
        console.error(err);
        channel.send("An error occurred while playing audio.");
        connection.destroy();
        queue.delete(guild.id);
      });
    }

    try {
      const stream = ytdl(videoUrl, { filter: "audioonly", highWaterMark: 1 << 25 });
      const resource = createAudioResource(stream);
      serverQueue.player.play(resource);

      const playText = `Now playing "**${videoTitle}**"! Please enjoy your music! 🎶`;
      if (isSlash) await context.editReply({ content: playText });
      else await context.reply(playText);
    } catch (e) {
      const errPlay = "Failed to play that track. Try another link or search term.";
      if (isSlash) await context.editReply({ content: errPlay });
      else channel.send(errPlay);
    }
  },
};
