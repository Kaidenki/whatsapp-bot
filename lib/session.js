const axios = require('axios');
const fs = require('fs');
const path = require('path');
const  config  = require("../config");
async function fetchSession(sessionId, folderPath) {
    try {
        const response = await axios.get(`${config.BASE_URL}session/restore?id=${sessionId}`);
        const encodedData = response.data.content;
        const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
        const filePath = path.join(__dirname, '..', folderPath, 'creds.json');
        fs.writeFileSync(filePath, decodedData);
        console.log(`Session fetched successfully.\nbot starts in 5 seconds`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

module.exports = fetchSession;
