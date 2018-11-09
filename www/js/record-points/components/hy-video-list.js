/**
 * Display Video List
 * @description this components will show stored video list
 * @author Kanchana Yapa
 * @since 12/18/15
 */
angular.module('hyper.recordPoints').directive('hyVideoList', function() {
  return {
    restrict: 'A',
    replace: false,
    controller: function ($scope, $ionicModal) {
      $scope.videos = [1,2,3,4,5,6];

      /**
       * Initialize Share option modal
       */
      $ionicModal.fromTemplateUrl('views/record-points/components/hy-share-options.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalShareOptions = modal;
      });

      /**
       * Open Video Modal
       */
      $scope.openModalShare = function() {
          $scope.modalShareOptions.show();
      };
    }
  }
});
