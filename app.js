const dotenv = require('dotenv');
dotenv.config();

const {Client, Intents} = require('discord.js');
const commands = require('./loader.js');
const mongoose = require('mongoose');
const ctftime = require('./services/ctftime');
const http = require('http');

mongoose.connect(process.env.MONGO, () => console.log('Connected to DB'));

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});
client.commands = commands;

ctftime.setup(client);

client.once('ready', () => console.log('Connected to Discord!'));

client.on('interactionCreate', async (interaction) => {
    if ( !interaction.isCommand() ) return;

    let command = client.commands.get(interaction.commandName);
    if ( !command ) return;
    
    await command.execute(interaction, client);
});

client.login(process.env.TOKEN);

http.createServer(async (req, res) => {
    if ( req.url === '/check' ) {
        await ctftime.checkForEvents();
    }
    res.end();
}).listen(process.env.PORT);