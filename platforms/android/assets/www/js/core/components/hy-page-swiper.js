/**
 * Hyper Slider
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.core').directive('hyPageSwiper', function($ionicGesture, $state, $ionicHistory) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
        var gestureType = attrs.gestureType;
        var view;
        var swipeAreaWidth = 25;
        var touchSpot = 0 ;
        $ionicGesture.on('touch', function(event) {
            touchSpot = event.gesture.touches[0].pageX;
        },elem);

        $ionicGesture.on('swiperight', function(event) {
            view = $ionicHistory.backView();
            var offset =  (window.innerWidth/100)*swipeAreaWidth;
            if((offset >= touchSpot) && view && typeof view.index == "number")
                $state.go(view.stateName, view.stateParams);

        }, elem);

        $ionicGesture.on('swipeleft', function(event) {
            view = $ionicHistory.forwardView();   
            var offset =  window.innerWidth - (window.innerWidth/100)*swipeAreaWidth;
            var x = event && event.gesture && event.gesture.touches && event.gesture.touches[0] ?  event.gesture.touches[0].pageX : window.innerWidth/2;
            console.log("SWIP LEFT", event.gesture.touches[0].pageX);
            
            if((offset <= touchSpot) && view && typeof view.index == "number")
                $state.go(view.stateName, view.stateParams);


        }, elem);
    }
  }
});
