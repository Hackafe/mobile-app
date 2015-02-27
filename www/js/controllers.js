angular.module('starter.controllers', ['starter.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, PushNotifications) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('TopicsCtrl', function($scope, Topic, $http) {
  $scope.topics = [];
  $scope.more_topics_url = '/latest.json';

  $scope.loadMore = function() {
    console.log('requesting more data', $scope.more_topics_url);
    $http.get('http://frm.hackafe.org'+$scope.more_topics_url).then(function(response) {
      console.log('topics', response);
      var topic_list = response.data.topic_list;
      $scope.topics = [].concat($scope.topics, topic_list.topics);
      $scope.more_topics_url = topic_list.more_topics_url;

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
})

.controller('TopicCtrl', function($scope, $stateParams, Topic) {
  console.log($stateParams);
  Topic.get($stateParams.topicId).then(function(topic){
    $scope.topic = topic.data;
    console.log('topic = ', topic);
  });
});
