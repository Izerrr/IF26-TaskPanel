import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { ExtendedClient } from "../types.js";

const baseDir = __dirname;

interface EventModule {
  once?: boolean;
  execute: (...args: unknown[]) => unknown;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) return [fullPath];
    return [];
  });
}

export async function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, "..", "events");
  if (!fs.existsSync(eventsPath)) return;

  const eventFiles = walk(eventsPath);

  for (const filePath of eventFiles) {
    const event: EventModule = await import(pathToFileURL(filePath).href);
    // Event name comes from the filename, not the folder — client/ready.ts
    // and guild/interactionCreate.ts both resolve to their Discord.js
    // event name ("ready", "interactionCreate") regardless of nesting.
    const eventName = path.basename(filePath).split(".")[0];

    if (!eventName || typeof event.execute !== "function") {
      console.warn(`⚠️  Skipping ${filePath} — missing "execute" export.`);
      continue;
    }

    if (event.once) {
      client.once(eventName, (...args) => event.execute(...args, client));
    } else {
      client.on(eventName, (...args) => event.execute(...args, client));
    }
  }
}
