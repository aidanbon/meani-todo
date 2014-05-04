/**
 * Gulpfile.js
 * Task runner with live reload at development mode
 */
var gulp = require("gulp"),
    liveReload = require("tiny-lr")(),
    app = require("./app");
 
var LIVERELOADPORT = 35729;


gulp.task("startServer", function () {
  app.listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
  });
});

gulp.task("startLiveReload", function () {
  if (app.get("env") !== "development") {
    console.log("Skip live reload for non-dev env");
    return;
  }
  liveReload.listen(LIVERELOADPORT);
});

gulp.task("watchForLiveReload", function () {
  if (app.get("env") !== "development") {
    console.log("Skip live reload for non-dev env");
    return;
  }
	function trigger (watchedEvent) {
	  // `gulp.watch()` events provide an absolute path
	  // so we need to make it relative to the server root
	  var fileName = require('path').relative(__dirname, watchedEvent.path);
    console.log("--- changed --- " + watchedEvent.path + " " + fileName);
	  liveReload.changed({
	    body: {
	      files: [fileName]
	    }
	  });
	}
  gulp.watch("public/index.jade", trigger);
  gulp.watch("public/js/task.js", trigger);
  gulp.watch("public/css/task.styl", trigger);
});

gulp.task("default", ["startLiveReload", "startServer", "watchForLiveReload"]);
