/**
 * Profile
 * @description this components will show the user profile
 * @author Samuel Castro
 * @since 12/03/15
 */
angular.module('hyper.profile').directive('hyProfileUser', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/profile/components/hy-profile-user.html',
    controller: function ($scope, $ionicScrollDelegate, jwtHelper, User, Authentication, Identity) {
      $scope.selectedTab = 'userInfo';
      $scope.accountOptions = User.getAccountOptions();
      $scope.confirmation = Authentication.getConfirmationToken();
      $scope.identitytInfo = User.getIdentityInfo();
      $scope.strategies = {};
      
      $scope.profile = {
            email: $scope.identitytInfo.email,
            username: ""
      };

      var timerId = null;

      if (!$scope.showCongratulations && User.userNeedsInitialSetup($scope.currentIdentity, $scope.currentUser.user_info, $scope.currentUser.ma_info)) {
        $scope.showMessage = true;
      };

      $scope.hideMessage = function() {
          $scope.showMessage = false;
      };

      $scope.reloadStrategies = function() {
        if($scope.confirmation) {
          Identity.getAuthenticators()
          .then(function(data) {
            if(data.status.result === "failure") {
              Authentication.deleteConfirmationToken();
            } else {
              data.payload.forEach(function(auth) {
                $scope.strategies[auth.strategy] = auth;
              });
            }

            var identitytInfo = User.getIdentityInfo();
            $scope.profile.email = identitytInfo.email;
            $scope.profile.username = $scope.strategies['local'] && $scope.strategies['local'].auth_id ? $scope.strategies['local'].auth_id : "";
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      };

      $scope.$on('onUpdateConfirmation', function(event, token) {
        $scope.confirmation = Authentication.getConfirmationToken();
        $scope.reloadStrategies();
        $scope.checkConfirmationStatus();
      });

      $scope.changePage = function(select) {
        $scope.confirmation = Authentication.getConfirmationToken();
      	$scope.selectedTab = select;

        $ionicScrollDelegate.scrollTop();
      };

      $scope.hasValidToken = function() {
        return ($scope.confirmation);
      };

      // $scope.checkConfirmationStatus = function() {
      //     var decoded = false;
      //     try {
      //       decoded = jwtHelper.decodeToken($scope.confirmation);
      //     } catch(e) {
      //       console.log(e);
      //     }
      //
      //     if(decoded) {
      //       console.warn('decoded confirmation token', decoded)
      //
      //       var now = new Date();
      //       var expires = new Date(decoded.exp * 1000);
      //
      //       console.log('Current time is', now.toLocaleString());
      //       console.log('Confirmation expires', expires.toLocaleString());
      //
      //       if(timerId) {
      //         clearTimeout(timerId);
      //         timerId = null;
      //       }
      //
      //       const eventTime = decoded.exp - Math.floor(Date.now() / 1000);
      //       console.warn('seconds until confirmation expiration', eventTime);
      //
      //       if(eventTime < 1000)
      //         Authentication.deleteConfirmationToken();
      //       else
      //       {
      //         timerId = setTimeout(function() {
      //           $scope.$apply(function() {
      //                Authentication.deleteConfirmationToken();
      //           });
      //         }, eventTime*1000);
      //       }
      //     }
      // };

      //$scope.checkConfirmationStatus();
      $scope.reloadStrategies();
    }
  }
});
