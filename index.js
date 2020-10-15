const fs = require('fs');

const { prefix, token } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity(`${prefix}help`, { type: 'WATCHING' });
    console.log('Ready!');
});

client.on('message', msg => {
    if (msg.partial || !msg.content.startsWith(prefix) || msg.webhookID || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    const cmd = client.commands.get(commandName)
      || client.commands.find(c => c.aliases && c.aliases.includes(commandName));

    if (!cmd) return;

    if (cmd.guildOnly && msg.channel.type === 'dm') {
	return message.reply('I can\'t execute that command inside DMs!');
    }

    if (cmd.args && !args.length) {
	let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (cmd.usage) {
	    reply += `\nThe proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;
	}

        return msg.channel.send(reply);
    }

    if (!cooldowns.has(cmd.name)) {
	cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = (cmd.cooldown || 3) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

	if (now < expirationTime) {
	    const timeLeft = (expirationTime - now) / 1000;
	    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }

    try {
	cmd.execute(msg, args);
    } catch (error) {
	console.error(error);
    }
});

client.login(token);
