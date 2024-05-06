const { Alpha, mode, config, getJson } = require('../lib');
const alpha = 'rXLTGQ5ojO0gx2Uwv2EoD_prbT25bfu0hnlb_WC8sxk';
const power = 'TT2Ac7tCK2jVT9PZKElYrBQVNAmTLC2BglvOap6R_04';
const delta = 'FeJX2Cgn2Mnn_83b9QiJEbBLKh-f9C_n9hd9-2hliNs';
const gojo = '4WOVrCApi4JYwfYwU2e5eDeFalLOkGBw6IfUZPX1XVQ';
const cid = 'VOsZJMVNKrWjZ5AC_U72HWD3lTyTcWhkGchhQU9EJxU';
const itadori = '5mhs-itLvD620IWrWLamTb2_yoj4gnm-o_LTX5LPRNE';
const makima = 'eGPYvuu9WnIzP4gHbkgwe3cTtqwfnLi5QUNip_q8Le4';

Alpha({
	pattern: 'alpha ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with alpha from eminence in shadow",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${alpha}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});

Alpha({
	pattern: 'power ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with power from chainsaw-man",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${power}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});

Alpha({
	pattern: 'delta ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with delta from eminence in shadow",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${delta}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});

Alpha({
	pattern: 'cid ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with cid kagenou from eminence in shadow",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${cid}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});

Alpha({
	pattern: 'gojo ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with gojo from jjk",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${gojo}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});


Alpha({
	pattern: 'itadori ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with itadori from jjk",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${itadori}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});

Alpha({
	pattern: 'makima ?(.*)',
	type: "Character-ai",
	fromMe: mode,
	desc: "chat with makima from chainsaw-man",
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me a query!*");
	const res = await getJson(`${config.BASE_URL}api/ai/c-ai?characterid=${makima}&message=${match}&apikey=${config.ALPHA_KEY}`);
	if (res.error) return await message.reply(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
	return await message.reply(res.result.response);
});
