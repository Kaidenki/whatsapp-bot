/*const { Alpha, getJson, config, mode } = require('../lib');
let prefix = config.CHATPX !== null ? config.CHATPX : (config.PREFIX !== undefined ? config.PREFIX : null);

    Alpha({
        on: 'text',
        fromMe: mode
    }, async (m, match) => {
        if (!config.CHATBOT) {
    return;
} 
        if (!prefix && (config.CHATBOT === 'pm2' || config.CHATBOT === 'gc2')) {
                await m.reply("The chatbot is not properly configured to require a prefix. Please set  prefix.");
                return;
            }    
        if (config.CHATBOT === 'pm2' && m.isCreator) {
            if (!m.body.startsWith(prefix)) return;
        }
        if (config.CHATBOT === 'pm3' && m.isCreator && !m.isGroup) return;
        if (config.CHATBOT === 'gc2' && m.isCreator && m.isGroup) {
            if (!m.body.startsWith(prefix)) return;
        }
        if (config.CHATBOT === 'gc3' && m.isCreator && m.isGroup) return;
        if (config.CHATBOT === 'gc' && m.isGroup) {
            let msg = m.body.startsWith(prefix) ? m.body.slice(prefix.length) : m.body;
            console.log(msg)
            let data = await getJson(
                `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${msg}]`
            );
            return await m.reply(data.cnt);
        }
        if ((config.CHATBOT === 'pm' || !m.isGroup) && m.isCreator) {
            let msg = m.body.startsWith(prefix) ? m.body.slice(prefix.length) : m.body;
            let data = await getJson(
                `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${msg}]`
            );
            return await m.reply(data.cnt);
        }
        let msg = m.body.startsWith(prefix) ? m.body.slice(prefix.length) : m.body;
        let data = await getJson(
            `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${msg}]`
        );
        return await m.reply(data.cnt);
    });*/
    
