/**
 *  Task.js
 *  Task object persistency and business operations
 */
var mongoskin = require("mongoskin"),
    ObjectID = require("mongoskin").ObjectID,
    events = require("events"),
    util = require("util");

/*
 * constructor
 */
var Task = function (app) {
    events.EventEmitter.call(this);
	this.db = mongoskin.db("mongodb://" + app.get("dbURL"));
	this.db.bind("task");
    console.log("Established monogodb://" + app.get("dbURL"));
};

util.inherits(Task, events.EventEmitter); //Task is a subclass of EventEmitter

Task.prototype.save = function (obj, cb) {
    this.db.task.insert(obj, cb);
};

Task.prototype.search = function (criteria, cb) {
    this.db.task.find(criteria, {limit:100, sort: [['_id',-1]]}).toArray(cb);
};

Task.prototype.getById = function (id, cb) {
    this.db.task.findById(id, cb);
};

Task.prototype.updateCompleted = function (id, isCompleted, phone2IM, cb) {
    var thisTask = this;
    this.db.task.findAndModify(
        {_id: ObjectID(id)},
        {priority: -1},
        {$set: {done: isCompleted}},
        {new: true},
        function (err, result) {
            if (err) {
                cb(err);
            } else {
                if (isCompleted) {
                    thisTask.emit("task:completed",
                        {mesg: "Your task '" + result.title + "' has been marked as done.",
                         phone2IM: phone2IM});
                }
                cb(null, result);
            }
        }
    );
};

Task.prototype.updateById = function (id, contents, cb) {
    var thisTask = this;
    function isTaskCompleted(contents) {
        //a task is considered completed if it has a title and done is true
        return contents.title  && contents.done === true;
    }
    this.db.task.updateById(id, {$set:contents}, {safe:true, multi:false}, function(err, results){
        if (isTaskCompleted(contents)) {
            thisTask.emit("task:completed", contents.title);  //emit a custom event
        }
        cb(err, results);
    });
};

Task.prototype.removeById = function (id, cb) {
    this.db.task.removeById(id, cb);
};

Task.prototype.close = function () {
    this.db.close();
};

module.exports = Task;
