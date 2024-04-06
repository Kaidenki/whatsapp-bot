const { Alpha, mode, config, getJson } = require("../lib/");

Alpha(
  {
    pattern: "checkapi",
    fromMe: mode,
    desc: "check alpha rest apikey",
    type: "info",
  },
  async (message, match) => {
    const apikeyi = match ? match : config.ALPHA_KEY;
    const { status, creator, error, username, email, phoneNumber, isVerified, apikey, limitRem, limitApikey, totalUsers, totalRequests, visitors, requestToday } = await getJson(`${config.BASE_URL}api/info/apikey?apikey=${apikeyi}`);
    if (!status) {
      if (error === "Forbidden: Account is private") {
        const msg = `_*CREATOR:* ${creator}_\n\n_*TOTAL REQ:* ${totalRequests}_\n_*TOTAL USERS:* ${totalUsers}_\n_*TOTAL VISITORS:* ${visitors}_\n_*TODAY REQ:* ${requestToday}_\n\n*Forbidden: User Account is private.*`;
        await message.send(msg);
      } else {
        await message.send(error);
      }
      return;
    }
    
    const msg = `_*CREATOR:* ${creator}_\n_*TOTAL USERS:* ${totalUsers}_\n_*TOTAL VISITORS:* ${visitors}_\n_*TODAY REQ:* ${requestToday}_\n_*TOTAL REQ:* ${totalRequests}_\n\n_*LIMIT REMAINS:* ${limitRem}_\n_*Username:* ${username}_\n_*Email:* ${email}_\n_*Phone Number:* ${phoneNumber}_\n_*MAX REQ LIMIT:* ${limitApikey}_\n_*API KEY:* ${apikey}_\n_*Is Verified:* ${isVerified}_`;
    await message.send(msg);
  },
);






