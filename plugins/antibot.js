const { Alpha, groupDB } = require("../lib");
const actions = ["kick", "warn", "null"];

Alpha(
  {
    pattern: "antibot ?(.*)",
    desc: "remove users who use bot",
    type: 'group',
    onlyGroup: true,
    fromMe: true,
  },
  async (message, match) => {
    if (!match)
      return await message.reply(
        "_*antibot* on/off_\n_*antibot* action warn/kick/null_",
      );
    const { antibot } = await groupDB(
      ["antibot"],
      { jid: message.jid, content: {} },
      "get",
    );
    if (match.toLowerCase() == "on") {
      const action = antibot && antibot.action ? antibot.action : "null";
      await groupDB(
        ["antibot"],
        { jid: message.jid, content: { status: "true", action } },
        "set",
      );
      return await message.send(
        `_antibot Activated with action null_\n_*antibot action* warn/kick/null for chaning actions_`,
      );
    } else if (match.toLowerCase() == "off") {
      const action = antibot && antibot.action ? antibot.action : "null";
      await groupDB(
        ["antibot"],
        { jid: message.jid, content: { status: "false", action } },
        "set",
      );
      return await message.send(`_antibot deactivated_`);
    } else if (match.toLowerCase().match("action")) {
      const status = antibot && antibot.status ? antibot.status : "false";
      match = match.replace(/action/gi, "").trim();
      if (!actions.includes(match))
        return await message.send("_action must be warn,kick or null_");
      await groupDB(
        ["antibot"],
        { jid: message.jid, content: { status, action: match } },
        "set",
      );
      return await message.send(`_AntiBot Action Updated_`);
    }
  },
);
