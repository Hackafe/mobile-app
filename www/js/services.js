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

;
