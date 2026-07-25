import { GuildMember, PermissionsBitField } from "discord.js";
import type { CommandContext } from "../types.js";
import { isSlash, reply } from "./context.js";

/**
 * Checks both the invoking member's and the bot's own permissions.
 * Sends a reply and returns false if either is missing, so callers can
 * just `if (!(await requirePermissions(...))) return;`
 */
export async function requirePermissions(
  context: CommandContext,
  permission: bigint
): Promise<boolean> {
  const guild = context.guild;
  const member = context.member as GuildMember | null;

  if (!guild || !member) return false;

  if (!member.permissions.has(permission)) {
    await reply(context, { content: "You can't use that!", ephemeral: true });
    return false;
  }
  if (!guild.members.me?.permissions.has(permission)) {
    await reply(context, { content: "I don't have the right permissions.", ephemeral: true });
    return false;
  }
  return true;
}

/** Resolves the `target` user option (slash) or first mention / raw ID (prefix) to a GuildMember. */
export async function resolveTargetMember(
  context: CommandContext,
  args: string[],
  optionName = "target"
): Promise<GuildMember | null> {
  const guild = context.guild;
  if (!guild) return null;

  if (isSlash(context)) {
    return (context.options.getMember(optionName) as GuildMember | null) ?? null;
  }

  const mentioned = context.mentions.members?.first();
  if (mentioned) return mentioned;

  if (args[0]) {
    return guild.members.fetch(args[0]).catch(() => null);
  }
  return null;
}

export { PermissionsBitField };
