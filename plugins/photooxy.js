const {
    Alpha,
    mode,
    badWordDetect,
    config
} = require('../lib/');


Alpha({
    pattern: '$shadsky',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/shadow-sky?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$flaming',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/flaming?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$illmetallic',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/metallic?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$naruto',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/naruto?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha(
    {
      pattern: "pubg",
      type: "photooxy",
      fromMe: mode,
      desc: 'photooxy logo maker',
    },
    async (message, match) => {
      const texts = match.split(/,\s*/);
      if (texts.length !== 2) {
        return await message.send(`Please provide two texts separated by a comma.\neg ${config.PREFIX}ninja alpha, cipher`);
      }
      const res = `${config.BASE_URL}api/photooxy/pubg?text=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1] || 'ciph3r')}&apikey=${config.ALPHA_KEY}`;
      if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup to get a new apikey. Setvar alpha_key: your apikey`);
      return await message.send({ url: res }, {}, "image");
    },
  );

Alpha({
    pattern: '$ungrass',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/under-grass?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$harryp',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/harry-potter?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$flower',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/flower-typography?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$pol',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/picture-of-love?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$coffee',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/coffee-cup?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$butterfly',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/butterfly?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$nightsky',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/night-sky?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$candy',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/sweet-candy?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});
  
Alpha({
    pattern: '$illmetallc',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/illuminated-metallic?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});

Alpha({
    pattern: '$wood',
    desc: 'photooxy logo maker',
    react: "🤩",
    type: "photooxy",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate logo!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`${config.BASE_URL}api/photooxy/carved-wood?text=${encodeURIComponent(match.replace(/[^A-Za-z0-9 ]/g, ''))}&apikey=${config.ALPHA_KEY || "no image logo"}`, {
            caption: "```Here you go ✅```"
    }, "image");
});
