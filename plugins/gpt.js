const { Alpha, GPT, mode, config,getJson} = require('../lib/');

Alpha({
    pattern: "gpt",
    desc: 'get open ai chatgpt response',
    type: "Ai",
    fromMe: mode
}, async (message, match) => {
    if(match && match == 'clear') {
        await GPT.clear();
        return await message.send('_successfully cleard_');
    }
    match = match || message.reply_message.text;
        if (!match) return await message.reply('_please can you provide me a task_');
        if(!config.OPEN_AI) {
         const res = await getJson(`${config.BASE_URL}api/ai/gpt1?prompt=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`);
         if (res.error) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
         return await message.reply(res.result.reply);
        } 
        return await message.send(await GPT.prompt(match));
});

Alpha({
    pattern: "gemini",
    desc: 'get gemini ai response',
    type: "Ai",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('_please can you provide me a task_');
    const geminiUrl = `${config.API_URL}api/gemini?prompt=${encodeURIComponent(match)}&api_key=${config.GEMINI_KEY}`;
    const res = await getJson(geminiUrl);
    if (res.error) {
        return await message.send(`*There was an issue processing your request. Please try again later or provide a different prompt.*`);
    } 
    const text = res.candidates[0].content.parts[0].text;
    return await message.reply(text);
});
