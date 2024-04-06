
const os = require('os');
const { checkBad } = require("alpha-md");
let {
    WORKTYPE,
    PREFIX,
    BOT_INFO,
    BASE_URL
} = require('../config');
let img_url, theme = 'text'; 
const image = MediaUrl(BOT_INFO)
if (image) {
    img_url = image[0];
    if (img_url) {
        theme = img_url.video ? 'video' : 'image'; 
        BOT_INFO = BOT_INFO.replace(img_url[theme], '').trim();
    } else {
        console.error("No valid URLs found in BOT_INFO.\nPlease set BOT_INFO config with valid image URLs.");
        process.exit(1);
    }
}
const {
    getBuffer,
    sleep
} = require('./main/func');
const {
    commands
} = require('./main/prefix');
const packageJson = require('../package.json'); 
const ID3Writer = require('browser-id3-writer');
const FormData = require('form-data');
const axios = require('axios');
const api = "76a050f031972d9f27e329d767dd988f" || "deb80cd12ababea1c9b9a8ad6ce3fab2";
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

function MediaUrl(text) {
    let array = [];
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
    let urls = text.match(regexp);
    if (urls) {
        for (let i = 0; i < urls.length; i++) {
            if (['jpg', 'jpeg', 'png'].includes(urls[i].split('.').pop().toLowerCase())) {
                array.push({
                    image: urls[i]
                });
                break;
            }
            if ('mp4'.includes(urls[i].split('.').pop().toLowerCase())) {
                array.push({
                    video: urls[i]
                });
                break;
            }
        }
        return array;
    } else {
        return false;
    }
}

const format = function (code) {
    let i = -1;
    let byt = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        code /= 1024;
        i++
    } while (code > 1024);
    return Math.max(code, 0.1).toFixed(1) + byt[i];
};
async function uploadImageToImgur(imagePath) {
    try {
        const data = new FormData();
        data.append('image', fs.createReadStream(imagePath));

        const headers = {
            'Authorization': `Client-ID 3ca8036b07e0f25`,
            ...data.getHeaders()
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.imgur.com/3/upload',
            headers: headers,
            data: data
        };

        const response = await axios(config);
        return response?.data?.data?.link;
    } catch (error) {
        return `invalid location get:bad-get`;
    }
}

async function AudioMetaData(audio, info = {}) {
    let title = info.title || "alpha-md";
    let body = info.body ? [info.body] : [];
    let img = info.image || 'https://i.imgur.com/DyLAuEh.jpg';
    if (!Buffer.isBuffer(img)) img = await getBuffer(img);
    if (!Buffer.isBuffer(audio)) audio = await getBuffer(audio);
    const writer = new ID3Writer(audio);
    writer
        .setFrame("TIT2", title)
        .setFrame("TPE1", body)
        .setFrame("APIC", {
            type: 3,
            data: img,
            description: "alpha-md",
        });
    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
}


function addSpace(text, length = 3, align = "left") {
    text = text.toString();
    if (text.length >= length) return text;
    const even = length - text.length % 2 !== 0 ? length + 1 : length; 
    const space = " ";
    if (align !== "left" && align !== "right") { 
        for (let i = 0; i <= even / 2; i++) {
            if (text.length < even) {
                text = space + text + space;
            }
        }
        return text;
    }
    for (let i = 1; text.length < length; i++) {
        if (align === "left") text = text + space; 
        if (align === "right") text = space + text; 
    }
    return text;
}

async function sendUrl(message) {
    if (message.reply_message.sticker) {
        const imageBuffer = await message.reply_message.download();
        const form = new FormData();
        form.append('image', imageBuffer, 'bt.jpg');
        form.append('key', api);
        const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders()
        }).catch(e => e.response);
        return await message.send(response.data.data.image.url);
    } else if (message.reply_message.image || message.image) {
        const msg = message.reply_message.image || message.image;
        const url = await uploadImageToImgur(await message.client.downloadAndSaveMediaMessage(msg));
        return await message.send(url);
    } else if (message.reply_message.video || message.video) {
        const msg = message.reply_message.video || message.video;
        const url = await uploadImageToImgur(await message.client.downloadAndSaveMediaMessage(msg));
        return await message.send(url);
    } else if (message.reply_message.audio) {
        const msg = message.reply_message.audio;
        let urvideo = await message.client.downloadAndSaveMediaMessage(msg);
        await ffmpeg(urvideo)
            .outputOptions(["-y", "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                const url = await uploadImageToImgur('./output.mp4');
                return await message.send(url);
            });
    }
}

async function send_menu(m) {
    const info_vars = BOT_INFO.split(/[;,|]/);
    let date = new Date().toLocaleDateString("EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const prefix = PREFIX === "false" ? '' : PREFIX; 
    let cmnd = [];
    let cmd;
    let category = [],
        type;
    let menu = `╭━〔 ${(info_vars[0] || info_vars || '').replace(/[;,|]/g, '')} 〕━◉
┃╭━━━━━━━━━━━━━━◉
┃┃ *Plugins :-* ${commands.length.toString()}
┃┃ *User :-* @${m.number}
┃┃ *Owner :-* ${(info_vars[1] || '').replace(/[;,|]/g, '')}
┃┃ *Version:-* ${packageJson.version} 
┃┃ *Prefix:-* ${prefix}
┃┃ *MODE :-* ${WORKTYPE}
┃┃ *Date :-* ${date}
┃┃ *Ram :-* ${format(os.totalmem() - os.freemem())}
┃╰━━━━━━━━━━━━━◉`;
    commands.map((command) => {
        if (command.pattern) {
            cmd = command.pattern;
            type = command.type.toLowerCase()
        }
        cmnd.push({
            cmd,
            type: type
        });

        if (!category.includes(type)) category.push(type);

    });
    category.forEach((cmmd) => {
        menu += `
┠┌─⭓『 ${addSpace("*"+cmmd.toUpperCase()+"*",14,"both")} 』`;
        let comad = cmnd.filter(({
            type
        }) => type == cmmd);
        comad.forEach(async ({
            cmd
        }, num) => {
            menu += `\n┃│◦ _${cmd.replace(/[^a-zA-Z0-9-+]/g,'')}_`;
        });
        menu += `\n┃└──────────⭓`;
    });
    menu += '\n╰━━━━━━━━━━━━━◉'
    if (theme === 'text') { 
        return await m.client.sendMessage(m.from, {
            text: menu,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
    } else {
        return await m.client.sendMessage(m.from, {
            [theme]: {
                url: img_url[theme] 
            },
            caption: menu,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
    }
}

function MediaUrls(text) {
    let array = [];
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
    let urls = text.match(regexp);
    if (urls) {
        urls.map(url => {
            if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webp'].includes(url.split('.').pop().toLowerCase())) {
                array.push(url);
            }
        });
        return array;
    } else {
        return false;
    }
}
async function send_alive(m, ALIVE_DATA) {
    const sstart = new Date().getTime();
    let msg = {
        contextInfo: {}
    }
    const prefix = PREFIX === "false" ? '' : PREFIX; 
    let extractions = ALIVE_DATA.match(/#(.*?)#/g);
    let URLS;
    if (extractions) {
        ALIVE_DATA = ALIVE_DATA.replace(/#([^#]+)#/g, '');
        extractions = extractions.map(m => m.slice(1, -1));
        let arra = [];
        URLS = MediaUrls(ALIVE_DATA);
        msg.contextInfo.externalAdReply = {
            containsAutoReply: true,
            mediaType: 1,
            previewType: "PHOTO"
        };
        extractions.map(extraction => {
            extraction = extraction.replace('\\', '');
            if (extraction.match(/adattribution/gi)) msg.contextInfo.externalAdReply.showAdAttribution = true;
            if (extraction.match(/adreply/gi)) msg.contextInfo.externalAdReply.showAdAttribution = true;
            if (extraction.match(/largerthumbnail/gi)) msg.contextInfo.externalAdReply.renderLargerThumbnail = true;
            if (extraction.match(/largethumb/gi)) msg.contextInfo.externalAdReply.renderLargerThumbnail = true;
            if (extraction.match(/title/gi)) msg.contextInfo.externalAdReply.title = extraction.replace(/title/gi, '');
            if (extraction.match(/body/gi)) msg.contextInfo.externalAdReply.body = extraction.replace(/body/gi, '');
            if (extraction.match(/thumbnail/gi) && !extraction.match(/largerthumbnail/gi)) msg.contextInfo.externalAdReply.thumbnailUrl = extraction.replace(/thumbnail/gi, '');
            if (extraction.match(/thumb/gi) && !extraction.match(/largerthumbnail/gi) && !extraction.match(/largethumb/gi) && !extraction.match(/thumbnail/gi)) msg.contextInfo.externalAdReply.thumbnailUrl = extraction.replace(/thumb/gi, '');
            if (extraction.match(/sourceurl/gi)) msg.contextInfo.externalAdReply.sourceUrl = extraction.replace(/sourceurl/gi, '');
            if (extraction.match(/mediaurl/gi)) msg.contextInfo.externalAdReply.mediaUrl = extraction.replace(/mediaurl/gi, '');
        });
    } else {
        URLS = MediaUrls(ALIVE_DATA);
    }
    let date = new Date().toLocaleDateString("EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const URL = URLS[Math.floor(Math.random() * URLS.length)];
    const platform = os.platform();
    const sender = m.sender;
    const user = m.pushName;
    let text = ALIVE_DATA.replace(/&ram/gi, format(os.totalmem() - os.freemem())).replace(/&sender/gi, `@${sender.replace(/[^0-9]/g,'')}`).replace(/&user/gi, `${user}`).replace(/&version/gi, `${package.version}`).replace(/&prefix/gi, `${prefix}`).replace(/&mode/gi, `${WORKTYPE}`).replace(/&platform/gi, `${platform}`).replace(/&date/gi, `${date}`).replace(/&speed/gi, `${sstart-new Date().getTime()}`).replace(/&gif/g, '');
    if (ALIVE_DATA.includes('&sender')) msg.contextInfo.mentionedJid = [sender];
    if (ALIVE_DATA.includes('&gif')) msg.gifPlayback = true;
    if (URL && URL.endsWith('.mp4')) {
        msg.video = {
                url: URL
            },
            msg.caption = URLS.map(url => text = text.replace(url, ''));

    } else if (URL) {
        msg.image = {
                url: URL
            },
            msg.caption = URLS.map(url => text = text.replace(url, ''));

    } else msg.text = text.trim();
    return await m.client.sendMessage(m.jid, msg);
}

function badWordDetect(pattern) {
    return checkBad(pattern);
}
async function broadcast(msg, opt, type = "group") {
    if (type == "group" && !msg.isGroup) throw new Error("command only work in group");
    if (opt) {
        try {
            const jsonArray = opt.match(/({.*})/g);
            if (jsonArray) opt = JSON.parse(jsonArray[0]);
            if (jsonArray.linkPreview) {
                jsonArray.contextInfo ? jsonArray.contextInfo : {};
                jsonArray.contextInfo.externalAdReply = jsonArray.linkPreview;
                delete jsonArray.linkPreview;
                jsonArray.contextInfo.externalAdReply.containsAutoReply = true,
                jsonArray.contextInfo.externalAdReply.mediaType = 1,
                jsonArray.contextInfo.externalAdReply.previewType = "PHOTO"
            }
        } catch (e) {
            throw new Error("Invalid JSON object");
        }
    } else opt = {};
    if (type == "group") {
        const { participants } = await msg.client.groupMetadata(msg.jid).catch(e => []);
        const ujid = participants.map(a => a.id);
        for (let i = 0; i < ujid.length; i++) {
            await sleep(1500);
            await msg.forwardMessage(ujid[i], msg.reply_message, opt);
        }
        return 'tried';
    } else if (type == "allgroup") {
        const response = await msg.client.groupFetchAllParticipating()
        const groups = Object.entries(response).slice(0).map(entry => entry[1])
        const groupJid = groups.map(v => v.id);
        groupJid.map(async (jid) => {
            await sleep(1500);
            await msg.forwardMessage(jid, msg.reply_message, opt);
        });
        return 'tried';
    } else if (type == "all") {
        const response = await msg.client.groupFetchAllParticipating()
        const groups = Object.entries(response).slice(0).map(entry => entry[1])
        const groupJid = groups.map(v => v.id);
        groupJid.map(async (jid) => {
            await sleep(500);
            const { participants } = await msg.client.groupMetadata(jid).catch(e => []);
            const ujid = participants.map(a => a.id);
            for (let i = 0; i < ujid.length; i++) {
                await sleep(1500);
                await msg.forwardMessage(ujid[i], msg.reply_message, opt);
            }
        });
        return 'tried';
    } else {
        const Jid = await msg.store.chats.all().filter(a => !a.id.endsWith('g.us') && !a.id.endsWith('broadcast')).map(a => a.id);
        Jid.map(async (j) => {
            await sleep(1500);
            await msg.forwardMessage(j, msg.reply_message, opt);
        });
        return 'tried';
    }
}

async function poll(id) {
    if (!fs.existsSync('./lib/database/poll.json')) return {
        status: false
    }
    const file = JSON.parse(fs.readFileSync('./lib/database/poll.json'));
    const poll_res = file.message.filter(a => id.key.id == Object.keys(a)[0]);
    if (!poll_res[0]) return {
        status: false
    }
    let options = {}
    const vote_id = Object.keys(poll_res[0]);
    const vote_obj = Object.keys(poll_res[0][vote_id].votes);
    let total_votes = 0;
    vote_obj.map(a => {
        options[a] = {
            count: poll_res[0][vote_id].votes[a].length
        };
        total_votes = total_votes + poll_res[0][vote_id].votes[a].length
    });
    const keys = Object.keys(options);
    keys.map(a => options[a].percentage = (options[a].count / total_votes) * 100 + '%');
    return {
        status: true,
        res: options,
        total: total_votes
    }
}

module.exports = {
    AudioMetaData,
    badWordDetect,
    addSpace,
    sendUrl,
    send_menu,
    send_alive,
    broadcast,
    poll
};
