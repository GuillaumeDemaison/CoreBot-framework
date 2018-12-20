// Load tools library
let tools = require(__basedir + 'lib/tools');

// Load required lib
let _ = require("underscore");

// AutoReply loader
exports.run = function(bot, message, config){
    tools.debug('debug', 'module help run');

    let found = '';
    let to_say = '';
    let msg_arr = message.text.split(' ');

    let all = msg_arr.indexOf('all');
    let detail = msg_arr.indexOf('detail');

    // Reject if not Help command
    if (!/^help/i.test(message.text)) {
        tools.debug("info", 'module help run stop_no_command');
    }

    // Reject bot message
    else if (message.user === config.user) {
        tools.debug("info", 'module help run stop_bot_reply');
    }
    // If help summary is requested
    else if (msg_arr.length === 1){
        _.each(config.module, function (conf, index) {
            if (config.module[index].enable === true)
                to_say += '- '+index+' - '+config.module[index].msg.help[0] + '\n';
        });
    }
    // If all help are requested
    else if ((msg_arr.length > 1) && ((all >= 0) || (detail >=0))){
        _.each(config.module, function (conf, index) {
            if (detail < 0) {
                to_say += '- '  + index;
                if (all >= 0) to_say += ' - state:_' + config.module[index].enable + '_';
                to_say += ' - ' + config.module[index].msg.help[0] + '\n';
            }
            else if (detail >= 0) {
                to_say += '# '+index+'\n';
                to_say += 'State: _'+ config.module[index].enable + '_\n\n';
                to_say += config.module[index].msg.help.join('\n\n') + '\n\n';
            }
        });
    }
    // Help of a module is requested (it includes detail)
    else if ((msg_arr.length > 1) && (all >= 0)) {
        let res = _.each(config.module, function (conf, index) {
            if (msg_arr.indexOf(index) >= 0) found = index;
        });
        if (found !== '')
            to_say = config.module[found].msg.help.join('\n');
        else
            to_say = config.module.help.msg.nomodule;
    }

    if (to_say) bot.reply(message, to_say);
};
