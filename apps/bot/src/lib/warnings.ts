import * as db from "../handlers/jsonStore.js";

export interface Warning {
  reason: string;
  by: string;
  date: string;
}

export function warningsKey(guildId: string, userId: string): string {
  return `warnings_${guildId}_${userId}`;
}

export function getWarnings(guildId: string, userId: string): Warning[] {
  return db.get<Warning[]>(warningsKey(guildId, userId)) ?? [];
}

export function addWarning(guildId: string, userId: string, warning: Warning): Warning[] {
  const warnings = getWarnings(guildId, userId);
  warnings.push(warning);
  db.set(warningsKey(guildId, userId), warnings);
  return warnings;
}

export function clearWarnings(guildId: string, userId: string): boolean {
  return db.deleteKey(warningsKey(guildId, userId));
}
