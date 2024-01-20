## Quick description

This bot plays a short sound when a person joins a voice channel. A user can upload any sound they like.

## Commands

/join - The bot will join the voice channel the user is in.

/leave - The bot will leave the voice channel it's in.

/set - this command will let you upload an audio to set as your intro. when ever you join the channel this will play for everyone to hear.

## How to run it

First create a new application on the Discord developer portal and uncheck the "Public bot" option under the bot settings. Then follow the following steps.

1. Create .env file and add `APP_ID` and `DISCORD_TOKEN` enviroment variables. You will find those on the Discord dev portal in your application settings. Use the token from under the bot setting.
2. run `npm i` and `npm start`
3. Invite the bot to your server. On the Discord dev portal go to OAuth2 -> URL Generator and create a url with the following permissions.
   - Scopes: `bot`
   - Bot premissions:
     - `Read Messeges/View channels`
     - `Send Messages`
     - `Connect`
     - `Speak`
