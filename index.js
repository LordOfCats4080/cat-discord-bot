const { prefix, token } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    client.user.setActivity(`${prefix}help`, { type: 'WATCHING' });
    console.log('Ready!');
});

client.login(token);
