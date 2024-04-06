const {
    Alpha,
    lang,
    mode,
    badWordDetect,
    getJson,
    config
} = require('../lib');


Alpha({
    pattern: "img",
    usage: 'send google image result for give text',
    react: "🖼",
    fromMe: mode,
    type: "search",
    desc : lang.IMG.IMG_DESC
}, async (message, match) => {
    if (!match) {
        return await message.send(lang.BASE.TEXT)
    }
    const text = match
    if(badWordDetect(match.toLowerCase()) && message.isCreator) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    if(!text) text = match;
    const data = await getJson(`${config.BASE_URL}api/search/googleimage?text=${text}&apikey=${config.ALPHA_KEY}`);
    const {result} = data;
    if(!data.status) return await message.send(`API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key`);
    if(!result) return await message.send('_Not Found_');
    const filteredResults = result.filter(item => item.url.toLowerCase().endsWith('.png') || item.url.toLowerCase().endsWith('.jpg'));
    if (filteredResults.length === 0) {
        await message.sendReply('No suitable images found');
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredResults.length);
    const randomResult = filteredResults[randomIndex];
    const randomImageUrl = randomResult.url;
    console.log(randomImageUrl)
    await message.sendReply(randomImageUrl, { caption: `*Result for*: \`${text}\`\n*Source*: ${randomImageUrl}` }, 'image');
});
