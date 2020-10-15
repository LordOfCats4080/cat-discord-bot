module.exports = {
    name: 'slowmode',
    description: 'Adjust a channel\'s slowmode.',
    args: true,
    usage: '<seconds>',
    aliases: ['ratelimit', 'slowdown', 'cooldown', 'coolmode', 'chill', 'chillzone', 'zone'],
    execute(msg, args) {
	const slowmode = args[0];

	if (Number.isInteger(Number.parseInt(slowmode)) && slowmode <= 21600 && slowmode >= 0) {
	    msg.channel.setRateLimitPerUser(slowmode);
	} else {
	    msg.reply('you need to enter a number between 0-21600 second(s).');
	}
    }
};
