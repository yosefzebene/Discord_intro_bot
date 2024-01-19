require("dotenv").config()

const { Client, IntentsBitField, Collection } = require('discord.js');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');

const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "data/users.json");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const player = createAudioPlayer();

client.on('ready', (c) => {
    console.log(`${c.user.username} is up and running!`);

    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({version: "9"}).setToken(process.env.DISCORD_TOKEN);
    
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId), {
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildId}`))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({player, interaction});
    }
    catch(err) {
        console.error(err);
        await interaction.reply("An error occurred while executing that command.");
    }
});

client.on("voiceStateUpdate", (oldState, newState) => {
    const { guild, member } = newState;

    const connection = getVoiceConnection(guild.id)

    //if the bot is in a voice channel
    if (connection) {
        // Check if the member joined the voice channel where the bot is
        if(newState.channelId === connection.joinConfig.channelId && member.id !== client.user.id) {
            // if the old state has a null for channel that means the person joined
            if (!oldState.channelId || oldState.channelId != newState.channelId)
            {
                console.log(`${member.displayName} joined the voice channel.`);

                // This is where the bot will find the sound the user has selected and plays it. 
                // If the user never assigned a join sound nothing will play.
                let dataRead = '{}';
                if (fs.existsSync(dataPath))
                    dataRead = fs.readFileSync(dataPath);

                const dataFile = JSON.parse(dataRead);
                const userId = member.id;
                if (dataFile[userId]) {
                    const resource = createAudioResource(path.join(__dirname, `sounds/${dataFile[userId].name}`));
                    try {
                        player.play(resource);
                    }
                    catch (err)
                    {
                        console.log(err);
                    }
                }
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);