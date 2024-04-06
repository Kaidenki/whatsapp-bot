const {
    Alpha,
    groupDB
} = require('../lib');

Alpha({
    pattern: 'antidelete ?(.*)',
    desc: 'forward deleted messages',
    type: 'group',
    onlyGroup: true,
    fromMe: true
}, async (message, match) => {
    if (!match) return message.reply('antidelete on/off');
    if (match != 'on' && match != 'off') return message.reply('antidelete on');
    const {antidelete} = await groupDB(['antidelete'], {jid: message.jid, content: {}}, 'get');
    if (match == 'on') {
        if (antidelete == 'true') return message.reply('_Already activated_');
        await groupDB(['antidelete'], {jid: message.jid, content: 'true'}, 'set');
        return await message.reply('_activated_')
    } else if (match == 'off') {
        if (antidelete == 'false') return message.reply('_Already Deactivated_');
        await groupDB(['antidelete'], {jid: message.jid, content: 'false'}, 'set');
        return await message.reply('_deactivated_')
    }
});
