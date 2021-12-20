const https = require('https');
const database = require('./database');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const API_URL = 'https://ctftime.org/api/v1';
let client;

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if ( res.statusCode !== 200 ) {
                reject();
                return;
            }
            let data = '';

            res.on('data', d => {
                data += d.toString();
            });

            res.on('end', () => {
                data = JSON.parse(data);
                resolve(data);
            });
        });
    });
}

async function checkForEvents() {
    let startTime = Date.now();
    let endTime = startTime + 5*24*60*60*1000;
    let data = await sendRequest(`${API_URL}/events/?start=${startTime}&end=${endTime}`);

    data = database.getUnregisteredCtfs(data);

    if ( data.length > 0 ) {
        let channel = await client.channels.fetch(database.getNewsChannel());
        let category = await client.channels.fetch(database.getCategoryChannel());

        for ( ctf of data ) {
            let embed = new MessageEmbed({
                title: ctf.title,
                description: ctf.description,
                thumbnail: {
                    url: ctf.logo
                },
                url: ctf.ctftime_url,
                color: 2508611,
                fields: [
                    {
                        name: 'Start Date:',
                        value: `<t:${Date.parse(ctf.start)/1000}>`
                    },
                    {
                        name: 'End Date:',
                        value: `<t:${Date.parse(ctf.finish)/1000}>`
                    },
                    {
                        name: 'Links:',
                        value: `[CTFTime](${ctf.ctftime_url}) \t [Website](${ctf.url})`
                    }
                ]
            });

            let channelName = ctf.title.toLowerCase();
            channelName.replace(/[^a-z0-9_]/g, '-')

            await category.createChannel(channelName, {
                permissionOverwrites: [
                ]
            });
            await channel.send({
                embeds: [embed]
            });
            await database.addCtf(ctf.id);
        }
    }
}

function setup(discordClient) {
    client = discordClient;
}

module.exports = {
    setup,
    checkForEvents
}