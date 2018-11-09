/**
 * Record Points Items
 * @description this component will show the record points available items
 * @author Samuel Castro
 * @since 12/18/15
 */
angular.module('hyper.recordPoints').directive('hyRecordPointsItems', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      filter: '@',
      activities: '=',
      promise: '='
    },
    templateUrl: 'views/record-points/components/hy-record-points-items.html',
    controller: function ($scope, $ionicPopup, $ionicModal) {

      var practicePopup = {};
      $scope.show = true;

      /**
       * Making sure that the XHR call has been finished
       */
      $scope.promise.then(function(response) {
        if(response && response.status.result == "success") {
          $scope.show = _.findWhere(response.payload.activities, { type: $scope.filter });
          $scope.doneLoading = true;
        }
      });

      $scope.checkType = function(activity) {
        return activity.type == $scope.filter;
      };

      /**
       * Opening popup
       */
      $scope.displayOptions = function(activity, selected) {
        selected = !selected;
        
        if(activity.options && selected) {

          activity.selectedOption = {};

          $scope.activity = activity;


          /**
           * Initialize Share option modal
           */
          $ionicModal.fromTemplateUrl('views/record-points/components/hy-record-points-options.html', {
            scope: $scope,
            animation: 'slide-in-up',
            width: '90%',
            height: '90%'
          }).then(function(modal) {
            $scope.practicePopup = modal;
            $scope.practicePopup.show();
          });

        } else {
            activity.selected = selected;
        }
      };

      /**
       * Close popup
       */
      $scope.close = function(data) {
        if(data && data.activity) {
          $scope.activities.forEach(function(activity) {
              if(data.activity.id == activity.id) {
                if(data && data.activity && data.selected) {
                  activity.selectedOption = data.selected;
                  activity.selected = true;
                } else {
                  activity.selected = false;
                }
              }
            }
          );
        }

        $scope.practicePopup.hide();
        $scope.practicePopup.remove();
      };
    }
  }
});
