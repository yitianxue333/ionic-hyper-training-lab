/**
 * Training Divisions Compoenent
 * @description this components will show a carousal of divisions
 * @author Kanchana Yapa
 * @since 09/20/16
 */
angular.module('hyper.training').directive('hyTrainingDivisions', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      divisions: '='
    },
    templateUrl: 'views/training/components/hy-training-devisions.html',
    controller: function ($scope, $state, $ionicHistory,$stateParams) {
        var swiper;
   
        $scope.initSlider = function() {
            setTimeout(function() {
                swiper = new Swiper('.swiper-container', {
                    slidesPerView: "auto",
                    freeMode: true,
                    spaceBetween: 6,
                    slidesOffsetBefore: 3,
                    slidesOffsetAfter: -8
                });
            }, 500);
        };

        $scope.viewModules = function(devision) {
            $ionicHistory.clearCache().then(function() {
                $ionicHistory.clearHistory();
                $state.go('app.modules', { query : [devision.query] });
            });
        };
    }
  }
});
