/**
 * Keep Track of the scope on leaderboard
 * @description The leaderboard Controller
 * @author Kanchana Yapa
 * @since 16/02/16
 */
angular.module('hyper.leaderboard').controller('LeaderboardController', function($scope, User, Activity) {

  $scope.board = {};
  $scope.state = { total : 0 };
  $scope.board = {
    query : {
      type: "world",
      period: "all-time",
      pointsType: "all",
      offset: 0,
      length: 11
    }
  };

  $scope.data = { leaders : [] };

  $scope.$watchCollection('board.query', function(newValue, oldValue) {
      if($scope.board.query.type == "region") {
        $scope.data.leaders =[];
        return;
      }

      Activity.getLeaderboard($scope.board.query).then(function success(response) {
        if(response.status.result == "success") {
          $scope.state = response.status;
          if(newValue.offset > 0) {
            $scope.data.leaders = $scope.data.leaders.concat(response.payload);
          } else {
            $scope.data.leaders = response.payload;
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
  });

  $scope.hasRemaining = function() {
    var current = 0;
    if($scope.data.leaders.length > 0) {
      current = $scope.data.leaders[$scope.data.leaders.length-1].rank;
    }
    return ($scope.state.total > current);
  };

  $scope.loadMore = function() {
    console.log("Loading more");
    if($scope.data.leaders.length > 0) {
      var lastItem = $scope.data.leaders[$scope.data.leaders.length - 1];
      $scope.board.query.offset = lastItem.rank;
    }
  };
});
