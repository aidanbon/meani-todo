/**
 * environment.js
 * Configure the app server environment
 */
var bodyParser = require("body-parser"),
    express = require("express"),
    stylus = require("stylus"),
    morgan = require("morgan"),
    nib = require("nib"),
    path = require('path'),
    configs = require("./configs");

module.exports = function (app) {
    var env = process.env.NODE_ENV || configs.default_env,
        port = process.env.PORT || configs.default_port,
        dbURL = env === "production" ? configs.mongoURL.remote : configs.mongoURL.local,
        publicDir = path.join(__dirname, "../public");

    app.set("env", env);
    app.set("port", port);
    if (env !== "production") {
        //enable console logging for non-production env
        app.use(morgan("dev"));
    }

    //backend setting
    app.set("dbURL", dbURL);
    app.use(bodyParser());

    //frontend setting
    function compileWithNib(str, path) {
        console.log("------ stylus compile: str: %s path: %s", str, path);
        return stylus(str)
            .set("filename", path)
            .use(nib());
    }
    app.set("views", publicDir);
    app.set("view engine", "jade");
    app.use(stylus.middleware({
        src: publicDir,
        compile: compileWithNib
        }));
    app.use(express.static(publicDir));
};
