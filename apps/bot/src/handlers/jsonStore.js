// Simple pure-JS key-value storage backed by a JSON file.
// Replaces quick.db so we don't need better-sqlite3 (native compilation,
// requires Visual Studio Build Tools on Windows — a pain for most users).
//
// API mirrors quick.db's sync style: get(key), set(key, value), delete(key)

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function ensureFile() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '{}');
}

function readAll() {
    ensureFile();
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (e) {
        return {};
    }
}

function writeAll(data) {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function get(key) {
    const data = readAll();
    return data[key];
}

function set(key, value) {
    const data = readAll();
    data[key] = value;
    writeAll(data);
    return value;
}

function deleteKey(key) {
    const data = readAll();
    const existed = key in data;
    delete data[key];
    writeAll(data);
    return existed;
}

module.exports = { get, set, delete: deleteKey };
