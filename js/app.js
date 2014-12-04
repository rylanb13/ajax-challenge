"use strict";

//this is the base URL for all task objects managed by your application
//requesting this with a GET will get all tasks objects
//sending a POST to this will insert a new task object
//sending a PUT to this URL + '/' + task.objectId will update an existing task
//sending a DELETE to this URL + '/' + task.objectId will delete an existing task

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        //Parse required two extra headers sent with every HTTP request: X-Parse-Application-Id, X-Parse-REST-API-Key
        //the first needs to be set to your application's ID value
        //the second needs to be set to your application's REST API key
        //both of these are generated by Parse when you create your application via their web site
        //the following lines will add these as default headers so that they are sent with every
        //HTTP request we make in this application
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'Gq72mdgH9BXnWwelLtoeICf79YSI7G2kS6fDMMLv';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '0pndi7f0w18TpkoGlr2fqYQ3f2E7DSsnp5W2nPZp';
    })
      .controller('CommentsController', function($scope, $http, $filter) {
        var commentsUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl)
                .success(function(data) {
                    $scope.comments =  $filter('orderBy')(data.results, 'score', true)
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {score: 0};

        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.refreshComments();
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        $scope.deleteComment = function(comment) {
            $scope.loading = true;
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function(data) {
                    $scope.refreshComments();
                    $scope.loading = false;
                })
                .error(function(err) {
                   console.log(err);
                })
        };

        $scope.incrementScore = function(comment, amount) {
            if (comment.score > 0 || amount > 0) {
                $http.put(commentsUrl + '/' + comment.objectId, {
                    score: {
                        __op: 'Increment',
                        amount: amount
                    }
                })
                    .success(function (data) {
                        comment.score = data.score;
                    })
                    .error(function (err) {
                        console.log(err);
                    })
            }
        };
    });