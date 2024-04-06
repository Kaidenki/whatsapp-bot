const {
    Alpha,
    groupDB
} = require('../lib')

Alpha({
    pattern: 'antifake ?(.*)',
    desc: 'remove fake numbers',
    fromMe: true,
    react: '🖕',
    type: 'group',
    onlyGroup: true
}, async (message, match) => {
    if (!match) return await message.reply('_*antifake* 94,92_\n_*antifake* on/off_\n_*antifake* list_');
    const {antifake} = await groupDB(['antifake'], {jid: message.jid, content: {}}, 'get');
    if(match.toLowerCase()=='get'){
    if(!antifake || antifake.status == 'false' || !antifake.data) return await message.send('_Not Found_');
    return await message.send(`_*activated restricted numbers*: ${antifake.data}_`);
    } else if(match.toLowerCase() == 'on') {
    	const data = antifake && antifake.data ? antifake.data : '';
    	await groupDB(['antifake'], {jid: message.jid, content: {status: 'true', data}}, 'set');
        return await message.send(`_Antifake Activated_`)
    } else if(match.toLowerCase() == 'off') {
        const data = antifake && antifake.data ? antifake.data : '';
    	await groupDB(['antifake'], {jid: message.jid, content: {status: 'false', data}}, 'set');
    return await message.send(`_Antifake Deactivated_`)
    }
    match = match.replace(/[^0-9,!]/g, '');
    if(!match) return await message.send('value must be number');
    const status = antifake && antifake.status ? antifake.status : 'false';
    await groupDB(['antifake'], {jid: message.jid, content: {status, data: match}}, 'set');
    return await message.send(`_Antifake Updated_`);
});
