const { Alpha, mode, getJson, config } = require('../lib');

class MathGame {
    constructor(question, answer, startTime, timeLimitInSeconds) {
        this.question = question;
        this.answer = answer;
        this.startTime = startTime;
        this.timeLimitInSeconds = timeLimitInSeconds;
        this.status = true; 
    }
    isCorrectAnswer(userAnswer) {
        return userAnswer === this.answer;
    }
    isTimeUp() {
        const currentTime = Date.now();
        const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
        return elapsedTimeInSeconds >= this.timeLimitInSeconds;
    }
    getTimeRemaining() {
        const currentTime = Date.now();
        const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
        return Math.max(0, Math.ceil(this.timeLimitInSeconds - elapsedTimeInSeconds));
    }
    endGame() {
        this.status = false;
    }
}
let currentGame = null;

Alpha({
    pattern: "math ?(.*)",
    type: "fun",
    fromMe: mode,
}, async (message, match) => {
    if (match) {
        const difficulty = match.trim().toLowerCase();
        const validDifficulties = ['easy', 'normal', 'hard', 'extreme', 'impossible', 'impossible2', 'god'];
        
        if (!validDifficulties.includes(difficulty)) {
            return await message.reply('Invalid difficulty level. Please choose from: easy, normal, hard, extreme, impossible, impossible2, god.');
        }
        try {
            const apiUrl = `${config.BASE_URL}api/game/maths?difficulty=${difficulty}&apikey=${config.ALPHA_KEY}`;
            const { question, answer } = await getJson(apiUrl);
            const timeLimitInSeconds = getTimeLimitInSeconds(difficulty);
            const startTime = Date.now();
            currentGame = new MathGame(question, answer, startTime, timeLimitInSeconds);
            await message.reply(`*Here's your math question:*\n\n${question}\n\nYou have *${timeLimitInSeconds} seconds* to answer.`);
            setTimeout(() => {
                if (currentGame && currentGame.status) {
                    message.reply(`Time's up! The correct answer is *${currentGame.answer}*. You failed to answer in time.`);
                    currentGame.endGame();
                }
            }, timeLimitInSeconds * 1000);
        } catch (error) {
            console.error('Error fetching math question:', error);
            await message.reply(`An error occurred while fetching the math question. Please try again later or API key limit exceeded. Get a new API key at ${config.BASE_URL}signup. Set var alpha_key: your_api_key`);
        }
    }
});

Alpha({
    on: 'text',
    fromMe: mode
}, async (m, match) => {
    if (currentGame && currentGame.status && !isNaN(parseInt(m.body))) {
        const userAnswer = parseInt(m.body);
        if (currentGame.isCorrectAnswer(userAnswer)) {
            await m.reply('Congratulations! You answered correctly!');
            currentGame.endGame();
        } else if (currentGame.isTimeUp()) {
            await m.reply(`Time's up! The correct answer is *${currentGame.answer}*. You failed to answer in time.`);
            currentGame.endGame();
        } else {
            const timeRemaining = currentGame.getTimeRemaining();
            await m.reply(`Incorrect answer. \n*you have ${timeRemaining} seconds remaining.*`);
        }
    }
});

function getTimeLimitInSeconds(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 60;
        case 'normal':
            return 45;
        case 'hard':
            return 30;
        case 'extreme':
            return 25;
        case 'impossible':
            return 20;
        case 'impossible2':
            return 15;
        case 'god':
            return 10;
        default:
            return 30;
    }
}
