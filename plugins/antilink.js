const {
    Alpha,
    groupDB
} = require('../lib');
const actions = ['kick','warn','null']

Alpha({
    pattern: 'antilink ?(.*)',
    desc: 'remove users who use bot',
    type: 'group',
    onlyGroup: true,
    fromMe: true 
}, async (message, match) => {
    if (!match) return await message.reply("_*antilink* on/off_\n_*antilink* action warn/kick/null_");
    const {antilink} = await groupDB(['antilink'], {jid: message.jid, content: {}}, 'get');
    if(match.toLowerCase() == 'on') {
    	const action = antilink && antilink.action ? antilink.action : 'null';
        await groupDB(['antilink'], {jid: message.jid, content: {status: 'true', action }}, 'set');
        return await message.send(`_antilink Activated with action null_\n_*antilink action* warn/kick/null for chaning actions_`)
    } else if(match.toLowerCase() == 'off') {
    	const action = antilink && antilink.action ? antilink.action : 'null';
        await groupDB(['antilink'], {jid: message.jid, content: {status: 'false', action }}, 'set')
        return await message.send(`_antilink deactivated_`)
    } else if(match.toLowerCase().match('action')) {
    	const status = antilink && antilink.status ? antilink.status : 'false';
        match = match.replace(/action/gi,'').trim();
        if(!actions.includes(match)) return await message.send('_action must be warn,kick or null_')
        await groupDB(['antilink'], {jid: message.jid, content: {status, action: match }}, 'set')
        return await message.send(`_AntiBot Action Updated_`);
    }
});
