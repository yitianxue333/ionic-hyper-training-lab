/**
 * Keep Track and calculations for all the points
 * @description The Points Controller
 * @author Kanchana Yapa
 * @since 12/18/15
 */
angular.module('hyper.recordPoints').controller('PointsController', function($scope, $rootScope, $q, $ionicPopup, Activity, User, Facebook) {

  $scope.data  = {
    activities: []
  };

  $scope.media = {
    activities: []
  };

  $scope.summary = {
    activities: [],
    train: 0,
    achieve: 0,
    inspire: 0,
    media: 0
  };

  $scope.onRecordsSave = function() {
    return Activity.save({ activities: $scope.summary.activities });
  };
                                                $scope.shareSuccess = function(){
                                                    alert("hferfgerf");
                                                }
                                                
        
});
