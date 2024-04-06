const { Alpha, mode, extractUrlsFromString, getBuffer } = require('../lib/');
const { fbdown } = require('btch-downloader');

Alpha({
    pattern: 'fb ? (.*)',
    fromMe: mode,
    desc: 'download medias from Facebook',
    react: "⬇️",
    type: "downloader"
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("*_give me a url_*");
    
    const urls = extractUrlsFromString(match);
    if (!urls[0]) return await message.send("*_Give me a valid url_*");
    
    try {
        const data = await fbdown(urls[0]);
        if (data) {
            return await message.send(await getBuffer(data.HD),  { caption: "*result for* ```" + urls + "```"  }, 'video');
        } else {
            return await message.send("*Not Found*");
        }
    } catch (error) {
        console.error('Error:', error);
        return await message.send("*Error occurred while downloading*");
    }
});


