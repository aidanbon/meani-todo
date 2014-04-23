/**
 *  configs.js
 *  app-wise configuration parameters
 */
module.exports = {
    //default server port
    default_port: 9999,

    //default server mode. Possilbe values:
    //"development", "production", "test"
    default_env: "development",

    //MongoDB URL
    mongoURL: {
        remote: "localhost:27017/test", // replace with the remote DB, e.g. "foo:pw@xyz.mongohq.com:10013/mydb"
        local: "localhost:27017/test"
    },

    //Twilio setting (replace with your Twilio account value)
    twilio: {
        accountSID: "xxxx",
        authToken: "xxxx",
        from_phone: "xxxx",
        to_phone: "xxxx"
    }
};
