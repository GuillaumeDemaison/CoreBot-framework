// Load tools library
let Log = require(__basedir + 'lib/log');

// Exports controller function as scenario
exports.cards = function(controller, bot, message, config) {
    bot.reply(message, config.controller.action.hello.msg.text);
};