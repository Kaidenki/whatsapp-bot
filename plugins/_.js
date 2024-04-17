const { Alpha, broadcast } = require('../lib');
const fs = require('fs');

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
    desc: lang.TAG_DESC,
    type: "owner",
    onlyGroup: true,
    fromMe: true
}, async (message, match) => {
    const groupMetadata = await message.client.groupMetadata(message.from).catch(e => {})
    const participants = await groupMetadata.participants
    const specifiedName = match.trim() || 'ciph3r 1';
    let counter = 1;
    let fileContent = "";
    for (let mem of participants) {
        let phoneNumber = mem.id.split('@')[0];
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');
        const name = counter === 1 ? specifiedName : `${specifiedName} ${counter}`;
        fileContent += `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nTEL;TYPE=CELL:${phoneNumber}\nEND:VCARD\n`;
        counter++;
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
    if (match.trim()) {
        await message.reply(`*vcf file generated with the specified name: ${specifiedName}*`);
    } else {
        await message.reply(`*No name was specified.*\n*Vcf file generated with default name: ${specifiedName}*`);
    }
});
