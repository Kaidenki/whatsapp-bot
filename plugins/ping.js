const {
       Alpha,
       lang,
       mode
} = require('../lib');


Alpha({
    pattern: 'ping ?(.*)',
    desc: lang.PING_DESC,
    react: "💯",
    fromMe: mode,
    type: 'info'
}, async (message, match) => {
    const start = new Date().getTime()
    const msg = await message.send('Ping!')
    const end = new Date().getTime()
    return await msg.edit('*⚡PONG!* ' + (end - start) + ' ms');
});
