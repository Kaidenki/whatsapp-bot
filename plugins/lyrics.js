const {
    Alpha,
    mode,
    fetchJson,
    lang,
    config
} = require('../lib');

Alpha({
    pattern: 'lyrics',
    fromMe: mode,
    desc: lang.LYRICS.DESC,
    type: "search"
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = await fetchJson(`${config.BASE_URL}api/search/lyrics?id=${match}&apikey=${config.ALPHA_KEY}`);
    if (!res.status) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}/signup for getting a new apikey. setvar alpha_key: your apikey`)
    if (!res.result) return message.send(lang.BASE.ERROR.format(",try again"));
    
    const {
        thumbnail,
        lyrics,
        title,
        artist
    } = res.result;
    
    const msg = lang.LYRICS.RESPONCE.format(`*_${artist}_*`, `*_${title}_*`) + `\n\n\`\`\`${lyrics}\`\`\``;
    
    return await message.client.sendMessage(message.from, {
        image: {
            url: thumbnail
        },
        caption: msg
    }, {
        quoted: message
    });
});
