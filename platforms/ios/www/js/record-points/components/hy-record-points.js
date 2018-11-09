/**
 * Record Points
 * @description this components will show the user record points
 * @author Samuel Castro
 * @since 12/16/15
 */
angular.module('hyper.recordPoints').directive('hyRecordPoints', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/record-points/components/hy-record-points.html',
    controller: function ($scope, Activity, _) {

      /**
       * Getting all activities
       */
      $scope.promise =  Activity.get();
      $scope.promise.then(function(response) {
        if(response && response.status.result == "success") {
          if(response.payload && response.payload.activities) {
            $scope.data.activities = response.payload.activities;
            $scope.media.activities = _.findWhere($scope.activities, { type: 'media' });
          }

          if(response.payload && response.payload.stats) {
            $scope.stats = response.payload.stats;
          }
        }
      });

      /**
       * Watching activities
       */
      $scope.$watch('data.activities|filter:{ selected:true }', function (nv) {
        if(nv) {
          $scope.summary.train = 0;
          $scope.summary.achieve = 0;
          $scope.summary.inspire = 0;
          $scope.summary.media = 0;

          $scope.summary.activities = nv.map(function (activity) {
            switch (activity.type) {
             case 'train':  $scope.summary.train += activity.options && _.has(activity.selectedOption, 'points') ? activity.selectedOption.points : activity.points || 0; break;
             case 'achieve':  $scope.summary.achieve += activity.options &&_.has(activity.selectedOption, 'points') ? activity.selectedOption.points : activity.points || 0; break;
             case 'influence':  $scope.summary.inspire += activity.options && _.has(activity.selectedOption, 'points') ? activity.selectedOption.points : activity.points || 0; break;
             case 'media':  $scope.summary.media += activity.options && _.has(activity.selectedOption, 'points') ? activity.selectedOption.points : activity.points || 0; break;
            }

            return { id: activity.id, option: _.has(activity.selectedOption, 'points') ? activity.selectedOption.option : undefined , media : activity.media ? activity.media : undefined }
          });
        }
      }, true);
    }
  }
});
