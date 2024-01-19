const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins voice channel."),
    execute: async ({player, interaction}) => {
        if (!interaction.member.voice.channel) 
        {
            await interaction.reply("You must be in a voice channel to execute this command.");
            return;
        }

        try {
            const voiceChannel = interaction.member.voice.channel;

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            connection.subscribe(player);

            console.log('Bot joined the voice channel');

            await interaction.reply("Successfully joined the voice channel.")
        } catch (error) {
            console.error('Error joining voice channel:', error);
            await interaction.reply("Unable to join the voice channel.")
        }
    }
}