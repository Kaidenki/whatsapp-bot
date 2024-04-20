const { Alpha, broadcast, mode, config } = require('../lib');
const fs = require('fs');
const axios = require('axios')

Alpha({
    pattern: 'bcgc ?(.*)',
    fromMe: true,
    desc: 'broadcast to all user in a specified group',
    type: 'others',
    onlyGroup: true
}, async (message, match) => {
if(!message.reply_message.i) return await message.send("*_please reply to a message you want to broadcast_*");
return await broadcast(message, match, "group");
});

Alpha({
    pattern: 'bcpm ?(.*)',
    fromMe: true,
    desc: 'broadcast to all your pm messages',
    type: 'others'
}, async (message, match) => {
if(!message.reply_message.i) return await message.send("*_please reply to a message you want to broadcast_*");
return await broadcast(message, match, "pm");
});

Alpha({
    pattern: 'svcontact ?(.*)',
    desc: 'creates vcf file of all users in a specified group',
    type: "others",
    onlyGroup: true,
    fromMe: true
}, async (message, match) => {
    const groupMetadata = await message.client.groupMetadata(message.from).catch(e => {})
    const participants = await groupMetadata.participants
    let fileContent = "";
    for (let mem of participants) {
        let phoneNumber = mem.id.split('@')[0];
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');
        let user = mem.id.split('@')[0];
        user += '@s.whatsapp.net';
        const name = `${await message.getName(user)}`
        fileContent += `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nTEL;TYPE=CELL:${phoneNumber}\nEND:VCARD\n`;
    }
    let fileName = 'contacts.vcf';
    fs.writeFileSync(fileName, fileContent);
    await message.send({
        url: fileName
    }, {
        mimetype: 'text/vcard',
        fileName: 'contacts.vcf'
    }, 'document');
    fs.unlinkSync(fileName);
});

Alpha({
    pattern: "repo",
    desc: 'bot source script',
    type: "info",
    fromMe: mode
}, async (message, match) => {   
    try {
        const response = await axios.get(`https://api.github.com/repos/${config.REPO}`);
        if (response.status === 200) {
          const repoData = response.data;
          const info = `📁 *Repository Name:*  ${repoData.name}\n✏️ *Description:* ${repoData.description}\n👥 *Owner:* ${repoData.owner.login}\n⭐ *Stars:* ${repoData.stargazers_count}\n🍽️ *Forks:* ${repoData.forks_count}\n🔗 *URL:* ${repoData.html_url}
          `.trim();
          await message.reply(info);
        } else {
          await message.reply('Unable to fetch repository information.');
        }
      } catch (error) {
        console.error(error);
        await message.reply('An error occurred while fetching repository information.');
      }
});
