/**
 * Badge Ranks
 * @description this components will show the users badge ranks
 * @author Kanchana Yapa
 * @since 15/02/16
 */
angular.module('hyper.badges').directive('hyBadgesRanks', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      badge: "=badge"
    },
    templateUrl: 'views/badges/components/hy-badges-ranks.html',
    controller: function ($scope, $ionicHistory, $state, User, Activity) {
      $scope.currentBadge = {};
      $scope.$watch("badge", function() {
        $scope.currentBadge = $scope.badge;
      });

      /*
      * Navigate to Record point
      */
      $scope.recodePoint = function() {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.recordPoints', { reload: true });
      }
    }
  }
});
