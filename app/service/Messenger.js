/**
 * Messenger.js
 * A messenger agent
 */

var twilio = require("twilio"),
    configs = require("../configs");

var Messenger = function() {
    this.agent = twilio(configs.twilio.accountSID, configs.twilio.authToken);
};

Messenger.prototype.sendIM = function (toPhone, mesg, cb) {
    var payload = {
        to: toPhone,
        from: configs.twilio.from_phone,
        body: mesg
    };
    this.agent.sendMessage(payload, cb);
};

module.exports = Messenger;
