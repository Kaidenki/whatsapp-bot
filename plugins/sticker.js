const {
  Alpha,
  mode,
  lang,
  config
} = require('../lib');
const fs = require("fs");
const path = require("path");

Alpha(
  {
    pattern: "sticker",
    fromMe: mode,
    desc: lang.STICKER.DESC,
    react: "🔁",
    type : 'converter',
    usage : "to convert short video or image to sticker fromate, ex:- sticker[replied_msg]"
  },
  async (message, match) => {
    if (!/image|video|webp/.test(message.mime)) return await message.send(
      lang.STICKER.ERROR
        );
     if (message.reply_message.mime) {
        let download = await message.reply_message.download();
        return await message.sendSticker(message.jid, download, {
          author: config.STICKER_DATA.split(/[|;,]/)[0] || config.STICKER_DATA,
          packname: config.STICKER_DATA.split(/[|;,]/)[1],
        });
      } else if (/image|video|webp/.test(message.mime)) {
        let download = await message.client.downloadMediaMessage(message);
        return await message.sendSticker(message.jid, download, {
          author: config.STICKER_DATA.split(/[|;,]/)[0] || config.STICKER_DATA,
          packname: config.STICKER_DATA.split(/[|;,]/)[1],
        });
      } else {
        return await message.send(
          lang.STICKER.ERROR
        );
      }
  }
);
