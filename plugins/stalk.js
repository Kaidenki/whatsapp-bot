const {
    Alpha,
    mode,
    config,
    getJson,
    getBuffer
} = require('../lib');

Alpha({
    pattern: 'git ?(.*)',
    fromMe: mode,
    desc: 'stalk git user name',
    type: 'search',
},
async (message, match) => {
    match = match || message.reply_message.text;
    if (!match)
        return await message.send('*Give me a git user name*\n*Example:*.git inrl-official');
    const {
        result,
        status
    } = await getJson(
        `${config.BASE_URL}api/info/githubstalk?user=${match}&apikey=${config.ALPHA_KEY}`
    );
    if (!status) 
        return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}api/signup for getting a new apikey. setvar inrl_key: your apikey`);
    
    const {
        login,
        type,
        avatar_url,
        site_admin,
        name,
        company,
        blog,
        location,
        email,
        hireable,
        bio,
        twitter_username,
        public_repos,
        public_gists,
        followers,
        following,
        created_at,
        updated_at
    } = result;

    const messageToSend = `_*name:* ${login}_\n_*type:* ${type}_\n_*site admin:* ${site_admin}_\n_*name:* ${name || 'N/A'}_\n_*company:* ${company || 'N/A'}_\n_*email:* ${email || 'N/A'}_\n_*hireable:* ${hireable || 'N/A'}_\n_*blog:* ${blog || 'null'}_\n_*location:* ${location || 'N/A'}_\n_*bio:* ${bio || 'N/A'}_\n_*twitter username:* ${twitter_username || 'N/A'}_\n_*public repos:* ${public_repos}_\n_*public gists:* ${public_gists}_\n_*followers:* ${followers}_\n_*following:* ${following}_\n_*updated at:* ${updated_at}_\n_*created at:* ${created_at}_`;

    await message.send(
        await getBuffer(avatar_url), 
        {
            caption: messageToSend,
            quoted: message.data
        },
        'image'
    );
});
