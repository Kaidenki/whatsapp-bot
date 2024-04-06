const { Alpha, groupDB, lang, isAdmin, isBotAdmin, config } = require("../lib");

Alpha(
  {
    pattern: "warn ?(.*)",
    desc: lang.WARN.DESC,
    react: "😑",
    type: 'group',
    fromMe: true,
    onlyGroup: true,
  },
  async (message, match) => {
    if (!match && !message.reply_message.sender)
      return await message.send(
        lang.WARN.METHODE.format("warn", "warn", "warn"),
      );
    if (match == "get") {
      const { warn } = await groupDB(
        ["warn"],
        {
          jid: message.jid,
          content: {},
        },
        "get",
      );
      if (!Object.keys(warn)[0]) return await message.send("_Not Found!_");
      let msg = "";
      for (const f in warn) {
        msg += `_*user:* @${f}_\n_*count:* ${warn[f].count}_\n_*remaining:* ${config.WARNCOUND - warn[f].count}_\n\n`;
      }
      return await message.send(msg, {
        mentions: [message.reply_message.sender],
      });
    } else if (match == "reset") {
      if (!message.reply_message.sender)
        return await message.send(lang.BASE.NEED.format("user"));
      const { warn } = await groupDB(
        ["warn"],
        {
          jid: message.jid,
          content: {},
        },
        "get",
      );
      if (!Object.keys(warn)[0]) return await message.send("_Not Found!_");
      if (!Object.keys(warn).includes(message.reply_message.number))
        return await message.send("_User Not Found!_");
      await groupDB(
        ["warn"],
        {
          jid: message.jid,
          content: {
            id: message.reply_message.number,
          },
        },
        "delete",
      );
      return await message.send(lang.BASE.SUCCESS);
    } else {
      const BotAdmin = await isBotAdmin(message);
      const admin = await isAdmin(message);
      if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN);
      if (config.ADMIN_SUDO_ACCESS != "true" && !message.isCreator)
        return await message.reply(lang.BASE.NOT_AUTHR);
      if (!admin && !message.isCreator)
        return await message.reply(lang.BASE.NOT_AUTHR);
      if (!message.reply_message.sender)
        return await message.send(lang.BASE.NEED.format("user"));
      const reason = match || "warning";
      const { warn } = await groupDB(
        ["warn"],
        {
          jid: message.jid,
          content: {},
        },
        "get",
      );
      const count = Object.keys(warn).includes(message.reply_message.number)
        ? Number(warn[message.reply_message.number].count) + 1
        : 1;
      await groupDB(
        ["warn"],
        {
          jid: message.jid,
          content: {
            [message.reply_message.number]: {
              count,
            },
          },
        },
        "add",
      );
      const remains = config.WARNCOUND - count;
      let warnmsg = `❏────[warning]────❏
│ User :-@${message.reply_message.number}
❏────────────────❏
┏────── INFO ──────❏
│ Reason :- ${reason}
│ Count :- ${count}
│ Remaining :- ${remains}
┗•───────────────❏`;
      await message.send(warnmsg, {
        mentions: [message.reply_message.sender],
      });
      if (remains <= 0) {
        await groupDB(
          ["warn"],
          {
            jid: message.jid,
            content: {
              id: message.reply_message.number,
            },
          },
          "delete",
        );
        if (BotAdmin) {
          await message.client.groupParticipantsUpdate(
            message.from,
            [message.reply_message.sender],
            "remove",
          );
          return await message.reply(lang.WARN.MAX);
        }
      }
    }
  },
);
