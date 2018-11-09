/**
 * Hyper Login
 * @description
 * @author Kanchana
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.account').directive('hyLogin', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/account/components/hy-login.html',
    controller: function ($scope, $rootScope, $state, $ionicModal, $stateParams, User, Account, Profile, Identity, Authentication, FCMBase, UserDevice, Config, _) {
      $scope.loginData = {};
      $scope.strategy = "local";
      $scope.audience = "traininglab";
      $scope.context = "contact";

      $scope.openForgotLink = function() {
        window.open(Config.PASSWORD_RECOVERY_LINK, "_system");
      };

      $scope.openPrivacyLink = function() {
        window.open(Config.PRIVACY_POLICY_LINK, "_system");
      };


      /**
       * Logs in the user by a specified strategy
       */
      $scope.doLogin = function() {
        $scope.errorMessage = "";
        if($scope.authorizationForm.$valid) {
          Identity.login($scope.strategy, $scope.audience, $scope.context, $scope.loginData.username, $scope.loginData.password).then(
            function(response) {
              if(response && response.status.result === 'success' && response.payload.token) {

                /**
                 * Set the authentication cookie and current strategy
                 */
                Authentication.setToken(response.payload.token);
                Authentication.setStrategy($scope.strategy);

                /**
                 * Create FCM token and register device on training API
                 **/
                FCMBase.createToken().then(function(token) {
                  var deviceInfo = ionic.Platform.device();
                  UserDevice.registerDevice({ "deviceId" : deviceInfo.uuid, "fcmToken" : token }).then(function(result) {
                    console.log("Device Registered");
                  }, function(error) {
                    console.log("ERROR saving", JSON.stringify(error));
                  });
                }, function(error) {
                  console.log("Error creating FCM token", error);
                });

                User.setIdentityInfo(response.payload.contact);
                
                $rootScope.$broadcast('onLoggedIn', response.payload);
                setUserAddtionalInformation().then(function(data) {
                    var identityInfo = User.getIdentityInfo();
                    var userInfo = User.getUser();
                    if(User.userNeedsInitialSetup(User.getIdentityInfo(), userInfo.user_info, userInfo.ma_info)) {
                      $state.go('app.profilesignup', { showCongratulations: "incomplete" });
                    } else {
                      $state.go('app.dashboard', { reload: true });
                    }

                    $scope.loginModal.hide();
                    
                }).catch(function(error) {
                    $scope.errorMessage = error.status.message;
                });
              } else {
                $scope.errorMessage = response.status.message;
              }
            }
          )
          .catch(function(error) {
             $scope.errorMessage = error.status.message;
          });
        }
      };

      $scope.submitButtonMode = function() {
        var fixError = (((!$scope.authorizationForm.username.$pristine || $scope.authorizationForm.$submitted) && $scope.authorizationForm.username.$error.required) ||
                       ((!$scope.authorizationForm.userPassword.$pristine || $scope.authorizationForm.$submitted) && $scope.authorizationForm.userPassword.$error.required));
        var disabled = (!$scope.authorizationForm.$pristine && $scope.authorizationForm.$invalid);

        if(fixError) 
          return  "FIX";

        if(disabled)
          return "DISABLED";

      };

      $ionicModal.fromTemplateUrl('views/account/view-terms.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      /**
       * Set Users Data
       */
      function setUserAddtionalInformation() {
        return new Promise(function(resolve, reject) {
          Profile.get()
          .then(function(response) {
              User.setUser(response.payload.account);
              User.setStats(response.payload.stats);
              resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
        });
      };
    }
  }
});
