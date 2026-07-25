export const BRAND_COLOR = "#A9908A" as const;

// NOTE: these are signed Discord CDN URLs (ex/is/hm query params) and
// WILL expire — Discord rotates the signature periodically. Re-upload
// the assets and refresh these constants if the icons stop loading.
export const AUTHOR_ICON =
  "https://cdn.discordapp.com/attachments/882584296131551299/1516677657876758598/704cac241c6ab84d1fce9e4a76e00226.jpg?ex=6a3383a4&is=6a323224&hm=3a94b2993de93e0207d4fdfb8eb6f4e359c28163ad59d9b341a921854be64e11&";

export const FOOTER_ICON =
  "https://cdn.discordapp.com/attachments/882584296131551299/1516674882187034705/insyaallahhalal.gif?ex=6a33810e&is=6a322f8e&hm=f5de1283e41dbfc61c46ddf633257f7ccccf5418bba1ee8ec7628309e8a70a4b&";

export const FOOTER_TEXT = "insyaallah halal" as const;

export const AUTHOR_NAME = "AVIVIION Helper" as const;
