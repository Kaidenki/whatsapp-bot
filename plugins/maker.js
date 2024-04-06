const { Alpha,  lang, mode, config } = require("../lib");
Alpha(
  {
    pattern: "ttp",
    type: "maker",
    fromMe: mode,
    desc: lang.TTP.DESC,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/ttp?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
    return await message.send({ url: res }, {}, "image");
  },
);
Alpha(
  {
    pattern: "attp",
    type: "maker",
    fromMe: mode,
    desc: lang.TTP.DESC,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/attp?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    return await message.send(res, {}, "sticker");
  },
);

Alpha(
  {
    pattern: "facts",
    type: "maker",
    fromMe: mode,
    desc: 'facts meme maker',
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/facts?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
    return await message.send({ url: res }, {}, "image");
  },
);

Alpha(
  {
    pattern: "biden",
    type: "maker",
    fromMe: mode,
    desc: "biden tweet maker",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/biden?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
    return await message.send({ url: res }, {}, "image");
  },
);

Alpha(
  {
    pattern: "drake",
    type: "maker",
    fromMe: mode,
    desc: "Drake meme maker",
  },
  async (message, match) => {
    const texts = match.split(/,\s*/);
    if (texts.length !== 2) {
      return await message.send(`Please provide two texts separated by a comma.\neg ${config.PREFIX}drake alpha, cipher`);
    }
    const res = `${config.BASE_URL}api/maker/drake?text=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1] || '')}&apikey=${config.ALPHA_KEY}`;
    if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup to get a new apikey. Setvar alpha_key: your apikey`);
    return await message.send({ url: res }, {}, "image");
  },
);
