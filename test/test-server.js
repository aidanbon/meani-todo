var superagent = require("superagent"),
    expect = require("expect");

describe("express rest api server", function(){
    var id,
        title = "Title - " + new Date();
        baseURL = "http://localhost:9999/task/";

    it("add a new task", function(done){
        superagent.post(baseURL)
            .send({
                title: title,
                body:  "task 1 body",
                done:  false
            })
            .end(function(e,res){
                expect(e).toBe(null);
                expect(res.status).toBe(201);
                console.log(res.body);
                expect(res.body.length).toBe(1);
                expect(res.body[0]._id.length).toBe(24);
                id = res.body[0]._id;
                done();
            });
    });

    it("retrieves a task by ID", function(done){
        superagent.get(baseURL + id)
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe("object");
                expect(res.body._id.length).toBe(24);
                expect(res.body._id).toBe(id);
                expect(res.body.title).toBe(title);
                done();
            });
    });

    it("retrieves all tasks", function(done){
        superagent.get(baseURL)
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(200);
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body.map(function (item){return item._id;})).toInclude(id);
                console.log("--- # wildcard search: " + res.body.length);
                done();
            });
    });

    it("searches for tasks", function(done){
        superagent.get(baseURL + '?title=Title&body=body')
            .end(function(e, res){
                expect(e).toBe(null);
                console.log("--- # criteria search: " + res.body.length);
                expect(res.status).toBe(200);
                done();
            });
    });

    it("changes the body of the task", function(done){
        superagent.patch(baseURL + id)
            .send({
                title: title,
                body : "updated body"
            })
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(204);
                expect(typeof res.body).toBe("object");
                console.log("post-patch res.body = %s res.status = %d", JSON.stringify(res.body), res.status);
                done();
            });
    });

    it("checks the updated task", function(done){
        superagent.get(baseURL + id)
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe("object");
                expect(res.body._id.length).toBe(24);
                expect(res.body._id).toBe(id);
                expect(res.body.title).toBe(title); //title shouldn't be updated
                expect(res.body.done).toBe(false);
                expect(res.body.body).toBe("updated body");
                done();
            });
    });

    it("marks a task as completed", function(done){
        superagent.put(baseURL + id + "/completed")
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe("object");
                expect(res.body.done).toBe(true);
                console.log("post-completed res.body = %s res.status = %d", JSON.stringify(res.body), res.status);
                done();
            });
    });

    it("marks a task as not completed", function(done){
        superagent.put(baseURL + id + "/reset")
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe("object");
                expect(res.body.done).toBe(false);
                console.log("post-reset res.body = %s res.status = %d", JSON.stringify(res.body), res.status);
                done();
            });
    });

    it("removes a task", function(done){
        superagent.del(baseURL + id)
            .end(function(e, res){
                expect(e).toBe(null);
                expect(res.status).toBe(204);
                expect(typeof res.body).toBe("object");
                console.log("post-DELETE: res.status= %d res.body=%s", res.status, JSON.stringify(res.body));
                done();
            });
    });

    it("checks a removed task", function(done){
        superagent.get(baseURL + id)
            .end(function(e, res){
                expect(e).toBe(null);
                expect(typeof res.body).toBe("object");
                console.log("post-DELETE-GET: res.status= %d res.body=%s", res.status, JSON.stringify(res.body));
                console.log("post-delete-GET res.headers - " + JSON.stringify(res.headers));
                done();
            });
    });

});
