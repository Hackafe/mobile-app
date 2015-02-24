angular.module('starter.directives', [])

.directive('discourseCategory', function(Category){
  return {
    restict: 'EC',
    scope: {
      categoryId: '='
    },
    templateUrl: "templates/category.html",
    link: function(scope, element) {
      scope.$watch('categoryId', function(catId){
        Category.get(catId).then(function(category){
          console.log('category', category);
          scope.category = category;
          scope.bgStyle = category?{'background-color': '#'+category.color}:{};
          scope.lblStyle = category?{'color': '#'+category.text_color}:{};
        });
      });
    }
  }
})

;
