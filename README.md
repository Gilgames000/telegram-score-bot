# telegram-score-bot
A simple score bot for Telegram chats.

## Commands
- /addpoints when replying to a message - adds points to the replied message sender
- /removepoints when replying to a message - removes points from the replied message sender
- /setpoints when replying to a message - sets the points of the replied message sender
- /score - shows your current points
- /score when replying to a message - shows the replied message sender points
- /leaderboard - shows the leaderboard
- /reset - resets the leaderboard (only usable by admins)
- /help - shows this help message
- /start - shows this help message

## Usage
1. Clone the repo
2. Run `npm i`
3. Rename `.env.example` to `.env` and type in your bot token
4. Run `node index.js`

## Docker
1. Clone the repo
2. Run `npm i`
3. Rename `.env.example` to `.env` and type in your bot token
4. Build the image with `docker build . -t telegram-score-bot`
5. Run the bot in a container with `docker run --env-file .env telegram-score-bot`

## License
GNU Affero General Public License v3.0
