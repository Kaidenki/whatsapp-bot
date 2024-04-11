const {
    Alpha,
    mode,
    badWordDetect,
    config
} = require('../lib/');

Alpha({
    pattern: '$batman',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/batman?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$slicedtxt',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/slicedtxt?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$pencil',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/pencil?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$bpneon',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/neon-blackpink?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$neon',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/neon?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$shadow',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/shadow?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$berry',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/berry?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$blackpink',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/blackpink?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$bear',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/logobear?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$3dchristmas',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/3dchristmas?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$thunder',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/thunder?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$3dbox',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/3dboxtext?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$strawberry',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/strawberry?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$3dneon',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/3d-neon-light?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$3dorange',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/3d-orange-juice?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$cake',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/chocolate-cake?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$ghorror',
    desc: 'text to logo maker',
    react: "🤩",
    type: "textpro",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/textpro/green-horror?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha(
    {
      pattern: "glitch",
      type: "textpro",
      fromMe: mode,
      desc: 'text to logo maker',
    },
    async (message, match) => {
      const texts = match.split(/,\s*/);
      if (texts.length !== 2) {
        return await message.send(`Please provide two texts separated by a comma.\neg ${config.PREFIX}glitch alpha, cipher`);
      }
      const res = `${config.BASE_URL}api/textpro/glitchtiktok?text=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1] || 'ciph3r')}&apikey=${config.ALPHA_KEY}`;
      if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup to get a new apikey. Setvar alpha_key: your apikey`);
      return await message.send({ url: res }, {}, "image");
    },
  );

  Alpha(
    {
      pattern: "marvel",
      type: "textpro",
      fromMe: mode,
      desc: 'text to logo maker',
    },
    async (message, match) => {
      const texts = match.split(/,\s*/);
      if (texts.length !== 2) {
        return await message.send(`Please provide two texts separated by a comma.\neg ${config.PREFIX}marvel alpha, cipher`);
      }
      const res = `${config.BASE_URL}api/textpro/marvel-studios?text=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1] || 'ciph3r')}&apikey=${config.ALPHA_KEY}`;
      if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup to get a new apikey. Setvar alpha_key: your apikey`);
      return await message.send({ url: res }, {}, "image");
    },
  );

  Alpha(
    {
      pattern: "ninja",
      type: "textpro",
      fromMe: mode,
      desc: 'text to logo maker',
    },
    async (message, match) => {
      const texts = match.split(/,\s*/);
      if (texts.length !== 2) {
        return await message.send(`Please provide two texts separated by a comma.\neg ${config.PREFIX}ninja alpha, cipher`);
      }
      const res = `${config.BASE_URL}api/textpro/ninja-logo?text=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1] || 'ciph3r')}&apikey=${config.ALPHA_KEY}`;
      if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup to get a new apikey. Setvar alpha_key: your apikey`);
      return await message.send({ url: res }, {}, "image");
    },
  );
