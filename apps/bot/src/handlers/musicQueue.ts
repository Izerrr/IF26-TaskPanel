import type { VoiceConnection, AudioPlayer } from "@discordjs/voice";
import type { TextBasedChannel } from "discord.js";

export interface Song {
  title: string;
  url: string;
  requestedBy: string;
}

export interface GuildQueue {
  connection: VoiceConnection;
  player: AudioPlayer;
  textChannel: TextBasedChannel;
  songs?: Song[];
}

// Map<guildId, GuildQueue> — in-memory, so it resets on bot restart/redeploy.
const queue = new Map<string, GuildQueue>();

export default queue;
