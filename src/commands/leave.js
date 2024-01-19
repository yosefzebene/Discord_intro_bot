const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves voice channel"),
    execute: async ({player, interaction}) => {
        if (!interaction.member.voice.channel) 
        {
            await interaction.reply("You must be in a voice channel to execute this command.");
            return;
        }

        try {
            const voiceChannel = interaction.member.voice.channel;
            const connection = getVoiceConnection(voiceChannel.guildId);

            if (!connection)
            {
                await interaction.reply("Bot is not in a voice channel");
                return;
            }

            player.stop();
            connection.destroy();

            console.log('Bot has left the voice channel');
            await interaction.reply("Left the voice channel.");
            

        } catch (error) {
            console.error('Error leaving voice channel:', error);
            await interaction.reply("Unable to leave the voice channel.");
        }
    }
}