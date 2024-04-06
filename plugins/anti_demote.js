const {
    Alpha,
    groupDB
} = require('../lib');

Alpha({
    pattern: 'antidemote ?(.*)',
    desc: 'demote actor and re-promote demoted person',
    type: 'group',
    onlyGroup: true,
    fromMe: true
}, async (message, match) => {
    if (!match) return message.reply('antidemote on/off');
    if (match != 'on' && match != 'off') return message.reply('antidemote on\n\n*note antidemote only works if pdm is on*');
    const {antidemote} = await groupDB(['antidemote'], {jid: message.jid, content: {}}, 'get');
    if (match == 'on') {
        if (antidemote == 'true') return message.reply('_Already activated_');
        await groupDB(['antidemote'], {jid: message.jid, content: 'true'}, 'set');
        return await message.reply('_activated_')
    } else if (match == 'off') {
        if (antidemote == 'false') return message.reply('_Already Deactivated_');
        await groupDB(['antidemote'], {jid: message.jid, content: 'false'}, 'set');
        return await message.reply('_deactivated_')
    }
});
