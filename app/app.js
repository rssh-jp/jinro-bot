'use strict';
var util = require('util');
var SlackBot = require('slackbots');
var async = require('async');

var global = {
    candidates : [],
    members : [],
};

var execMessage = function(bot, data){
    var params = {
        icon_emoji: ':cat:',
        name: 'testbot',
        //testbot : true,
    };
    var user = null;
    var command = null;
    var message = null;

    return Promise.resolve(
    ).then(function(val){
        // user情報の取得
        return bot.getUserById(data.user).then(function(val){
            user = val;
            console.log('user : ', user);
        });
    }).then(function(val){
        // commandの取得
        return new Promise(function(resolve, reject){
            var str = data.text;
            if(str == null || str == ''){
                reject('not found text');
                return;
            }
            console.log('str : ', str);
            var colonSplit = str.split(':');
            if(colonSplit.length < 2){
                reject('not enough arguments');
                return;
            }
            command = colonSplit[1];
            message = colonSplit[2];
            resolve();
        });
    }).then(function(val){
        // 実処理部
        return new Promise(function(resolve, reject){
            console.log('command : ', command);
            switch(command){
            case 'all':
                sendMessageAllUser(bot, message, params).then(
                    function(val){
                        resolve(val);
                    },
                    function(err){
                        reject(err);
                    }
                );
                break;
            default:
                resolve();
                break;
            }
        });
    })
    ;
};

var sendMessageAllUser = function(bot, message, params){
    var users = null;
    return bot.getUsers().then(function(val){
        console.log('val : ', val);
        users = val;
    }).then(function(val){
        return new Promise(function(resolve, reject){
            var task = [];
            for(var i=0; i<users.members.length; i++){
                var v = users.members[i];
                if(v.is_bot || v.updated == 0){
                    continue;
                }
                if(v.name != 'rssh'){
                    continue;
                }
                task.push(bot.postMessageToUser(v.name, message, params));
            }
            Promise.all(task).then(
                function(v){
                    resolve(v);
                },
                function(err){
                    reject(err)
                }
            );
        });
    })
    ;
};
var sendMessage = function(bot, from, to, message){
    bot.name = from;

};

var main = function(){
    
    // create a bot
    var bot = new SlackBot({
        token: 'xoxb-109978401488-Kr0Ve1192ZIwY6bZC6xFsofx', // Add a bot https://my.slack.com/services/new/bot and put the token 
        name: 'アイウソン翔',
    });
    
    bot.on('start', function() {
        bot.on('message', function(data){
            console.log('data : ', data);
            switch(data.type){
            case 'message':
                console.log('++++++++++++++++++++++++');
                execMessage(bot, data).then(
                    function(val){
                        console.log('-------------------------');
                    },
                    function(err){
                        console.log('err : ', err);
                    }
                );
                break;
            default:
                break;
            }
        });
        //// more information about additional params https://api.slack.com/methods/chat.postMessage
        //var params = {
        //    icon_emoji: ':cat:'
        //};
        //
        //// define channel, where bot exist. You can adjust it there https://my.slack.com/services 
        //bot.postMessageToChannel('general', 'meow!', params);
        //
        //// define existing username instead of 'user_name'
        //bot.postMessageToUser('tn', 'meow!', params); 
        //
        //// If you add a 'slackbot' property, 
        //// you will post to another user's slackbot channel instead of a direct message
        //bot.postMessageToUser('rssh', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' }); 
        //
        //// define private group instead of 'private_group', where bot exist
        //bot.postMessageToGroup('test-bot', 'meow!', params); 
    });
};
main();
