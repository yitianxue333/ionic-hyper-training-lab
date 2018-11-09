/**
 * Hyper List
 * @description
 * @author Kanchana Yapa
 * @since 06/01/16
 */
angular.module('hyper.core').directive('hyAutoList', function(_) {
  return {
    restrict: 'A',
    scope: {
      optionList: '=',
      selectedItem: '=',
      idField: '@',
      textField: '@',
      label: '@',
      selectedSet: '='
    },
    link: function($scope, element, attrs) {
      $scope.required = attrs.required;
      attrs.$set("readonly", "readonly");
      angular.element(element).addClass('hy-auto-list-input')
      element.on("click", function() {
        $scope.openList();
      })
    },
    controller: function ($scope, $ionicModal, $ionicScrollDelegate, $timeout) {
      $scope.rowHeight = 44;
      var parentScrollPosition = 0;
      var delegate = $ionicScrollDelegate.$getByHandle('scrollHandle');


      $scope.setItem = function(selectedItem) {
        $scope.selectedItem = (angular.equals($scope.selectedItem, selectedItem) && !$scope.required) ? null : selectedItem;
        $scope.closeModal();
      };

      $scope.openList = function() {
        $scope.isObjectList = angular.isObject($scope.optionList[0]);
        $ionicModal.fromTemplateUrl("views/core/components/hy-auto-list.html", {
          scope: $scope,
          animation: 'slide-in-up',
          focusFirstInput: true
        }).then(function(modal) {
          $scope.autoListModal = modal;
          $scope.autoListModal.show();
          parentScrollPosition = delegate.getScrollPosition();

          if (window.StatusBar)
            StatusBar.styleBlackTranslucent();
            
        });
      };

      $scope.$on('modal.shown', function() {
        if($scope.selectedItem) {
          var index = 0;
          if($scope.isObjectList) {
            var fieldValue = {};
            fieldValue[$scope.idField] = $scope.selectedItem[$scope.idField];
            index = _.findIndex($scope.optionList, fieldValue);
          } else {
            index = _.indexOf($scope.optionList, $scope.selectedItem);
          }
          optionList = null;

          if (window.StatusBar)
            StatusBar.styleBlackTranslucent();
            
          $ionicScrollDelegate.$getByHandle('autoListScroll').scrollTo(0, (index * $scope.rowHeight), true);
        }
      });

      $scope.$on('modal.hidden', function() {
        if (window.StatusBar)StatusBar.styleDefault();
      });

      $scope.$on('modal.removed', function() {
        if (window.StatusBar)StatusBar.styleDefault();
      });

      $scope.changed = function() {
        $ionicScrollDelegate.$getByHandle('autoListScroll').scrollTop();
      };

      $scope.closeModal = function() {
        $scope.autoListModal.remove();
        $timeout(function() {
          delegate.scrollTo(parentScrollPosition.left, parentScrollPosition.top);
        }, 100);

      };
    }
  }
});
