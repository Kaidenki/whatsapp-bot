const { Alpha, mode, extractUrlsFromString, config } = require('../lib/');
const axios = require('axios');
const { BASE_URL } = require('../config');

Alpha(
    {
        pattern: 'ttv ? (.*)',
        fromMe: mode,
        desc: 'download video from tiktok url',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a url_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.send('*_Give me a valid url_*');

            let { data } = await axios(`${BASE_URL}api/dowloader/tikok?url=${urls[0]}&apikey=${config.ALPHA_KEY}`);
            const { status, result } = data;
            if (!status) return await message.send('*Not Found*');
            await message.sendReply(result.pp, { caption: result.description }, 'image');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.send('Downloading tiktok video... 👇 \nplease wait...⏳');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(result.video_HD, {
                caption: 'here you go ✅' }, 'video');
        } catch (e) {
            return message.send(e);
        }
    }
);