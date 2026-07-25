import fs from "fs";
import path from "path";
import { ExtendedClient } from "../types.js";

export async function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(process.cwd(), "src/events");
  if (!fs.existsSync(eventsPath)) return;

  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    const eventName = file.split(".")[0];

    if (event.once) {
      client.once(eventName, (...args) => event.execute(...args, client));
    } else {
      client.on(eventName, (...args) => event.execute(...args, client));
    }
  }
}
