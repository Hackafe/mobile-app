angular.module('starter.services', [])

.factory('Topic', function($http){
  return {
    latest: function(){
      return $http.get('http://frm.hackafe.org/latest.json');
    },
    top: function(){
      return $http.get('http://frm.hackafe.org/top.json');
    },
    get: function(id){
      return $http.get('http://frm.hackafe.org/t/'+id+'.json');
    }
  };
})

.factory('Category', function($http, $q){

  var categories = function() {
    return $q(function(resolve, reject){
      $http.get('http://frm.hackafe.org/categories.json').then(function(response){
        console.log('categories response', response);
        var cats = [];
        response.data.category_list.categories.forEach(function(cat){
          cats[cat.id] = cat;
        });
        resolve(cats);
      }, reject);
    });
  };

  return {
    get: function(id){
      console.log('id', id);
      return $q(function(resolve, reject){
        categories().then(function(cats){
          console.log('cats', cats);
          resolve(cats[id]);
        }, reject);
      });
    }
  };
})

.factory('PushNotifications', function($q, $rootScope, $ionicPlatform, $cordovaPush, GCM_PROJECT_ID) {

  var register = function() {
    var ready = $q.defer();
    var config = null;

    console.log('registering for push notifications');

    if (ionic.Platform.isAndroid()) {
      config = {
        "senderID": GCM_PROJECT_ID
      }
    } else if (ionic.Platform.isIOS()) {
      config = {
        "badge": "true",
        "sound": "true",
        "alert": "true"
      }
    }


    console.log('waiting for device ready');
    $ionicPlatform.ready(function(){
      console.log('device ready, registering with '+JSON.stringify(config), config);
      ready.notify('device ready, registering with '+JSON.stringify(config), config);
      $cordovaPush.register(config).then(function(result) {
        console.log("Register success " + result);
        ready.notify('register success: '+JSON.stringify(result), result);

        // ** NOTE: Android regid result comes back in the notificationReceived, only iOS returned here
        if (ionic.Platform.isIOS()) {
          storeDeviceToken("ios", result);
        }
      }, function (err) {
        console.log("Register error " + err)
        ready.reject(err);
      });
    });


    // Notification Received
    if (ionic.Platform.isAndroid()) {
      var unregister = $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        unregister();
        console.log('notificationReceived: ', notification);
        ready.notify('notification received: '+JSON.stringify(notification), notification);

        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
          storeDeviceToken("android", notification.regid);
        } else if (notification.event == "error") {
          console.log("Push notification error event", notification);
          ready.reject(notification);
        } else {
          console.log("Push notification handler - Unprocessed Event", notification);
          ready.reject(notification);
        }
      });
    }

    // Stores the device token in a db using node-pushserver (running locally in this case)
    //
    // type:  Platform type (ios, android etc)
    function storeDeviceToken(type, token) {
      var data = {type:type, token:token};
      console.log('broadcasting', data);
      $rootScope.$broadcast('PushNotifications:registered', data);
      ready.resolve(data);
    }

    return ready.promise;
  }

  return {
    register: register
  }

})

;
