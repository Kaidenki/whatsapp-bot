const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs');

async function sendPhoto(message){
   if (!/webp/.test(message.mime)) return message.reply('need a photo!');
   let _message = message.reply_message.sticker;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
        await ffmpeg(media)
            .fromFormat('webp_pipe')
            .save('output.png')
            .on('end', async () => {
 await message.client.sendMessage(message.from,{ image : fs.readFileSync('output.png')});
            });
}
async function sendVoice(message){
   if (!/video/.test(message.mime) && !/audio/.test(message.mime)) return;
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
   return await message.client.sendMessage( message.from,{ audio: { url: media }, mimetype: "audio/mp4", ptt:true }, { quoted: message }); 
}
async function sendGif(message){
   if (!/webp/.test(message.mime)) return;
   let _message = message.reply_message.sticker;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
   let webpToMp4 = await webp2mp4File(media)
   return await message.client.sendMessage(message.from, { video: { url : webpToMp4.result }, gifPlayback: true },{ quoted: message });  
}
async function sendBassAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-af equalizer=f=54:width_type=o:width=2:g=20"])
        .save("./media/bass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });
}
async function sendSlowAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .audioFilter("atempo=0.5")
        .outputOptions(["-y", "-af", "asetrate=44100*0.9"])
        .save("./media/bass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
      });
}
async function sendBlownAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-af acrusher=.1:1:64:0:log"])
        .save("./media/bass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });        
}
async function sendDeepAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-af atempo=4/4,asetrate=44500*2/3"])
        .save("./media/bass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
      });      
}
async function sendErrapeAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-af volume=12"])
        .save("./media/bass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });	
}
async function sendFastAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-filter:a atempo=1.63,asetrate=44100"])
        .save("./media/bhass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bhass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
     });
}
async function sendFatAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-filter:a atempo=1.6,asetrate=22100"])
        .save("./media/bgass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });   
}
async function sendNightcoreAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-filter:a atempo=1.06,asetrate=44100*1.25"])
        .save("./media/bgass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });  
}
async function sendReverseAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-filter_complex areverse"])
        .save("./media/bgass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });  
}
async function sendSquirrelAudio(message){
   let _message = message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
    await ffmpeg(media)
        .outputOptions(["-filter:a atempo=0.5,asetrate=65100"])
        .save("./media/beass.mp3")
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/beass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });  
}
async function sendMp4AsMp3(message){
   let _message = message.reply_message.video ? message.reply_message.video : message.reply_message.audio;
   if(!_message) return;
   let media = await message.client.downloadAndSaveMediaMessage(_message)
await ffmpeg(media)
        .save('./media/bass.mp3')
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });      
}

module.exports = { sendPhoto, sendVoice, sendGif, sendBassAudio, sendSlowAudio, sendBlownAudio, sendDeepAudio, sendErrapeAudio, sendFastAudio, sendFatAudio, sendNightcoreAudio, sendReverseAudio, sendSquirrelAudio, sendMp4AsMp3 };
