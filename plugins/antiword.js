const {
    Alpha,
    groupDB
} = require('../lib');
const actions = ['kick','warn','null']

Alpha({
    pattern: 'antiword ?(.*)',
    desc: 'remove users who use restricted words',
    type: 'group',
    onlyGroup: true,
    fromMe: true 
}, async (message, match) => {
    if (!match) return await message.reply("_*antiword* on/off_\n_*antiword* action warn/kick/null_");
    const {antiword} = await groupDB(['antiword'], {jid: message.jid, content: {}}, 'get');
    if(match.toLowerCase() == 'get') {
    	const status = antiword && antiword.status == 'true' ? true : false
        if(!status  || !antiword.word) return await message.send('_Not Found_');
        return await message.send(`_*activated antiwords*: ${antiword.word}_`);
    } else if(match.toLowerCase() == 'on') {
    	const action = antiword && antiword.action ? antiword.action : 'null';
        const word = antiword && antiword.word ? antiword.word : undefined;
        await groupDB(['antiword'], {jid: message.jid, content: {status: 'true', action, word}}, 'set');
        return await message.send(`_antiword Activated with action null_\n_*antiword action* warn/kick/null for chaning actions_`)
    } else if(match.toLowerCase() == 'off') {
    	const action = antiword && antiword.action ? antiword.action : 'null';
        const word = antiword && antiword.word ? antiword.word : undefined;
        await groupDB(['antiword'], {jid: message.jid, content: {status: 'false', action,word }}, 'set')
        return await message.send(`_antiword deactivated_`)
    } else if(match.toLowerCase().match('action')) {
    	const status = antiword && antiword.status ? antiword.status : 'false';
        match = match.replace(/action/gi,'').trim();
        if(!actions.includes(match)) return await message.send('_action must be warn,kick or null_')
        await groupDB(['antiword'], {jid: message.jid, content: {status, action: match }}, 'set')
        return await message.send(`_antiword Action Updated_`);
    } else {
    	if(!match) return await message.send('_*Example:* antiword 🏳️‍🌈, gay, nigga_');
    	const status = antiword && antiword.status ? antiword.status : 'false';
        const action = antiword && antiword.action ? antiword.action : 'null';
        await groupDB(['antiword'], {jid: message.jid, content: {status, action,word: match}}, 'set')
        return await message.send(`_Antiwords Updated_`);
    }
});
