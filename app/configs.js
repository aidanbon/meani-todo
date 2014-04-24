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
        remote: "fay:fay@oceanic.mongohq.com:10013/mydb",
        local: "localhost:27017/test"
    },

    //Twilio setting
    twilio: {
        accountSID: "ACd45d8b0a062735647addeac513aa16a2",
        authToken: "abcc7b3f2fd4989befdd19ea7a1f3bcd",
        from_phone: "+15107687148",
        to_phone: "+14152443235"  //default delivery phone numbert
    }
};
