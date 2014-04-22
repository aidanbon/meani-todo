/**
 *  index.js 
 *  The app server.
 */

var express = require("express"),
    configs = require("./configs"),
    configEnv = require("./environment"),
    configRoutes = require("./routes"),
    Task = require("./model/Task"),
    Messenger = require("./service/Messenger"),
    task, messenger, app;

app = express();

configEnv(app);
task = new Task(app);
messenger = new Messenger();
configRoutes(app, task);

task.on("task:completed", function(obj) {
    //trigger twilio
    var toPhone = obj.phone2IM || configs.twilio.to_phone;
    messenger.sendIM(toPhone, obj.mesg, function(err, res) {
        if (err) {
            console.log("Messenger sendIM error to %s: %s", toPhone, JSON.stringify(err));
        } else {
            console.log("Messenger sendIM successful to " + toPhone);
        }
    });
});

module.exports = app;
