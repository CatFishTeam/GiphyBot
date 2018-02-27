var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var giphy = require('giphy-api')();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        console.log(args)

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            // Just add any case commands if you want to..
            case 'gif':
                giphy.search('test', function (err, res) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'http://resize-parismatch.ladmedia.fr/r/,600,forcey/img/var/news/storage/images/paris-match/people/emily-ratajkowski-la-dolce-vita-1288832/em14/21513737-1-fre-FR/EM14.jpg'
                    })
                });
                break;
            case 'emrata':
                bot.sendMessage({
                    to: channelID,
                    message: 'https://media.giphy.com/media/EFIwNN4wo9Tig/giphy.gif'
                });
                break;
            }
    }
});