import { ExtendedClient } from "../types.js";

export const once = true;
export const execute = (client: ExtendedClient) => {
  console.log(`🤖 Bot online! Logged in as ${client.user?.tag}`);
};
