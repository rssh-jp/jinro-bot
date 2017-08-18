'use strict';
var Global = require('global');
var SlackBot = require('slackbots');

//var global = {
//    candidates : [],
//    members : [],
//};

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
                console.log('v:  ', v);
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
    let g = Global.getInstance();
    g.createBot('xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxx');

    let humanBot = g.getHumanBot();
    let wolfBot = g.getWolfBot();
    humanBot.on('start', function() {
        humanBot.on('message', function(data){
            console.log('data : ', data);
            switch(data.type){
            case 'message':
                console.log('++++++++++++++++++++++++');
                execMessage(humanBot, data).then(
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
    });
    wolfBot.on('start', function() {
        wolfBot.on('message', function(data){
            console.log('data : ', data);
            switch(data.type){
            case 'message':
                console.log('++++++++++++++++++++++++');
                execMessage(wolfBot, data).then(
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
    });
};
main();
