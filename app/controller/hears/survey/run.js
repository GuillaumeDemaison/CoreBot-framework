// Load CoreBot libraries
let tools = require(__basedir + 'lib/tools');
let csv = require(__basedir + 'module/csv/run.js');

// Requirements
let fs = require('fs');

// Survey controller hears
module.exports = function(controller, config) {
    tools.debug('debug', 'controller hears survey run');

    if (config.controller.hears.survey.enable === true) {

        // Create new controller hears
        controller.hears('^survey', ['message_received', 'direct_message', 'direct_mention', 'group_message'], function (bot, message) {
            // Create new conversation
            bot.createConversation(message, function (err, convo) {
                // Get the CSV data
                tools.debug('debug', 'controller hears survey run get_csv_data ' + __basedir + config.controller.hears.survey.file);
                fs.readFile(__basedir + config.controller.hears.survey.file, function(err, data) {
                    if(err) {
                        tools.debug('error', 'controller hears survey run no-csv-file ');
                        return;
                    }
                    let i_line_arr = i_reply_arr = 0;
                    let line_arr = reply_arr = [];
                    let array = data.toString().split("\n");

                    // Parse all CSV lines to generate one conversation by question
                    for(i_line_arr = 0; i_line_arr < array.length - 1; i_line_arr++) {
                        let line_arr = array[i_line_arr].split(';');
                        let question = line_arr[0] +'\n';
                        let pattern = '\w';

                        tools.debug('debug', 'controller hears survey run ' + line_arr);

                        // Add each expected replies identified by digit in the question message
                        if (line_arr.length > 1) {
                            pattern = '[0-9]';
                            let reply_arr = line_arr[1].split(',');
                            for (i_reply_arr = 0; i_reply_arr < reply_arr.length; i_reply_arr++)
                                question += '- ' + (i_reply_arr+1) + ' - ' + reply_arr[i_reply_arr] + '\n';
                        }

                        tools.debug('debug', 'controller hears survey run ' + question);

                        // Add Message for accepted replies
                        convo.addMessage({
                            text: config.controller.hears.survey.msg.reply_ok,
                        }, 'reply');

                        // Add Message for bad reply
                        convo.addMessage({
                            text: config.controller.hears.survey.msg.bad_reply,
                            action: 'default_' + i_line_arr,
                        }, 'bad_reply');

                        // Add Question
                        convo.addQuestion(question, [
                            {
                                pattern: pattern,
                                callback: function (response, convo) {
                                    convo.gotoThread('reply');
                                }
                            },
                            {
                                default: true,
                                callback: function (response, convo) {
                                    convo.gotoThread('bad_reply');
                                }
                            }
                        ], {}, 'default');

                        // Add ending handler
                        convo.on('end', function (convo) {
                            if (convo.status === 'completed') {
                                // do something useful with the users responses
                                let res = convo.extractResponses();

                                // reference a specific response by key
                                let value = convo.extractResponse(pattern);

                                // ... do more stuff...
                                convo.say({text: config.controller.hears.survey.msg.end});
                            } else {
                                // something happened that caused the conversation to stop prematurely
                            }
                        });

                        // Manage timeout
                        convo.onTimeout(function (convo) {
                            convo.say(config.controller.hears.survey.msg.timeout);
                            convo.next();
                        });

                        // now set the conversation in motion...
                        convo.activate();
                    }
                });
            });
        });
    }
    return controller;
};
