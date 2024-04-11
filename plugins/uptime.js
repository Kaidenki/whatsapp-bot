const { runtime } = require("../lib/main/func");
const { Alpha, mode, config } = require("../lib");
const info = config.BOT_INFO
const parts = info.split(';')

Alpha(
  {
    pattern: "uptime",
    type: "info",
    desc: "shows bot uptime.",
    fromMe: mode,
  },
  async (message, match) => {
    const upt = runtime(process.uptime());
    const uptt = `Beep boop... System status: Fully operational!\n*Current uptime: ${upt}*`;

    let fileType = 'unknown';

    if (parts[2].endsWith('.jpg') || parts[2].endsWith('.png')) {
      fileType = 'image';
    } else if (parts[2].endsWith('.mp4')) {
      fileType = 'video';
    } 

    if (fileType === 'image') {
      await message.send({ url: parts[2] }, { caption: uptt }, "image");
    } else if (fileType === 'video') {
      await message.sendReply(parts[2], { caption: uptt }, 'video');
    }
  },
);
