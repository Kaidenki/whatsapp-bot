const { runtime } = require("../lib/main/func");
const { Alpha, mode } = require("../lib");
const imgurl = 'https://i.pinimg.com/originals/36/26/ae/3626aea69e2d97c077b85f46d72e1131.jpg'


Alpha(
  {
    pattern: "uptime",
    type: "info",
    desc: "shows bot uptime.",
    fromMe: mode,
  },
  async (message, match) => {
    const upt = runtime(process.uptime());

    await message.send(
      {
        url: imgurl,
      },
      {
        caption: `Beep boop... System status: Fully operational!\n*Current uptime: ${upt}*`,
      },
      "image",
    );
  },
);