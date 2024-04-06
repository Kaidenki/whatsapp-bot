const toBool = (x) => x == "true";
const { existsSync } = require("fs");
const { Sequelize } = require("sequelize");
if (existsSync(".env")) require("dotenv").config({ path: "./.env" });
process.env.NODE_OPTIONS = "--max_old_space_size=2560"; //2.5
const DB_URL = process.env.DATABASE_URL || "";
const keysInrl = ['hjS2WBZ', 'QbfLgXT', 'dOd5DTh', 'free50_inrl', '5UYcKW6'];


module.exports = {
  RKEY : keysInrl[Math.floor(keysInrl.length * Math.random())],
  SESSION_ID: process.env.SESSION_ID || " ", //your ssid to run bot
  HEROKU: {
    API_KEY: process.env.HEROKU_API_KEY,
    APP_NAME: process.env.HEROKU_APP_NAME,
  },
  PORT: process.env.PORT || 3067,
  BASE_URL: "https://api.alpha-md.rf.gd/",
  REPO: "Primi373-creator/inrl-bot-md",
  REJECT_CALL: toBool(process.env.REJECT_CALL || "true"),
  BADWORD_BLOCK: toBool(process.env.BADWORD_BLOCK || "false"),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE || "true"),
  PM_BLOCK: toBool(process.env.PM_BLOCK || "false"),
  CALL_BLOCK: toBool(process.env.CALL_BLOCK || "true"),
  STATUS_VIEW: process.env.STATUS_VIEW || "true",
  SAVE_STATUS: toBool(process.env.SAVE_STATUS || "true"),
  ADMIN_SUDO_ACCESS: toBool(process.env.ADMIN_SUDO_ACCESS || "true"),
  DISABLE_PM: toBool(process.env.DISABLE_PM || "false"),
  DISABLE_GRP: toBool(process.env.DISABLE_GRP || "false"),
  ERROR_MSG: toBool(process.env.ERROR_MSG || "true"),
  AJOIN: toBool(process.env.AJOIN || "false"),
  READ: process.env.READ || "false", //true, command
  CHATBOT: process.env.CHATBOT || "false", //gc, gc2, gc3 , pm, pm2, pm3 not working
  CHATPX: process.env.CHATPX || "$", //prefix for chat bot leave null if you dont know what you are doing. not working
  REACT: process.env.REACT || "false", //true, command, emoji
  WARNCOUND: process.env.WARNCOUND || 3,
  BOT_INFO: process.env.BOT_INFO || "Alpha-md;Cipher;https://i.pinimg.com/originals/36/26/ae/3626aea69e2d97c077b85f46d72e1131.jpg",
  WORKTYPE: process.env.WORKTYPE || "public",
  PREFIX: process.env.PREFIX || "#", //both  .  and [.] equal, for multi prefix we use [] this
  LANG: process.env.LANG || "en",
  PERSONAL_MESSAGE: process.env.PERSONAL_MESSAGE || "null",
  BOT_PRESENCE: process.env.BOT_PRESENCE || "composing",
  AUDIO_DATA: process.env.AUDIO_DATA || "Alpha-md;Cipher;https://i.pinimg.com/originals/36/26/ae/3626aea69e2d97c077b85f46d72e1131.jpg",
  STICKER_DATA: process.env.STICKER_DATA || "Cipher;Alpha-md",
  BRAINSHOP: process.env.BRAINSHOP || "181291,oXUgTsTeOOxdYSle",
  SUDO: process.env.SUDO || "2349150690169, 2348114860536",
  RMBG_KEY: process.env.RMBG_KEY,
  OPEN_AI: process.env.OPEN_AI,
  ELEVENLABS: process.env.ELEVENLABS,
  ALPHA_KEY: process.env.ALPHA_KEY || "alpha-free",
  OCR_KEY: (process.env.OCR_KEY || "K84003107488957").trim(),
  DATABASE: DB_URL
    ? new Sequelize(DB_URL, {
        dialect: "postgres",
        ssl: true,
        protocol: "postgres",
        dialectOptions: {
          native: true,
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      })
    : new Sequelize({
        dialect: "sqlite",
        storage: "./database.db",
        logging: false,
      }),
};
