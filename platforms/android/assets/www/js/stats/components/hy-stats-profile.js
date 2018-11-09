/**
 * Stats Profile
 * @description this components will show the users stats profile
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsProfile', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-profile.html',
    controller: function ($scope, User, Activity) {
      $scope.weeklyStats = [];
      $scope.monthlyStats = [];
      $scope.accountOptions = User.getAccountOptions();
      $scope.stats = User.getStats();
      $scope.currentUser = User.getUser();

      Activity.getCombinedStats().then(function(response) {
        if(response && response.status.result == "success") {
          $scope.weeklyStats = response.payload.week;
          $scope.monthlyStats = response.payload.month;
        }
      });
    }
  }
});
