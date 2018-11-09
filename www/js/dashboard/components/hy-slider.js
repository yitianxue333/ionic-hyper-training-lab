/**
 * Hyper Slider
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.dashboard').directive('hySlider', function(Media) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/dashboard/components/hy-slider.html',
    controller: function ($rootScope, $scope, $state, $stateParams, $location, $ionicSlideBoxDelegate, MediaList) {
      $scope.slides = [];
      var swiper;
      
      $scope.initSlider = function() {
          setTimeout(function() {
              swiper = new Swiper('.dash-swiper-container', {
                  slidesPerView: "auto",
                  freeMode: true,
                  spaceBetween: 6,
                  slidesOffsetBefore: 8,
                  slidesOffsetAfter: -8
              });
          }, 500);
      };

      $scope.link = function(index) {
        if($scope.slides["dashboard-tiles"] && $scope.slides["dashboard-tiles"][index] && $scope.slides["dashboard-tiles"][index].url) {
          var url = $scope.slides["dashboard-tiles"][index].url;
          if(url.indexOf("http") !== -1 ) {
            window.open(url, "_system");
          } else {
            if(url.indexOf("/") !== -1) {
              $location.path(url);
            } else {
              $state.go(url, { reload: true });
            }
          }
        }
      };

      MediaList.getMediaList("dashboard-tiles").then(function (response){
          $scope.slides = processMediaList(response);
          $ionicSlideBoxDelegate.update();
      });


      function processMediaList(media_list) {
        return media_list.reduce(function(struct, list) {
            const el = list.items.map(function(i) {
                return {
                    label: i.label,
                    desc: i.desc || "",
                    image: i.attachments[0] && i.attachments[0].url ?  i.attachments[0].url : {},
                    url: i.url 
                }
            });
            
            struct[list.name] = el;
            
            return struct;
        }, {});
      }

    }
  }
});
