/**
 *  routes.js
 *  Parse request URL and delegate actions to respective services
 */
var routes = function (app, task) {
    app.route('/')
        .get(function (req, res, next) {
            //fay: res.render("index", {title: "Hello World"});
            res.render("index.html");
        });

    app.route('/task')
        .post(function(req, res, next){
            task.save(req.body, function(err, result){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(201).send(result);
            });
        })
        .get(function(req, res, next){
            var pathParams = parseQueryParams(req.url);
            console.log("----- routes @ get pathParams = " + JSON.stringify(pathParams));
            task.search(pathParams, function(err, result){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(result.length>0 ? 200 : 404).send(result);
            });
        });

    app.route("/task/:id")
        .get(function(req, res, next){
            task.getById(req.params.id, function(err, result){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(result ? 200 : 404).send(result);
            });
        })
        .patch(function(req, res, next){
            task.updateById(req.params.id, req.body, function(err, result){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(result===1 ? 204 : 500).send();
            });
        })
        .delete(function(req, res, next){
            task.removeById(req.params.id, function(err, result){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(result===1 ? 204 : 500).send();
            });
        });

    app.route("/task/:id/completed")
        .put(function(req, res, next){
            var queryParams = parseQueryParams(req.url);
            task.updateCompleted(req.params.id, true, queryParams.ph, function(err, updatedTask){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(200).send(updatedTask);
            });
        });

    app.route("/task/:id/reset")
        .put(function(req, res, next){
            var queryParams = parseQueryParams(req.url);
            task.updateCompleted(req.params.id, false, queryParams.ph, function(err, updatedTask){
                if (err) {
                    res.status(500).send({error: err});
                }
                res.status(200).send(updatedTask);
            });
        });

    function parseQueryParams (url) {
        var result = {},
            parsed = require("url").parse(url, true).query;
        if (parsed.title) {
            result.title = {$regex: parsed.title};
        }
        if (parsed.body) {
            result.body = {$regex: parsed.body};
        }
        if (parsed.ph) {
            result.ph = parsed.ph;
        }
        return result;
    }
};

module.exports = routes;
