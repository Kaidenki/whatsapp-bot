const { Alpha, config } = require('../lib');
const { SUDO, HEROKU } = require("../config");
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_KEY })
const baseURI = "/apps/" + HEROKU.APP_NAME;


Alpha({
        pattern: 'setvar ?(.*)',
        fromMe: true,
        desc: 'Set heroku config var',
        type: 'heroku'
}, async (message, match) => {
        if (!match) return await message.send('```Either Key or Value is missing```');
        const [key, value] = match.split(':');
        if (!key || !value) return await message.send('use setvar STICKER_DATA: c-iph3r;alpha-md');
        await heroku.patch('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars', {
                body: {
                        [key.trim().toUpperCase()]: match.replace(key,'').replace(':','').trim()
                }
        }).then(async () => {
                await message.send('Successfully Set ' + '```' + key + '➜' + match.replace(key,'').replace(':','').trim() + '```')
        }).catch(async (error) => {
                await message.send(`HEROKU : ${error.body.message}`)
        })
})

Alpha({
        pattern: 'delvar ?(.*)',
        fromMe: true,
        desc: 'Delete heroku config var',
        type: 'heroku'
}, async (message, match) => {
        if (!match) return await message.send('```Either Key or Value is missing```');
        await heroku.get('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars').then(async (vars) => {
                for (vr in vars) {
                        if (match == vr) {
                                await heroku.patch('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars', {
                                        body: {
                                                [match.toUpperCase()]: null
                                        }
                                });
                                return await message.send('```{} successfully deleted```'.replace('{}', match));
                        }
                }
                await message.send('```No results found for this key```');
        }).catch(async (error) => {
                await message.send(`HEROKU : ${error.body.message}`);
        });
});

Alpha({
        pattern: 'getvar ?(.*)',
        fromMe: true,
        desc: 'show all config var',
        type: 'heroku'
}, async (message, match) => {
        let msg = "*_all config vars_*\n\n",
                got = false;
        for (const key in config) {
                if (key != 'DATABASE' && key != 'BASE_URL' && key != 'HEROKU' && key != 'SESSION_ID') {
                        if (!match) {
                                msg += `_*${key}* : ${config[key]}_\n`;
                        } else if (match.toUpperCase() == key) {
                                return await message.send(`_*${match.toUpperCase()}* : ${config[key]}_`);
                                got = true;
                                break;
                        }
                }
        }
        if (match && !got) return await message.send('_the requested key was not found_\n_try *getvar* to get all variables_');
        return await message.send(msg);
});

Alpha(
  { 
    pattern: "setsudo ?(.*)", 
    fromMe: true, 
    desc: "add a number to the list of sudo numbers", 
    type: "heroku"
  },
  async (message, match, m) => {
    const match2 = message.reply_message.sender.split('@')[0];
    let newSudo = match2||match; 
    if (!newSudo) {
      return await message.send("*Please provide a number to set as sudo*\n*or reply to a user to set as sudo*\n*eg setsudo 2348114860536*");
    }
    let setSudo = (SUDO + "," + newSudo).replace(/,,/g, ",");
    setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
    await message.send("_New sudo numbers are:_ "  +  setSudo);
    await message.send("_It takes 30 seconds to take effect_");
    await heroku.patch(baseURI + "/config-vars", { body: { SUDO: setSudo } })
      .then(async (app) => {
      })
      .catch(error => {
      });
  }
);


Alpha(
  { 
    pattern: "remsudo ?(.*)", 
    fromMe: true, 
    desc: "remove a number from list of sudo numbers", 
    type: "heroku"
  },
  async (message, match, m) => {
   const match2 = message.reply_message.sender.split('@')[0];
    let delSudo = match2||match; 
    if (!delSudo) {
      return await message.send("*Please provide a number to delete from sudo*\n*or reply to a user to delete from sudo*\n*eg remsudo 2348114860536*");
    }
    let sudoList = SUDO.split(",");
    const index = sudoList.indexOf(delSudo);
    if (index !== -1) {
      sudoList.splice(index, 1);
    }
    let updatedSudoList = sudoList.join(",");
    await message.send("_Updated sudo numbers are:_ "  +  updatedSudoList);
    await message.send("_It takes 30 seconds to take effect_");
    await heroku.patch(baseURI + "/config-vars", { body: { SUDO: updatedSudoList } })
      .then(async (app) => {
      })
      .catch(error => {
      });
  }
);


 Alpha(
        { pattern: "getsudo ?(.*)", 
          fromMe: true, 
          desc: "shows current list of sudo numbers", 
          type: "heroku" 
        },
        async (message, match) => {
          const vars = await heroku
            .get(baseURI + "/config-vars")
            .catch(async (error) => {
              return await message.send("HEROKU : " + error.body.message);
            });
          await message.send("```" + `SUDO Numbers are : ${vars.SUDO}` + "```");
        }
      );
