// Load tools library
let tools = require(__basedir + 'lib/tools');

// Search master fct
exports.run = function(bot, message, config) {
    tools.debug('debug', 'module search run');

    bot.createConversation(message, function (err, convo) {

        // create a path for when a user says YES
        convo.addMessage({
            text: 'You said yes! How wonderful.',
        }, 'yes_thread');

        // create a path for when a user says NO
        convo.addMessage({
            text: 'You said no, that is too bad.',
        }, 'no_thread');

        // create a path where neither option was matched
        // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
        convo.addMessage({
            text: 'Sorry I did not understand.',
            action: 'default',
        }, 'bad_response');

        // Create a yes/no question in the default thread...
        convo.addQuestion('Do you like cheese?', [
            {
                pattern: 'yes',
                callback: function (response, convo) {
                    convo.gotoThread('yes_thread');
                },
            },
            {
                pattern: 'no',
                callback: function (response, convo) {
                    convo.gotoThread('no_thread');
                },
            },
            {
                default: true,
                callback: function (response, convo) {
                    convo.gotoThread('bad_response');
                },
            }
        ], {}, 'default');
        //convo.say({text: 'I waited 3 seconds to tell you this...', delay: 3000});

        convo.on('end',function(convo) {
            if (convo.status === 'completed') {
                // do something useful with the users responses
                let res = convo.extractResponses();

                // reference a specific response by key
                let value  = convo.extractResponse('key');

            // ... do more stuff...
            } else {
                // something happened that caused the conversation to stop prematurely
            }
        });

        convo.onTimeout(function(convo) {
            convo.say('Oh no! The time limit has expired.');
            convo.next();
        });

        // now set the conversation in motion...
        convo.activate();
    });
};
