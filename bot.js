const discord = require('discord.js');
const bot = new discord.Client();

let token = process.env.BOT_TOKEN;
let prefix = "$";


function hex() {
    return "#" + Math.floor(Math.random() * 12345678).toString(16);
}

bot.on('ready', function() {
    console.log('[Server]: Bot is on.');
});

var servers = {};

var randoms = [
	["It is certain","It is decidedly so","Without a doubt","Yes, definitely","You may rely on it","As I see it, yes","Most likely","Outlook good","Yes","Signs point to yes","Reply hazy try again","Ask again later","Better not tell you now","Cannot predict now","Concentrate and ask again","Don't count on it","My reply is no","My sources say no","Outlook not so good","Very doubtful"];
];

bot.on('message', function(msg) {
    if(msg.author.bot) return;
    if(msg.content.indexOf(prefix) !== 0) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let user = msg.mentions.users.first();
	if (!user) {
		user = msg.author;
	}
	let status = user.presence.status;
	if (status === 'online') {
		status = 'Online';
	} else if (status === 'idle') {
		status = 'Idle';
	} else if (status === 'dnd') {
		status = 'Do Not Disturb';
	} else {
		status = 'Invisible';
	}
	let stream = false;
	if (user.presence.game && user.presence.game.streaming) {
		stream = true;
	}
	let game;
	if (user.presence.game === null) {
		game = 'No Game Displayed';
	} else if (user.presence.game.streaming) {
		game = `[${user.presence.game.name}](${user.presence.game.url})`;
	} else {
		game = user.presence.game.name;
	}

    switch(command) {
        case 'ping':
            msg.reply('pong');
            break;
        case 'avatar':
            msg.reply(msg.author.avatarURL);
            break;
        case 'embed':
            let embed = new discord.RichEmbed()
            .setDescription(`${user.username.toString()} Profile Details`)
            .addField('User ID:', `${user.id}`)
            .addField('User Joined:', `${user.createdAt.toUTCString()}`)
            .addField('User status:', `${status}`, true)
            .addField('User playing:', `${game}`, true)
            .addField('User stream mode:', `${stream}`, true)
            .addField('User discriminator:', `${user.discriminator}`, true)
            .addField('User is bot:', `${user.bot}`, true)
            .addField('Username:', `${user.username}`, true)
            .setThumbnail(user.displayAvatarURL)
            .setColor(hex())
            msg.channel.send({embed});
            break;
        case 'help':
            msg.channel.send({embed: {
                color: 3447003,
                author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL
                },
                title: "TrapBot",
                url: "http://youtube.com/TrapKillo",
                description: "Bot Author: MrTrap",
                fields: [{
                    name: "Commands",
                    value:
                    "``help`` - Show all commands." +
                    "\n``8ball`` - Gives a random answer to your question." +
                    "\n``avatar`` - It shows your avatar." +
                    "\n``ping`` - Bot reply pong." +
                    "\n``embed`` - Create a profile embed" +
                    "\n``clear`` - Clean messages"
                }],
                timestamp: new Date(),
                footer: {
                icon_url: bot.user.avatarURL,
                text: "© MrTrap"
                }
            }
            });
            break;
        case '8ball':
            if(!args[0]) msg.reply('Please add question so I can answer with `yes` - `no` - `maybe`');
            else msg.reply(randoms[Math.floor(Math.random() * randoms.length)]);
            break;
        case 'clear':
            if(!msg.channel.permissionsFor(msg.author)) {
                msg.reply('Only the owner can use this command!');
                return;
            }
            if(!args[0]) {
                msg.channel.bulkDelete(2);
                msg.channel.send('Deleted 2 messages!');
            } else {
                msg.channel.bulkDelete(args[0]);
                msg.channel.send(`Deleted ${args[0]} messages!`);
            }
            break;
        default:
            msg.reply('Command does not exists. Please do ``$help`` to read the commands.');
            break;
    }
});

bot.login(token);
