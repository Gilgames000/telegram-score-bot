'use strict';

import 'dotenv/config';
import { session, Telegraf } from 'telegraf';


const scores = {};
const helpMessage = `A bot that keeps track of score points in a group chat
- /addpoints when replying to a message - adds points to the replied message sender
- /removepoints when replying to a message - removes points from the replied message sender
- /setpoints when replying to a message - sets the points of the replied message sender
- /score - shows your current points
- /score when replying to a message - shows the replied message sender points
- /leaderboard - shows the leaderboard
- /reset - resets the leaderboard (only usable by admins)
- /help - shows this help message
- /start - shows this help message`;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.admin(session()));
bot.start((ctx) => ctx.reply(helpMessage));
bot.help((ctx) => ctx.reply(helpMessage));

bot.command('score', async (ctx) => {
    const user = ctx.message.reply_to_message?.from ?? ctx.message.from;
    const groupId = ctx.message.chat.id.toString();
    if (!scores[groupId]) {
        scores[groupId] = {
            userScores: {},
            leaderboard: [],
        };
    }

    const userScore = scores[groupId].userScores[user.id] ?? 0;
    await ctx.reply(`${user.username ?? user.first_name} has ${userScore} points`);
});

bot.command('leaderboard', async (ctx) => {
    const groupId = ctx.message.chat.id.toString();
    if (!scores[groupId]) {
        scores[groupId] = {
            userScores: {},
            leaderboard: [],
        };
    }

    const leaderboard = scores[groupId].leaderboard;
    const leaderboardMessage = leaderboard.map((user, index) => `${index + 1}. ${user.username} - ${user.score}`).join('\n');

    if (leaderboardMessage === '') {
        await ctx.reply('No scores yet');
    } else {
        await ctx.reply(leaderboardMessage);
    }
});

bot.command('reset', Telegraf.admin(async (ctx) => {
    const groupId = ctx.message.chat.id.toString();
    scores[groupId] = {
        userScores: {},
        leaderboard: [],
    };
    await ctx.reply('Leaderboard reset');
}));

bot.command(['addpoints', 'removepoints', 'setpoints'], Telegraf.admin(async (ctx) => {
    const points = parseInt(ctx.message.text.split(' ')[1]);
    if (isNaN(points)) {
        await ctx.reply('Invalid points');
        return;
    }

    const user = ctx.message.reply_to_message?.from;
    if (!user) {
        await ctx.reply('Invalid user');
        return;
    }

    const groupId = ctx.message.chat.id.toString();
    if (!scores[groupId]) {
        scores[groupId] = {
            userScores: {},
            leaderboard: [],
        };
    }

    const userScore = scores[groupId].userScores[user.id] ?? 0;
    let newScore = 0;
    if (ctx.message.text.startsWith('/addpoints')) {
        newScore = userScore + points;
    } else if (ctx.message.text.startsWith('/removepoints')) {
        newScore = userScore - points;
    } else if (ctx.message.text.startsWith('/setpoints')) {
        newScore = points;
    }

    scores[groupId].userScores[user.id] = newScore;

    const leaderboard = scores[groupId].leaderboard;
    const userIndex = leaderboard.findIndex((_user) => _user.username === user.username || _user.username === user.first_name);
    if (userIndex === -1) {
        leaderboard.push({ username: user.username ?? user.first_name, score: newScore });
    } else {
        leaderboard[userIndex].score = newScore;
    }
    leaderboard.sort((a, b) => b.score - a.score);

    await ctx.reply(`${user.username ?? user.first_name} now has ${newScore} points`);
}));


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

(async () => {
    await bot.launch();
    console.log('Bot started');
})();
