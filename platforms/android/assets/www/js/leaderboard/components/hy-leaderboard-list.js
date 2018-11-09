/**
 * Leaderboard List
 * @description this directive display the list of leaders
 * @author Kanchana Yapa
 * @since 18/02/16
 */
angular.module('hyper.leaderboard').directive('hyLeaderboardList', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/leaderboard/components/hy-leaderboard-list.html',
    controller: function ($scope, User) {
      $scope.user = User.getUser();

      $scope.hasRequiredInfo = function() {
        return ($scope.user.user_info.display_name && $scope.user.user_info.first_name);
      };
    }
  }
});
