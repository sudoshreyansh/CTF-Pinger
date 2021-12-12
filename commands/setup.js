const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../services/database');

async function execute(interaction) {
    let clubRole = interaction.options.get('club_role').role;
    if ( !clubRole ) {
        await interaction.reply({
            content: 'Please give a valid role for club members',
            ephemeral: true
        });
        return;
    }

    let guild = interaction.guild;

    let categoryChannel = await guild.channels.create('ctf', {
        type: 'GUILD_CATEGORY'
    });

    let newsChannel = await categoryChannel.createChannel('news', {
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [
                    'SEND_MESSAGES',
                    'VIEW_CHANNEL'
                ]
            },
            {
                id: clubRole,
                allow: [
                    'VIEW_CHANNEL'
                ]
            }
        ]
    });

    await database.setClubRole(clubRole.id);
    await database.setNewsChannel(newsChannel.id);
    await database.setCategoryChannel(categoryChannel.id);

    await interaction.reply({content: 'Done!', ephemeral: true});
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot')
        .addMentionableOption(option =>
            option.setName('club_role')
                .setDescription('Role of club members')
                .setRequired(true)),
    execute
}