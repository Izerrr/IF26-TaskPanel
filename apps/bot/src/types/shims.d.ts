// Some dependencies (translate-google, weather-js, yt-search) don't ship
// their own TypeScript types and have no @types/* package on npm. These
// shims are intentionally loose (`any`) — just enough for tsc to compile;
// each call site still narrows the shape it actually reads.

declare module "translate-google" {
  interface TranslateOptions {
    to: string;
    from?: string;
  }
  function translate(text: string, options: TranslateOptions): Promise<string>;
  export default translate;
}

declare module "weather-js" {
  interface WeatherFindOptions {
    search: string;
    degreeType?: "C" | "F";
  }
  export function find(options: WeatherFindOptions, callback: (err: unknown, result: any[]) => void): void;
}

declare module "yt-search" {
  interface YtVideo {
    title: string;
    url: string;
    videoId: string;
    timestamp: string;
    seconds: number;
  }
  interface YtSearchResult {
    videos: YtVideo[];
  }
  function ytSearch(query: string): Promise<YtSearchResult>;
  export default ytSearch;
}
