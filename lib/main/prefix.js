let commands = [];

function Alpha(info, func) {
  let infos = {
    pattern: info.pattern,
    on: info.on,
    type: info.type || "others",
    DismissPrefix: info.DismissPrefix,
    allowBot: info.allowBot,
    fromMe: info.fromMe === undefined ? true : info.fromMe,
    onlyGroup: info.onlyGroup,
    react: info.react,
    onlyPm: info.onlyPm,
    desc: info.desc || "",
    usage: info.usage || "",
    dontAddCommandList: info.dontAddCommandList || false,
    media: info.media || "all",
    function: func,
    root: info.root,
  };
  commands.push(infos);
  return infos;
}
module.exports = { Alpha, commands };
