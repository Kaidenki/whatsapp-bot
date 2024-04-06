const { Alpha, mode, isUrl, badWordDetect, getJson, config } = require('../lib');
const axios = require('axios');

Alpha({
    pattern: "pindl",
    fromMe: mode,
    desc: "pinterest download",
    type: "downloader",
},
async (message, match) => {
    if (!match) return await message.send('Please provide a Pinterest URL');
    if (!isUrl(match)) return await message.send('Please provide a valid Pinterest URL');
    const { result, status } = await getJson(`${config.BASE_URL}api/dowloader/pinterest?url=${match}&apikey=${config.ALPHA_KEY}`);
    if (!status) return await message.send(`API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key`);
   if (result.endsWith('.mp4')) {
        await message.sendReply(result, { caption: 'here you go ✅' }, 'video');
    } else {
        await message.sendFromUrl(result);
    }
});


Alpha({
    pattern: '$pinsch',
    desc: 'search pintrest for  images',
    react: "🤩",
    type: "search",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to search on pinterest!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_");

    try {
        const response = await axios.get(`${config.BASE_URL}api/search/pinterest?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`);
        const data = response.data;
        if (data.status === true && data.result && data.result.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.result.length);
            const selectedUrl = data.result[randomIndex];

            return await message.sendReply(selectedUrl, {
                caption: "*pintrest search result for* ```" + match + "```"
            }, "image");
        } else {
            return await message.reply("*_err occured while  searching images_*");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return await message.reply("*_error occured while searching images_*");
    }
});