const {
    Alpha,
    groupDB
} = require('../lib');

Alpha({
    pattern: 'antipromote ?(.*)',
    desc: 'demote actor and re-promote demoted person',
    type: 'group',
    onlyGroup: true,
    fromMe: true
}, async (message, match) => {
    if (!match) return message.reply('antipromote on/off');
    if (match != 'on' && match != 'off') return message.reply('antipromote on\n\n*note antipromote only works if pdm is on*');
    const {antipromote} = await groupDB(['antipromote'], {jid: message.jid, content: {}}, 'get');
    if (match == 'on') {
        if (antipromote == 'true') return message.reply('_Already activated_');
        await groupDB(['antipromote'], {jid: message.jid, content: 'true'}, 'set');
        return await message.reply('_activated_')
    } else if (match == 'off') {
        if (antipromote == 'false') return message.reply('_Already Deactivated_');
        await groupDB(['antipromote'], {jid: message.jid, content: 'false'}, 'set');
        return await message.reply('_deactivated_')
    }
});
