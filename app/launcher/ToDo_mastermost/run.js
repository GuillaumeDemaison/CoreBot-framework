// Configuration
let Botkit = require('botkit');

module.exports = function(config) {
  let controller = Botkit.web({
    debug: config.log.debug,
    studio_token: config.controller.on.botkit.token
  });

  let bot = controller.spawn({
    token: config.web.token
  }).startRTM();


  // Scenario declarations
  let scenario = require(__basedir + 'controller/loader.js');
  controller = scenario.run(controller);
  return controller;
};

