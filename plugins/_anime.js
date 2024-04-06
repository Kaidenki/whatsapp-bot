const {
	Alpha,
	mode,
	config,
	getJson,
} = require('../lib');

Alpha({
	pattern: 'animeqt ?(.*)',
	type: "anime",
	fromMe: mode,
	desc: "get random anime quote",
}, async (message, match) => {
	match = match || message.reply_message.text
	const data = await getJson(`${config.BASE_URL}api/anime/animequote?apikey=${config.ALPHA_KEY}`);
    const { status, result } = data;
    console.log(status)
    const quotemsg = ` 📜 *Quote:* "${result.quote}"\n👤 *Author:* ${result.author}\n📺 *Anime:* ${result.anime}
    `;
	if (!status) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.send(quotemsg);
});
