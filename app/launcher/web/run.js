// Load tools library
var Log = require(__basedir + 'lib/log');

// Configuration
var Botkit = require('botkit');

// Run the launcher
module.exports = function(config) {
  Log.debug('launcher web run');

  // Bot initialisation
  //var controller = Botkit.socketbot({
  var controller = Botkit.anywhere({
    debug: config.log.debug,
    log: config.log.file,
    json_file_store: __basedir + config.launcher.web.store,
    studio_token: config.controller.on.botkit.token,
    replyWithTyping: config.launcher.web.replyWithTyping || true,
    typingDelayFactor: config.launcher.web.typingDelayFactor || 1.2
  });

  // Set up an Express-powered webserver to expose oauth and webhook endpoints
  controller = require(__dirname + '/express_webserver.js')(controller, config);

  // Open the web socket server
  controller.openSocketServer(controller.httpserver);

  // Scenario declarations
  controller = require(__basedir + 'lib/controller.js')(controller, config, ['hears','on']);

  // Start the bot brain in motion!!
  controller.startTicking();

  return controller;
};
