/**
 * Hyper Stats
 * @description This components will show all user stats on the dashbord section
 * @author Samuel Castro
 * @since 12/15/15
 */
angular.module('hyper.dashboard').directive('hyStats', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/dashboard/components/hy-stats.html',
    controller: function ($rootScope, $scope, $state, $stateParams, User) {
      $scope.stats = User.getStats();

      /**
       * User stats has been updated, so lets update the current stats object.
       */
      $rootScope.$on('onUpdateStats', function(event, stats) {
        $scope.stats = stats;
      });

    }
  }
});
