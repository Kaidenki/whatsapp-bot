function MediaUrls(text) {
	let array = [];
	const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
	let urls = text.match(regexp);
	if (urls) {
		urls.map(url => {
			if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webp'].includes(url.split('.').pop().toLowerCase())) {
				array.push(url);
			}
		});
		return array;
	} else {
		return false;
	}
}

async function mention(m, text) {
	const types = ['type/image', 'type/video', 'type/audio', 'type/sticker', 'type/gif']
	const jsonArray = text.match(/({.*})/g);
	let msg = text.replace(jsonArray, '');
	let type = 'text',
		message = {
			contextInfo: {}
		};
	for (const i in types) {
		if (msg.match(types[i])) {
			type = msg.match(types[i])[0].replace('type/', '');
			break;
		}
	}
	if (jsonArray) message = JSON.parse(jsonArray[0]);
	if (message.linkPreview) {
		message.contextInfo = message.contextInfo ? message.contextInfo : {};
		message.contextInfo.externalAdReply = message.linkPreview;
	}
	if (message.contextInfo?.externalAdReply?.thumbnail) {
			message.contextInfo.externalAdReply.thumbnailUrl = message?.contextInfo?.externalAdReply?.thumbnail;
			delete message.contextInfo.externalAdReply.thumbnail;
	}
	delete message.linkPreview;
	let URLS = MediaUrls(msg);
	if (type != 'text' && URLS[0]) {
		URLS.map(url => msg = msg.replace(url, ''));
		msg = msg.replace('type/', '').replace(type, '').replace(/,/g, '').trim();
		let URL = URLS[Math.floor(Math.random() * URLS.length)];
		if (type == 'image') {
			message.mimetype = 'image/jpg'
			message.image = {
				url: URL
			}
			return await m.client.sendMessage(m.jid, message)
		} else if (type == 'video') {
			message.mimetype = 'video/mp4'
			message.video = {
				url: URL
			}
			return await m.client.sendMessage(m.jid, message)
		} else if (type == 'audio') {
			message.mimetype = 'audio/mpeg'
			message.audio = {
				url: URL
			}
			return await m.client.sendMessage(m.jid, message)
		} else if (type == 'sticker') {
			message.mimetype = 'image/webp'
			return await m.sendSticker(m.jid, URL, message)
		} else if (type == 'gif') {
			message.gifPlayback = true;
			message.video = {
				url: URL
			}
			return await m.client.sendMessage(m.jid, message)
		}
	} else {
		if (msg.includes('&sender')) {
			msg = msg.replace('&sender', '@' + m.number);
			message.contextInfo.mentionedJid = [m.sender];
		}
		message.text = msg;
		return await m.client.sendMessage(m.jid, message)
	}
}
module.exports = {
	mention
}
