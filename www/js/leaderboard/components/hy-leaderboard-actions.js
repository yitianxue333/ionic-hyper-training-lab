/**
 * Leaderboard Actions
 * @description this directive carry out the actions on leaderboard
 * @author Kanchana Yapa
 * @since 01/03/16
 */
angular.module('hyper.leaderboard').directive('hyLeaderboardActions', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/leaderboard/components/hy-leaderboard-actions.html',
    controller: function ($scope, $ionicScrollDelegate) {
        $scope.showPoints = false;
        $scope.showJump = false;

        $scope.jumpToTop = function() {
          $scope.board.query = {
             type : $scope.board.query.type,
             period: "all-time",
             pointsType: "all",
             offset: 0,
             length: 11
          }

          $ionicScrollDelegate.scrollTop();
          $scope.showJump = false;
        };

        $scope.jumpToMyRank = function() {
          $scope.board.query = {
             type : $scope.board.query.type,
             period: "all-time",
             pointsType: "all",
             offset: null,
             length: 11
          }
          $ionicScrollDelegate.scrollTop();
          $scope.showJump = false;
        };

        $scope.setPointsType = function(type) {
          $scope.board.query = {
             type : $scope.board.query.type,
             period: "all-time",
             pointsType: type,
             offset: 0,
             length: 11
          }

          $ionicScrollDelegate.scrollTop();
          $scope.showPoints = false;
        };

        $scope.setType = function (type) {
          $scope.leaders = [];
          $scope.board.query = {
             type : type,
             period: "all-time",
             pointsType: 'all',
             offset: 0,
             length: 11
          };
        }
    }
  }
});
