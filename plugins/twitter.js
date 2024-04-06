const { Alpha, mode, extractUrlsFromString, config } = require('../lib/');
const axios = require('axios');
const { BASE_URL,} = require('../config');

Alpha(
    {
        pattern: 'twv ? (.*)',
        fromMe: mode,
        desc: 'download videos from Twitter',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a URL_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.send('*_Give me a valid URL_*');
            await message.send('Downloading... 👇 \nplease wait...⏳');
            let { data } = await axios(`${BASE_URL}api/dowloader/twitter?url=${urls[0]}&apikey=${config.ALPHA_KEY}`);
            const { status, result } = data;
            if (!status) return await message.send('*Not Found*');
            await message.sendReply(result.video, { caption: 'Download complete!✅'}, 'video');
        } catch (e) {
            return message.send(e);
        }
    }
);