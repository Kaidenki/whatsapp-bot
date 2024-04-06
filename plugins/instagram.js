const {
  Alpha,
  extractUrlsFromString,
  lang,
  mode,
  getJson,
  config,
  isInstagramURL,
} = require("../lib");

Alpha(
  {
    pattern: "insta ?(.*)",
    desc: lang.INSTA.DESC,
    react: "😛",
    fromMe: mode,
    type: "downloader",
  },
  async (message, match) => {
    if (match.startsWith("dl-url:")) {
      match = match
        .replace(/dl-url:/, "")
        .replace("INSTAGRAM DOWNLOADER", "")
        .trim();
      return await message.sendFromUrl(match);
    }
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.INSTA.NEED_URL);
    const urls = extractUrlsFromString(match);
    if (!urls[0]) return await message.send(lang.INSTA.NOT_VALID);
    if (!isInstagramURL(urls[0]))
      return await message.send(lang.INSTA.NEED_URL);
    let data = await getJson(
      `https://upper-romy-inrl-bot.koyeb.app/api/download/insta?apikey=free50_inrl&url=${urls[0]}`,
    );
    if (!data.status)
      return await message.send(
        `Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar inrl_key: your apikey`,
      );
    const { result } = data;
    let options = [],
      n = 1;
    if (!result[0])
      return await message.send(lang.BASE.ERROR.format("Not Found"));
    result.map(async (u) => {
      options.push({
        name: `${n++}/${result.length}`,
        id: `insta dl-url:${u.url}`,
      });
    });
    if (options.length == 1) return await message.sendFromUrl(result[0].url);
    return await message.send(
      {
        name: "INSTAGRAM DOWNLOADER",
        values: options.splice(0, 10),
        withPrefix: true,
        onlyOnce: false,
        participates: [message.sender],
        selectableCount: true,
      },
      {},
      "poll",
    );
  },
);

Alpha(
  {
    pattern: "story ?(.*)",
    desc: lang.INSTA.DESC,
    react: "😛",
    fromMe: mode,
    type: "downloader",
  },
  async (message, match) => {
    if (match.startsWith("dl-url:")) {
      match = match
        .replace(/dl-url:/, "")
        .replace("INSTAGRAM STORY DOWNLOADER", "")
        .trim();
      return await message.sendFromUrl(match);
    }
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.INSTA.NEED_URL);
    const urls = extractUrlsFromString(match);
    if (!urls[0]) return await message.send(lang.INSTA.NOT_VALID);
    if (!isInstagramURL(urls[0]))
      return await message.send(lang.INSTA.NEED_URL);
    let data = await getJson(
      `https://upper-romy-inrl-bot.koyeb.app/api/download/insta?apikey=${config.RKEY}&url=${urls[0]}`,
    );
    if (!data.status)
      return await message.send(
        `Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar inrl_key: your apikey`,
      );
    const { result } = data;
    let options = [],
      n = 1;
    if (!result[0])
      return await message.send(lang.BASE.ERROR.format("Not Found"));
    result.map(async (u) => {
      options.push({
        name: `${n++}/${result.length}`,
        id: `insta dl-url:${u.url}`,
      });
    });
    if (options.length == 1) return await message.sendFromUrl(result[0].url);
    return await message.send(
      {
        name: "INSTAGRAM STORY DOWNLOADER",
        values: options.splice(0, 10),
        withPrefix: true,
        onlyOnce: false,
        participates: [message.sender],
        selectableCount: true,
      },
      {},
      "poll",
    );
  },
);
