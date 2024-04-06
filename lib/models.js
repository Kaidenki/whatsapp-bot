const {setTrueCallerkey, getTrueCallertoken, TrueLogout} = require('./database/truecaller');
const axios = require('axios');
const parsePhoneNumber = require("awesome-phonenumber");
const {OPEN_AI,ELEVENLABS} = require('../config')
const fs = require('fs');

async function clear() {
  if(!fs.existsSync('./lib/database/gpt.json')) return false
  fs.unlinkSync('./lib/database/gpt.json');
  return true;
}

async function interactWithAI(userPrompt) {
    try {
        let messageData = { 'messages': [] };
        if(fs.existsSync('./lib/database/gpt.json')){
          messageData = JSON.parse(fs.readFileSync('./lib/database/gpt.json'));
        }
        if(!OPEN_AI) return '*provide a gpt key*\n_*add your* <key> *on config.js*_\n*example*\n_setvar open_ai: sk-**************yth_';
        let systemMessage = "history:" + messageData.messages.map(m => `${m.role} [${m.timestamp}]: ${m.content}`).join("\n");
        let response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 'Authorization': `Bearer ${OPEN_AI.trim()}`, 'Content-Type': 'application/json' },
            data: { 'model': 'gpt-3.5-turbo', 'messages': [ { "role": "system", "content": systemMessage }, { "role": "user", "content": userPrompt } ] }
        });
        let timestamp = new Date().toISOString();
        messageData.messages.push({ "role": "user", "content": userPrompt, "timestamp": timestamp });
        messageData.messages.push({ "role": "assistant", "content": response.data.choices[0].message.content, "timestamp": timestamp });
        fs.writeFileSync('./lib/database/gpt.json', JSON.stringify(messageData, null, 2))
        return response.data.choices[0].message.content;
    } catch (e) {
        return e?.response?.data?.error?.message ? e.response.data.error.message : e
    }
}

const trueCallerModels = [
    {
      "manufacturer": "Xiaomi",
      "model": "M2010J19SG"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "POCO F1"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Redmi 9A"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Mi 4"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Redmi Note 10 pro"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Redmi Note 10"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Redmi 1S"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Mi 10T"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Redmi 6 Pro"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Redmi Y3"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Xiaomi Redmi 9 Prime"
    },
    {
      "manufacturer": "Xiaomi",
      "model": "Redmi Note 7"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo Y33s"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo V21 5G"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo Y20T"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo Y73 2021"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo X60"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo X70 Pro 5G"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo U3x"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo V20 Pro"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo Y21 2021"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo Y53s"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo S12 Pro"
    },
    {
      "manufacturer": "Vivo",
      "model": "Vivo V21e 5G"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus Nord CE 5G"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 9 Pro"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 8T"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 9"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 7T"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 6T"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus Nord 2"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus 7 Pro"
    },
    {
      "manufacturer": "OnePlus",
      "model": "OnePlus Nord"
    },
    {
      "manufacturer": "Realme",
      "model": "RMX2185"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme GT Neo2 5G"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme 8 5G"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme C11 2021"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme GT"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme Narzo 30"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme Q3i 5G"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme 8s 5G"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme 8i"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme Narzo 50A"
    },
    {
      "manufacturer": "Realme",
      "model": "Realme C21Y"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A55"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A74 5G"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A53"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A31"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A12"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO Reno6 Pro"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO Reno6"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO F19 Pro"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO F19s"
    },
    {
      "manufacturer": "Oppo",
      "model": "Oppo F19 Pro+"
    },
    {
      "manufacturer": "Oppo",
      "model": "Oppo A33"
    },
    {
      "manufacturer": "Oppo",
      "model": "Oppo Reno 3 Pro"
    },
    {
      "manufacturer": "Oppo",
      "model": "Oppo Reno 4 Pro"
    },
    {
      "manufacturer": "Oppo",
      "model": "Oppo Find X2"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO F15"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO Reno 2F"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO K3"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A9"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A1k"
    },
    {
      "manufacturer": "Oppo",
      "model": "OPPO A5s"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M31s"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M32"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy F62"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M52 5G"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M12"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M51"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy F12"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy F22"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy A52"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy S20 FE 5G"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M52"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M62"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy S21 Ultra"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy A52s 5G"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy S21"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M21 2021"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy F42"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy A12"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy F41"
    },
    {
      "manufacturer": "Samsung",
      "model": "Samsung Galaxy M01 Core"
    }
  ]
  const labsVoiceID = {
    "rachel":{
       "voice_id":"21m00Tcm4TlvDq8ikWAM"
    },
    "clyde":{
       "voice_id":"2EiwWnXFnvU5JabPnv8n"
    },
    "domi":{
       "voice_id":"AZnzlk1XvdvUeBnXmlld"
    },
    "dave":{
       "voice_id":"CYw3kZ02Hs0563khs1Fj"
    },
    "fin":{
       "voice_id":"D38z5RcWu1voky8WS1ja"
    },
    "bella":{
       "voice_id":"EXAVITQu4vr4xnSDxMaL"
    },
    "antoni":{
       "voice_id":"ErXwobaYiN019PkySvjV"
    },
    "thomas":{
       "voice_id":"GBv7mTt0atIp3Br8iCZE"
    },
    "charlie":{
       "voice_id":"IKne3meq5aSn9XLyUdCD"
    },
    "emily":{
       "voice_id":"LcfcDJNUP1GQjkzn1xUU"
    },
    "elli":{
       "voice_id":"MF3mGyEYCl7XYWbV9V6O"
    },
    "callum":{
       "voice_id":"N2lVS1w4EtoT3dr4eOWO"
    },
    "patrick":{
       "voice_id":"ODq5zmih8GrVes37Dizd"
    },
    "harry":{
       "voice_id":"SOYHLrjzK2X1ezoPC6cr"
    },
    "liam":{
       "voice_id":"TX3LPaxmHKxFdv7VOQHJ"
    },
    "dorothy":{
       "voice_id":"ThT5KcBeYPX3keUQqHPh"
    },
    "josh":{
       "voice_id":"TxGEqnHWrfWFTfGW9XjX"
    },
    "arnold":{
       "voice_id":"VR6AewLTigWG4xSOukaG"
    },
    "charlotte":{
       "voice_id":"XB0fDUnXU5powFXDhCwa"
    },
    "matilda":{
       "voice_id":"XrExE9yKIg1WjnnlVkGX"
    },
    "matthew":{
       "voice_id":"Yko7PKHZNXotIFUBG7I9"
    },
    "james":{
       "voice_id":"ZQe5CZNOzWyzPSCn5a3c"
    },
    "joseph":{
       "voice_id":"Zlb1dXrM653N07WRdFW3"
    },
    "jeremy":{
       "voice_id":"bVMeCyTHy58xNoL34h3p"
    },
    "michael":{
       "voice_id":"flq6f7yk4E4fJM5XTYuZ"
    },
    "ethan":{
       "voice_id":"g5CIjZEefAph4nQFvHAz"
    },
    "gigi":{
       "voice_id":"jBpfuIE2acCO8z3wKNLl"
    },
    "freya":{
       "voice_id":"jsCqWAovK2LkecY7zXl4"
    },
    "grace":{
       "voice_id":"oWAxZDx7w5VEj9dCyTzz"
    },
    "daniel":{
       "voice_id":"onwK4e9ZLuTAKqWW03F9"
    },
    "serena":{
       "voice_id":"pMsXgVXv3BLzUgSXRplE"
    },
    "adam":{
       "voice_id":"pNInz6obpgDQGcFmaJgB"
    },
    "nicole":{
       "voice_id":"piTKgcLEGmPE4e6mEKli"
    },
    "jessie":{
       "voice_id":"t0jbNlBVZ17f02VDIeMI"
    },
    "ryan":{
       "voice_id":"wViXBPUzp2ZZixB1xQuM"
    },
    "sam":{
       "voice_id":"yoZ06aMxZJJ28mfd3POQ"
    },
    "glinda":{
       "voice_id":"z9fAnlkpzviPz146aGWa"
    },
    "giovanni":{
       "voice_id":"zcAOhNBS3c14rBihAFp1"
    },
    "mimi":{
       "voice_id":"zrHiDhphv9ZnVXBqCLjz"
    }
 }
const device = trueCallerModels[Math.floor(Math.random() * trueCallerModels.length)];

function generateRandomString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function TrueLogin(phoneNumber) {
  const {number} = await getTrueCallertoken();
  if(number) return false;
    const pn = parsePhoneNumber('+'+phoneNumber.toString());
    if (!pn?.g?.valid) return "Invalid phone number."
    const postUrl = "https://account-asia-south1.truecaller.com/v2/sendOnboardingOtp";
    const data = {
        countryCode: pn.g.regionCode,
        dialingCode: pn.g.countryCode,
        installationDetails: {
            app: {
                buildVersion: 5,
                majorVersion: 11,
                minorVersion: 7,
                store: "GOOGLE_PLAY",
            },
            device: {
                deviceId: generateRandomString(16),
                language: "en",
                manufacturer: device.manufacturer,
                model: device.model,
                osName: "Android",
                osVersion: "10",
                mobileServices: ["GMS"],
            },
            language: "en",
        },
        phoneNumber: pn.g.number.significant,
        region: "region-2",
        sequenceNo: 2,
    };
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "accept-encoding": "gzip",
            "user-agent": "Truecaller/11.75.5 (Android;10)",
            clientsecret: "lvc22mp3l1sfv6ujg83rd17btt",
        },
        url: postUrl,
        data,
    };
    try {
      const res = await axios(options);
      if(res.response) return res.response;
      await setTrueCallerkey({key:res.data.requestId,number: phoneNumber});
      return true;
    } catch (e) {
      return e.response.data.message;
    }
}

async function TrueOtp(otp) {
  const {key,number} = await getTrueCallertoken();
  if(!number) return `_use command *true login* as first!!_`
  const pn = parsePhoneNumber('+'+number.toString());
    const postData = {
        countryCode: pn.g.regionCode,
        dialingCode: pn.g.countryCode,
        phoneNumber: pn.g.number.significant,
        requestId: key,
        token: otp.toString().trim(),
    };
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "accept-encoding": "gzip",
            "user-agent": "Truecaller/11.75.5 (Android;10)",
            clientsecret: "lvc22mp3l1sfv6ujg83rd17btt",
        },
        url: "https://account-asia-south1.truecaller.com/v1/verifyOnboardingOtp",
        data: postData,
    };
    try {
      const res = await axios(options);
      if(!res.data.installationId) return res.data.message;
      await TrueLogout();
      await setTrueCallerkey({token: res.data.installationId})
      return true;
    } catch (e) {
      await TrueLogout();
      return `_sessions closed!!_`
    }
}

async function TrueSearch(number) {
  const {token} = await getTrueCallertoken();
  if(!token) return {status: false ,message: `*_Please login to truecaller as first_*\n_true *login* to login truecaller_\n\n_example: *true login* 9108775432_`};
        const searchData = {
            number: number.toString(),
            installationId: token,
        }
    const phoneNumber = parsePhoneNumber('+'+searchData.number.toString());
    const significantNumber = phoneNumber?.g?.number?.significant;
    return axios
        .get(`https://search5-noneu.truecaller.com/v2/search`, {
        params: {
            q: significantNumber,
            countryCode: phoneNumber.g.regionCode,
            type: 4,
            locAddr: "",
            placement: "SEARCHRESULTS,HISTORY,DETAILS",
            encoding: "json",
        },
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "accept-encoding": "gzip",
            "user-agent": "Truecaller/11.75.5 (Android;10)",
            Authorization: `Bearer ${searchData.installationId}`,
        },
    })
        .then((response) => {
        const obj = {status: true},res = response.data.data[0];
        obj.name = res.name;
        obj.score = res.score;
        obj.access = res.access;
        obj.e164Format = res?.phones?.[0]?.e164Format;
        obj.numberType = res?.phones?.[0]?.numberType;
        obj.nationalFormat = res?.phones?.[0]?.nationalFormat;
        obj.dialingCode = res?.phones?.[0]?.dialingCode;
        obj.countryCode = res?.phones?.[0]?.countryCode;
        obj.carrier = res?.phones?.[0]?.carrier;
        obj.type = res?.phones?.[0]?.type;
        obj.address = res?.addresses?.[0]?.address;
        obj.city = res?.addresses?.[0]?.city;
        obj.countryCode = res?.addresses?.[0]?.countryCode;
        obj.timeZone = res?.addresses?.[0]?.timeZone;
        return obj
    },
    (error) => {
        return {status: false,message: error.response.statusText}
    });
}
async function elevenlabs(match) {
  let response = {};
for(key in labsVoiceID) {
  if(match.split(/[|,;]/)[1].toLowerCase().trim() == key){
  let v_key = labsVoiceID[key]["voice_id"];
  const voiceURL = `https://api.elevenlabs.io/v1/text-to-speech/${v_key}/stream`;
  
  response = await axios({
        method: "POST",
        url: voiceURL,
        data: {
          text: match.split(/[|.;]/)[0].trim(),
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
          model_id: "eleven_monolingual_v1",
        },
        headers: {
          Accept: "audio/mpeg",
          "xi-api-key": (ELEVENLABS || '2a0050b5932ff8d79f54418fa370d1c1'),
          "Content-Type": "application/json",
        },
        responseType: "stream"
      });
      break;
    }
  }
  return response.data;
}
const GPT = {
    set: async(key)=>await setGPTkey(key),
    prompt: async(prompt) => await interactWithAI(prompt),
    clear: async() => await clear()
}
const truecaller = {
    search: async(num) => await TrueSearch(num),
    set: async(key) => await TrueLogin(key),
    otp: async(key) => await TrueOtp(key),
    logout: async() => await TrueLogout()
}
module.exports = {GPT, truecaller, elevenlabs};