const {
        Alpha,
        getJson,
        config,
        mode
} = require('../lib');


Alpha({
        on: 'text',
        fromMe: mode
}, async (m, match) => {
        if(m.isCreator && config.CHATBOT == 'pm2' ) return;
        if(config.CHATBOT == 'true') {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${m.body}]`
                )
                return await m.reply(data.cnt)
        } else if(config.CHATBOT == 'group' && m.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${m.body}]`
                )
                return await m.reply(data.cnt)
        } else if(config.CHATBOT == 'pm' && !m.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${m.sender.split('@')[0]}]&msg=[${m.body}]`
                )
                return await m.reply(data.cnt)
        }
});
