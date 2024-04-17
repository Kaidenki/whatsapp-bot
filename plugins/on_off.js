const { Alpha, personalDB } = require('../lib')
const { exec } = require("child_process");

Alpha({
	pattern: 'turnoff ?(.*)',
	desc: 'turn off the bot',
	type: 'owner',
	usage: 'turnoff bot',
	root: true
}, async (message, match) => {
	const {
		shutoff
	} = await personalDB(['shutoff'], {
		content: {}
	}, 'get');
	if (shutoff && shutoff == 'true') return await message.send("_already turned off!_");
	await personalDB(['shutoff'], {
		content: 'true'
	}, 'set');
	await message.send('*shutting down!!!⚫️*');
	return exec('pm2 restart all')
});

Alpha({
	pattern: 'turnon ?(.*)',
	desc: 'turn on the bot',
	type: 'owner',
	usage: 'turnon bot',
	root: true
}, async (message, match) => {
	const {
		shutoff
	} = await personalDB(['shutoff'], {
		content: {}
	}, 'get');
	if (shutoff && shutoff == 'false') return await message.send("_already turned on!_");
	await personalDB(['shutoff'], {
		content: 'false'
	}, 'set');
	await message.send('*turning on!!!⚪️*');
	return exec('pm2 restart all')
});
