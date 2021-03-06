// Load tools library
var Log = require(__basedir + 'lib/log');

// Configuration
var Botkit = require('botkit');

// Controller
module.exports = function(config) {
  Log.debug('launcher hangouts run');

  process.env.GOOGLE_APPLICATION_CREDENTIALS = __basedir + config.launcher.hangouts.jsonCred;

  var controller = Botkit.googlehangoutsbot({
    endpoint: config.launcher.hangouts.endpoint,
    token: config.launcher.hangouts.token,
    debug: config.log.debug,
    studio_token: config.controller.on.botkit.token,
    json_file_store: __basedir + config.launcher.hangouts.store
  });

  var bot = controller.spawn({});

  controller.setupWebserver(config.launcher.hangouts.port || 3002, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
      Log.info('launcher hangouts run ok');
    });
  });

  // Scenario declarations
  controller = require(__basedir + 'lib/controller.js')(controller, config, ['hears','on']);

  return controller;
};

