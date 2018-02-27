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

        let query = '';
        args.forEach( (mot, i) => {
            query += (i == 0) ? mot : '+'+mot;
        })

        /*
        if(/.*\s(\d+)/.exec(message.substring(4))[1]){
            let limit = /.*\s(\d+)/.exec(message.substring(4))[1];
        } else {
            let limit = '1';
        }
        */

        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'gif':
                giphy.search({
                    q: query,
                    rating: 'r',
                    limit: '1'
                }, function (err, res) {
                    console.log(query)
                    //console.log(limit)
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