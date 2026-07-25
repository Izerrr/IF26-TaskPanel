// Simple pure-JS key-value storage backed by a JSON file.
// Replaces quick.db so we don't need better-sqlite3 (native compilation,
// requires Visual Studio Build Tools on Windows — a pain for most users).
//
// API mirrors quick.db's sync style: get(key), set(key, value), delete(key)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = __dirname;
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

type JsonRecord = Record<string, unknown>;

function ensureFile(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "{}");
}

function readAll(): JsonRecord {
  ensureFile();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}") as JsonRecord;
  } catch {
    return {};
  }
}

function writeAll(data: JsonRecord): void {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function get<T = unknown>(key: string): T | undefined {
  return readAll()[key] as T | undefined;
}

export function set<T = unknown>(key: string, value: T): T {
  const data = readAll();
  data[key] = value;
  writeAll(data);
  return value;
}

export function deleteKey(key: string): boolean {
  const data = readAll();
  const existed = key in data;
  delete data[key];
  writeAll(data);
  return existed;
}

export default { get, set, delete: deleteKey };
