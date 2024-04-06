const {Alpha,WCG} = require("../lib")

Alpha({
    on: "text",
    pattern: "wcg",
    type: "fun",
    desc: "Word Chain game",
    fromMe: false,
    onlyGroup: true
}, async (message) => {
    const try_to_start = new WCG(message);
    try_to_start.start();
});
