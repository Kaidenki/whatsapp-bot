const {
    Alpha,
    mode,
    sendPhoto,
    sendVoice,
    sendGif,
    sendBassAudio,
    sendSlowAudio,
    sendBlownAudio,
    sendDeepAudio,
    sendErrapeAudio,
    sendFastAudio,
    sendFatAudio,
    sendNightcoreAudio,
    sendReverseAudio,
    sendSquirrelAudio,
    toAudio,
    toPTT,
    toVideo,
    AudioMetaData,
    lang,
    config
} = require('../lib');

Alpha({
    pattern: 'photo ?(.*)',
    desc: lang.CONVERTER.PHOTO_DESC,
    type: "converter",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.sticker) return  await message.reply(lang.BASE.NEED.format("non animated sticker message"));
    if(message.reply_message.isAnimatedSticker) return  await message.reply(lang.BASE.NEED.format("please reply to a non animated sticker"));
    return await sendPhoto(message);
});
Alpha({
    pattern: 'mp4 ?(.*)',
    desc: lang.CONVERTER.VIDEO_DESC,
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    if (!message.reply_message.sticker) return message.reply(lang.BASE.NEED.format("animated sticker message"));
    if(!message.reply_message.isAnimatedSticker) return  await message.reply(lang.BASE.NEED.format("please reply to an animated sticker"));
    let media = await toVideo(await message.reply_message.download())
    return await message.send(media,{
        mimetype: 'video/mp4',
    },'video')
});
Alpha({
    pattern: 'voice ?(.*)',
    desc: lang.CONVERTER.AUDIO_DESC,
    type: "converter",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("video/audio message"));
    let media = await toPTT(await message.reply_message.download())
    return await message.send(media,{
        mimetype: 'audio/mpeg',
        ptt: true
    }, 'audio')
});
Alpha({
    pattern: 'gif ?(.*)',
    desc: lang.CONVERTER.GIF_DESC,
    type: "converter",
    fromMe: mode
}, async (message) => {
    
    if (!message.reply_message.sticker || message.reply_message.video) return message.reply(lang.BASE.NEED.format("animated sticker/video message"));
    return await sendGif(message)
});
Alpha({
    pattern: 'bass ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendBassAudio(message)
});
Alpha({
    pattern: 'slow ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendSlowAudio(message)
});
Alpha({
    pattern: 'blown ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendBlownAudio(message)
});
Alpha({
    pattern: 'deep ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendDeepAudio(message);
});
Alpha({
    pattern: 'earrape ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendErrapeAudio(message)
});
Alpha({
    pattern: 'fast ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendFastAudio(message)
});
Alpha({
    pattern: 'fat ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendFatAudio(message);
});
Alpha({
    pattern: 'nightcore ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendNightcoreAudio(message);
});
Alpha({
    pattern: 'reverse ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendReverseAudio(message);
});
Alpha({
    pattern: 'squirrel ?(.*)',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendSquirrelAudio(message);
});

Alpha({
    pattern: 'mp3 ?(.*)',
    desc: lang.CONVERTER.MP3_DESC,
    type: "converter",
    fromMe: mode
}, (async (message) => {
    if (!message.reply_message.audio && !message.reply_message.video) return message.reply(lang.BASE.NEED.format("video message"));
    const opt = {
                title: config.AUDIO_DATA.split(/[|,;]/)[0] || config.AUDIO_DATA,
                body: config.AUDIO_DATA.split(/[|,;]/)[1],
                image: config.AUDIO_DATA.split(/[|,;]/)[2]
            }
    const AudioMeta = await AudioMetaData(await toAudio(await message.reply_message.download()), opt);
    return await message.send(AudioMeta,{
        mimetype: 'audio/mpeg'
    },'audio')
}));
