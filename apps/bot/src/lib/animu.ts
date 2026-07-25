import axios from "axios";

/** Fetches a random reaction gif URL from some-random-api.com/animu/<endpoint>. */
export async function fetchAnimuGif(endpoint: "hug" | "pat" | "wink"): Promise<string | null> {
  try {
    const response = await axios.get<{ link: string }>(`https://some-random-api.com/animu/${endpoint}`);
    return response.data.link;
  } catch {
    return null;
  }
}
