const {
        Alpha,
        commands,
        sleep,
        personalDB,
        lang
} = require('../lib');

Alpha({
        pattern: 'toggle ?(.*)',
        fromMe: true,
        desc: lang.TOGGLE.DESC,
        type: 'misc',
}, async (message, match) => {
        if (match == 'list') {
                const {toggle} = await personalDB(['toggle'], {content:{}},'get');
                let list = lang.TOGGLE.LIST
                if (!Object.keys(toggle)[0]) return await message.send('_Not Found_');
                let n = 1;
                for(const t in toggle) {
                        list += `${n++}  ${t}\n`;               
                }
                return await message.reply(list)
        }
        let [cmd, tog] = match.split(' '), isIn = false;
        if (!cmd || (tog != 'off' && tog != 'on')) return await message.send(lang.TOGGLE.METHODE.format("toggle"))
        commands.map((c) => {
                if (c.pattern && c.pattern.replace(/[^a-zA-Z0-9,+-]/g, "") == cmd) {
                        isIn = true
                }
        });
        await sleep(250)
        tog = tog == 'on' ? 'true' : 'false';
        if (!isIn) return await message.reply(lang.TOGGLE.ERROR);
        if (cmd == 'toggle') return await message.send(lang.TOGGLE.ERROR_KILL)
        if(tog == 'false') {
                await personalDB(['toggle'], {content:{[cmd]: tog}},'add');
                return await message.send(`_${cmd} Enabled._`)
        } else if(tog == 'true') {
                await personalDB(['toggle'], {content:{id: cmd}},'delete');
                return await message.send(`_${cmd} Disabled._`)
        }     

})
