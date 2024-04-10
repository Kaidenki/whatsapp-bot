const { Alpha, mode, getJson, config } = require('../lib');

let fancycheck = false;
let fancytimeout;

Alpha({
    pattern: 'fancy ?(.*)',
    type: 'misc',
    desc: 'Style your text creatively.',
    fromMe: mode
}, async (message, match) => {
    const res = await getJson(`${config.BASE_URL}api/tools/styletext?text=${match}&apikey=${config.ALPHA_KEY}`);
    if (!res.status) return await message.send(`*Failed to fetch fancy text options.*\n*please make sure i'ts plain text*`);
    
    const options = res.result;
    if (options.length === 0) return await message.send('*No fancy text options available.*');

    let replyMsg = '*fancy Text Options:*\n';
    options.forEach((option, index) => {
        replyMsg += `${index + 1}. ${option.result}\n`;
    });
    replyMsg += '*Reply with the number of your desired fancy text.*\n*or 0 to cancel.*';
    await message.send(replyMsg);

    fancycheck = true;
    fancytimeout = setTimeout(() => {
        fancycheck = false;
    }, 60000); // 1 minute timeout

    Alpha({
        on: 'text',
        fromMe: mode
    }, async (message, match) => {
        if (!fancycheck) return;
        if (!message.sender) return;
        const selection = parseInt(message.body);
        if (isNaN(selection) || selection < 1 || selection > options.length) {
            await message.send('Invalid selection. Please reply with a valid number.');
            return;
        }
        if (selection === 0) {
            await message.send('Operation cancelled.');
            clearTimeout(stylizeTimeout);
            fancytimeout = false;
            return;
        }
        const selectedOption = options[selection - 1].result;
        await message.send(`${selectedOption}`);
        clearTimeout(fancytimeout);
        fancycheck = false;
    });
});
