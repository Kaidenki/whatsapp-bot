const {
    Alpha,
    mode,
    getBuffer,
    config
} = require('../lib/');

Alpha({
    pattern: '$ss',
    desc: 'generate screenshot of websites',
    react: "🤩",
    type: "misc",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a website link to get screenshot!!_*');
    const res = await getBuffer(`${config.BASE_URL}api/tools/ssweb?link=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`);
	return await message.send(res, {},'image');
});
