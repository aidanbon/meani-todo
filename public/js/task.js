/**
 * task.js
 */
angular.module('todoApp', ['ionic'])
/*
 * The TaskFactory factory handles data persistence
 * and synchronization to the server.
 */
.factory('TaskFactory', function($http) {
  var baseUrl = "/task/";
  return {
    //fetch all tasks from server
    all: function() {
      return $http.get(baseUrl);
    },

    //pesist new task to server
    save: function(task) {
      return $http.post(baseUrl, task);
    },

    //persist done state changes
    toggleCompleted: function(taskB4, phone2IM) {
      var url = baseUrl + taskB4._id + "/" + (taskB4.done ? "reset" : "completed");
      if (phone2IM) {
        url += "?ph=" + phone2IM;
      }
      console.log("sending toggleCompleted [%s] URL = %s", taskB4.title, url);
      return $http.put(url);
    },

    // remove a task
    del: function(task) {
      var url = baseUrl + task._id
      console.log("sending delete [%s] URL = %s", task.title, url);
      return $http.delete(url);
    }
  }
})

/**
 * The TaskController handles user operations
 */
.controller('TaskController', function($scope, $timeout, Modal, TaskFactory) {

  // -------- handy util functions -----------
  var handleNetError = function(errCode, mesg) {
    var message = mesg || "Network error detected";
    alert(message + ": " + errCode);
  };

  // Load projects
  var fetchTasks = function () {
	  TaskFactory.all()
	    .success(function(data, status, headers, config){
	      $scope.tasks = data;
	    })
	    .error(function(data, status, headers, config){
	      if (status === 404) {
	        $scope.tasks = [];
	      } else {
	        handleNetError(status);
	      }
	    });
  };

  // ------- init --------
  fetchTasks();
  $scope.taskPhone = window.localStorage["task-phone"] || "";

  // Create our modal
  Modal.fromTemplateUrl('new-task-form.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  // ------- user operations --------
  /*
   * refresh all tasks
   */
  $scope.refreshTask = function (tastFilter) {
    $scope.taskFilter = ""; //reset filter
    fetchTasks();
  };

  /*
   * create a new task
   */
  $scope.createTask = function (task) {
    if (!task || !task.title.trim()) {
      alert("Please enter your task information.");
      return;
    }
    var newTask = {
      title: task.title,
      body: task.body,
      done: false
    };
    TaskFactory.save(newTask)
      .success(function(data, status, headers, config){
        if (data[0]._id) { //ensure a key is included in the return obj
          $scope.tasks.unshift(data[0]);
        }
        $scope.taskModal.hide();
      })
      .error(function(data, status, headers, config){
        handleNetError(status);
        $scope.taskModal.hide();
      });
    //reset form fields
    task.title = "";
    task.body = "";
  }; //createTask

  /*
   * set/unset a task as completed
   * @param {Object} taskB4 - The before-toggle task 
   */
  $scope.toggleTaskCompleted = function (taskB4) {
    var phone2IM = window.localStorage["task-phone"]; 
    TaskFactory.toggleCompleted(taskB4, phone2IM)
      .error(function(data, status, headers, config){
        taskB4.done = !taskB4.done; //undo model changes 
        handleNetError(status);
      });
  };

  /*
   * remove a task
   */
  $scope.deleteTask = function (task, index) {
    TaskFactory.del(task)
      .success(function(data, status, headers, config){
        $scope.tasks.splice(index, 1);
      })
      .error(function(data, status, headers, config){
        handleNetError(status, "We are sorry, there is an error deleting your task");
      });
  };

  /*
   * Save the phone number to local storage
   */
  $scope.addTaskPhone = function (taskPhone) {
    var ph = taskPhone && taskPhone.trim();
    if (!ph) {
      alert("Phone number cleared. No IM will be sent.");
      window.localStorage["task-phone"] = "";
    } else {
      if (ph.length != 10) {
        alert("Please enter a 10-digit phone number.");
      } else {
        window.localStorage["task-phone"] = ph;
        alert(ph + " added");
      }
    }
  };

  $scope.showNewTaskForm = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTaskForm = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleSideMenu = function() {
    $scope.sideMenuController.toggleLeft();
  };
});
