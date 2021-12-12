const fs = require('fs');
const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const files = fs.readdirSync('./commands');

let commandsCollection = new Collection();
let commands = [];

for ( let file of files ) {
    const command = require(`./commands/${file}`);

    commandsCollection.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    )
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

module.exports = commandsCollection;