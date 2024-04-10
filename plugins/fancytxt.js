const { Alpha, mode, getJson, config } = require('../lib');

let fancycheck = false;
let fancytimeout;
let options;
const regex = /^[a-zA-Z0-9 ]+$/;

Alpha({
    pattern: 'fancy ?(.*)',
    type: 'misc',
    desc: 'Style your text creatively.',
    fromMe: mode
}, async (message, match) => {
    if (!match) return await message.reply('_please provide a text_');
    if (!regex.test(match)) {
        return await message.reply('_please provide a valid text_');
    }
    const res = await getJson(`${config.BASE_URL}api/tools/styletext?text=${match}&apikey=${config.ALPHA_KEY}`);
    if (!res.status) return await message.reply(`*API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key*`);
    
    options = res.result;
    if (options.length === 0) return await message.reply('*Sorry, fancy text is temporarily unavailable.*');

    let replyMsg = '*Fancy Text Options:*\n';
    options.forEach((option, index) => {
        replyMsg += `${index + 1}. ${option.result}\n`;
    });
    replyMsg += '*Reply with the number of your desired fancy text.*\n*or 0 to cancel.*';
    await message.reply(replyMsg);

    fancycheck = true;
    fancytimeout = setTimeout(() => {
        fancycheck = false;
    }, 60000); // 1 minute timeout
});

Alpha({
    on: 'text',
    fromMe: mode
}, async (message, match) => {
    if (!fancycheck) return;
    if (!message.reply_message?.fromMe || !message.reply_message?.text) return;
    if (!message.reply_message.text.includes('*Reply with the number of your desired fancy text.*\n*or 0 to cancel.*')) return;
    const selection = parseInt(message.body);
    if (fancycheck && selection === 0) {
        await message.reply('*Operation cancelled.*');
        clearTimeout(fancytimeout);
        fancytimeout = false;
        fancycheck = false; 
        return;
    }
    if (fancycheck && (isNaN(selection) || selection < 1 || selection > options.length)) {
        await message.reply('*Invalid selection. Please reply with a valid number.*');
        return;
    }
    if (fancycheck) {
        const selectedOption = options[selection - 1].result;
        await message.reply(`${selectedOption}`);
        clearTimeout(fancytimeout);
        fancycheck = false; 
    }
});
