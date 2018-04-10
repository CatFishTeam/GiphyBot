var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var giphy = require('giphy-api')();
var http = require('http');

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

        let limit = '1';
        let regex = new RegExp('.+\\s(\\d+)$')
        if(regex.exec(message.substring(4)) !== null){
            limit = regex.exec(message.substring(4))[1]
        }

        switch(cmd) {
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: "```" +
                    "[Commands]\n" +
                    "!help : You'll find out\n" +
                    "!gif <wtv u want> : This found a random gif\n" +
                    "!multi <wtv u want> <number> : This find multiple gif\n" +
                    "!emrata : This is where it all began"+
                    "```"
                })
                break;
            case 'gif':
                giphy.random({
                    tag: message.substring(4),
                    rating: 'r',
                }, function (err, res) {
                    bot.sendMessage({
                        to: channelID,
                        message: res.data.embed_url
                    })
                });
                break;
            case 'multi':
                giphy.search({
                    q: message.substring(4),
                    rating: 'r',
                    limit: limit,
                }, function (err, res) {
                    console.log(limit)
                    res.data.forEach((gif) => {
                        bot.sendMessage({
                            to: channelID,
                            message: gif.embed_url
                        })
                    })
                });
                break;
            case 'emrata':
                giphy.random({
                    tag: 'emily ratajkowski',
                    rating: 'r',
                    fmt: 'json'
                }, function (err, res) {
                    bot.sendMessage({
                        to: channelID,
                        message: res.data.url
                    })
                });
                break;
            //test
            case 'alexisren':
                giphy.random({
                    tag: 'alexis ren',
                    rating: 'r',
                    fmt: 'json'
                }, function (err, res) {
                    bot.sendMessage({
                        to: channelID,
                        message: res.data.url
                    })
                });
                break;
            //test
            case 'test':
                var options = {
                    host: "api.giphy.com",
                    path: "/v1/gifs/search?q=ryan+gosling&api_key="+auth.giphy+"&limit=5",
                    port: 80,
                };

                var req = http.get(options, function (res) {
                    res.on('data', function (chunk) {
                        bot.sendMessage({
                        to: channelID,
                        message: chunk
                        })
                    });
                });
                break;
            }

    }
});
