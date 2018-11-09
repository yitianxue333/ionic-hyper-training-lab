/**
 * Hyper Slider
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.core').directive('hyTabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      scrollable: "="
    },
    controller: function($scope,  $ionicScrollDelegate) {
      var tabs = $scope.tabs = [];

      $scope.select = function(tab) {
        angular.forEach(tabs, function(tab) {
          tab.selected = false;
        });
        tab.selected = true;

        if($scope.scrollable) {
          $ionicScrollDelegate.scrollTop();
        }

        $scope.$emit('my-tabs-changed', tab);
      };

      this.addTab = function(tab) {
        if (tabs.length === 0) {
          $scope.select(tab);
        }

        tabs.push(tab);
      };
    },
    templateUrl: 'views/core/components/hy-tabs.html'
  };
})
