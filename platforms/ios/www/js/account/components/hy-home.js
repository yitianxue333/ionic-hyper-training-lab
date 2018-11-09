/**
 * Hyper Home
 * @description
 * @author Kanchana
 * @since 10/18/16
 */
angular.module('hyper.account').directive('hyHome', function() {
  return {
    restrict: 'A',
    replace: true,
    link: function(scope, element) {
        setTimeout(function() {
            scope.$apply(function () {
                scope.slide = true;
            });
        }, 4000);
    },
    controller: function ($scope, $state, $stateParams, $ionicModal) {
        $scope.slide = false;
        $scope.openFromLogin = false;

        // $scope.$on('modal.shown', function() {
        //     if (window.StatusBar)StatusBar.styleBlackTranslucent();     
        // });
                
        // $scope.$on('modal.hidden', function() {
        //     if (window.StatusBar)StatusBar.styleDefault();
        // });
                
        $scope.openLogin = function(animateDirection) {
            $ionicModal.fromTemplateUrl('views/account/login.html', {
                scope: $scope,
                animation: animateDirection ? animateDirection : 'slide-in-up',
                width: '90%',
                height: '90%'
            }).then(function(modal) {
                $scope.loginModal = modal;
                $scope.loginModal.show();
            });
        };


// if (isOpen){
//             if (window.StatusBar)StatusBar.styleBlackTranslucent();
//         } else {
//            if (window.StatusBar)StatusBar.styleDefault();
//         }

        $scope.openSignUp = function(animateDirection) {
            $ionicModal.fromTemplateUrl('views/account/signup.html', {
                scope: $scope,
                animation: animateDirection ? animateDirection : 'slide-in-up',
                width: '90%',
                height: '90%'
            }).then(function(modal) {
                $scope.signupModal = modal;
                $scope.signupModal.show();
            });

            if(animateDirection) {
                $scope.openFromLogin = true;
            }
        };

        $scope.init = function() {
            if($stateParams.show) {
                if($stateParams.show === "signup") {
                    $ionicModal.fromTemplateUrl('views/account/signup.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        width: '90%',
                        height: '90%'
                    }).then(function(modal) {
                        $scope.signupModal = modal;
                        $scope.signupModal.show();
                    });
                }
                else if($stateParams.show === "login") {
                    $ionicModal.fromTemplateUrl('views/account/login.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        width: '90%',
                        height: '90%'
                    }).then(function(modal) {
                        $scope.loginModal = modal;
                        $scope.loginModal.show();
                    });
                }
            }
        };

        $scope.$on('modal.shown', function() {
            if($scope.openFromLogin) {
                setTimeout(function() {
                    $scope.loginModal.hide();
                    $scope.openFromLogin = false;
                }, 1000);
            }
        });
    }
  }
});
