// Simple in-memory queue manager used by play.js / skip.js / leave.js
// Map<guildId, { connection, player, textChannel, songs: [] }>
const queue = new Map();

module.exports = queue;
