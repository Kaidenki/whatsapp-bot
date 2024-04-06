const {
    Alpha,
    mode,
    weather,
    ringtone,
    GenListMessage,
    lang,
    getJson,
    config
} = require('../lib');


Alpha({
    pattern: 'google',
    fromMe: mode,
    desc: lang.SCRAP.GOOGLE_DESC,
    react: "🙃",
    type: "search"
}, async (message, match) => {
    if (!match) return message.send(lang.BASE.TEXT);
    const { result, status } = await getJson(`${config.BASE_URL}api/search/google?text=${match}&apikey=${config.ALPHA_KEY}`);
    if (!status) return await message.send(`API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key`);
    await Promise.all(result.map(async (item) => {
        await message.send(`*Title:* ${item.title}\n*Link:* ${item.link}\n*Snippet:* ${item.snippet}\n`);
    }));
});

Alpha({
    pattern: 'rindl',
    fromMe: mode,
    desc: lang.SCRAP.RING_DESC,
    react : "🙃",
    type: "search"
}, async (message, match) => {
        if (!match) return message.send(lang.BASE.TEXT);
        let result = await ringtone(match), res=[];
        await result.map(r=>res.push(r.title));
        return await message.send(GenListMessage(lang.SCRAP.RING_LIST, res));
});   

Alpha({
    pattern: 'weather',
    fromMe: mode,
    desc: lang.SCRAP.WEATHER_DESC,
    react : "🔥",
    type: "search"
}, async (message, match) => {
    if(!match) return await m.send(lang.SCRAP.NEED_PLACE)
        return await weather(message);
});

Alpha({
    on: "text",
    fromMe: mode,
}, async (m, match) => {
    if (!m.reply_message || !m.reply_message?.fromMe) return;
    if(!m.body.includes(lang.SCRAP.RING_LIST)) return;
    match = m.body.replace(lang.SCRAP.RING_LIST, "").trim();
    await m.send("*_downloading_*:-\n\n"+match);
    let result = await ringtone(match);
    return await m.send({
                url: result[0].audio
            },{
            fileName: result[0].title + '.mp3',
            mimetype: 'audio/mpeg'
        }, 'audio');
});

Alpha({
    pattern: 'ring',
    fromMe: mode,
    desc: 'search for random ringtone audio',
    react: "🙃",
    type: "search"
}, async (message, match) => {
    if (!match) return message.send(lang.BASE.TEXT);
    const { result, status } = await getJson(`${config.BASE_URL}api/search/ringtone?text=${match}&apikey=${config.ALPHA_KEY}`);
    if (!status) return await message.send(`API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key`);
    await Promise.all(result.map(async (item) => {
        await message.send(`*Title:* ${item.title}\n*Source:* ${item.source}\n*Audio:* ${item.audio}\n`);
    }));
});