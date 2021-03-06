// Load tools library
var Log = require(__basedir + 'lib/log');

// Configuration
var Botkit = require('botkit');

// Launcher
module.exports = function(config) {
  Log.debug('launcher slack run');

  // Bot initialisation
  var controller = Botkit.slackbot({
    debug: config.log.debug,
    studio_token: config.controller.on.botkit.token,
    json_file_store: __basedir + config.launcher.slack.store,
    clientSigningSecret: __basedir + config.launcher.slack.secret
  });

  var bot = controller.spawn({
    token: config.launcher.slack.token
  }).startRTM();

  Log.info('launcher slack run ok');

  // Scenario declarations
  controller = require(__basedir + 'lib/controller.js')(controller, config, ['hears','on']);

  return controller;
};

