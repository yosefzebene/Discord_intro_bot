const { SlashCommandBuilder } = require("@discordjs/builders");

const Https  = require('https');
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set")
        .setDescription("Set the audio you want to play when you join.")
        .addAttachmentOption((option) => option
            .setRequired(true)
            .setName("audio")
            .setDescription("The audio to use for an intro.")),
    execute: async ({player, interaction}) => {
        const attachment = interaction.options.getAttachment("audio");

        if (attachment.contentType !== 'audio/mpeg') {
            await interaction.reply("Please attach an audio file.");
            return;
        }
        else if (attachment.size > 250000) {
            await interaction.reply("Please attach a shorter audio file. No greater than 250kB")
            return;
        }

        // Make sure the sounds folder exists
        const soundsDir = './src/sounds/';
        if (!fs.existsSync(soundsDir)) {
            fs.mkdirSync(soundsDir, { recursive: true });
        }

        // Download uploaded audio file to sounds
        const file = fs.createWriteStream(`${soundsDir}${attachment.name}`);
        Https.get(attachment.url, response => {
            response.pipe(file);
        })

        // Make sure the data folder exists
        const dataDir = './src/data/';
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Create record for user
        const path = './src/data/users.json';
        let dataRead = '{}';
        if (fs.existsSync(path))
            dataRead = fs.readFileSync(path);

        const dataFile = JSON.parse(dataRead);
        const userId = interaction.member.id;

        dataFile[userId] = { name: attachment.name };
        fs.writeFileSync(path, JSON.stringify(dataFile, null, 2));

        console.log(`${interaction.member.displayName} has set ${attachment.name} as their intro.`)
        await interaction.reply(`Successfully set ${attachment.name} as your intro.`);
    }
}