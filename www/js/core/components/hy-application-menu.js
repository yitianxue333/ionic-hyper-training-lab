/**
 * Hyper Slider
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.core').directive('hyApplicationMenu', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/core/components/hy-application-menu.html',

    controller: function ($scope, $ionicHistory, $state, $rootScope, User, Authentication, Facebook, Notification, $ionicSideMenuDelegate, Config) {

      $scope.$watch(function () {
        return $ionicSideMenuDelegate.isOpenLeft();
      },
        function (isOpen) {
        if (isOpen){
            if (window.StatusBar)StatusBar.styleBlackTranslucent();
        } else {
           if (window.StatusBar)StatusBar.styleDefault();
        }
      });

      $scope.initMenu = function() {
        setTimeout(function() {
          try {
            FCMPlugin.onNotification(
              function(data) {
                //alert("Got Data" + JSON.stringify(data));
                Notification.init($scope);
                Notification.process(data);
              },
              function(msg) {
                console.log('onNotification callback successfully registered: ' + msg);
              },
              function(err) {
                alert("Error registering push messaging notification callback");
                console.log('Error registering onNotification callback: ' + err);
              }
            );
          } catch(e) {
            //alert("Error registering push messaging !", JSON.stringify(e));
            console.log("Error registering push messaging", e);
          }
        }, 2000);
      };

      $scope.logout = function() {
        $rootScope.$broadcast('onLogOut');
      };

      $scope.getHelp = function(){
        window.open(Config.GET_HELP_LINK, "_system");
      }


    }
  }
});
