const { REST, Routes } = require("discord.js");
const fs = require("fs");

module.exports = async (client) => {
  const commandsArray = [];
  const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

  console.log(`[SLASH] Memeriksa aturan penamaan untuk ${commandFiles.length} perintah...`);

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    let commandName = "";

    // Mengambil nama dari data builder ataupun object biasa
    if (command.data) {
      commandName = command.data.name;
    } else if (command.name) {
      commandName = command.name;
    }

    if (commandName) {
      // REGEX: Memastikan nama hanya berisi huruf kecil (a-z), angka (0-9), stripe (-), dan underscore (_)
      const isValidSlashName = /^[a-z0-9_-]{1,32}$/.test(commandName);

      if (!isValidSlashName) {
        console.log(`❌ [ERROR PENAMAAN] File "${file}" memiliki nama "${commandName}" yang TIDAK VALID!`);
        console.log(`👉 Solusi: Ubah menjadi huruf kecil semua, tanpa spasi, dan tanpa simbol.`);
        console.log(`--------------------------------------------------`);
      }

      // Masukkan ke array jika lolos pemeriksaan dasar (agar bot tidak langsung crash)
      if (command.data) {
        commandsArray.push(command.data.toJSON());
      } else {
        commandsArray.push({
          name: commandName,
          description: command.description || `Menjalankan perintah ${commandName}`,
        });
      }
    }
  }

  // Proses Deploy ke Discord API menggunakan ID Hardcode atau .env kamu kemarin
  const rest = new REST({ version: "10" }).setToken(process.env.token);

  try {
    console.log(`[SLASH] Mengunggah ${commandsArray.length} perintah ke Server...`);

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commandsArray });

    console.log("✅ [SLASH] Sukses! Semua perintah aktif.");
  } catch (error) {
    console.error("❌ [SLASH] Gagal mendaftarkan ke Discord API:", error);
  }
};
