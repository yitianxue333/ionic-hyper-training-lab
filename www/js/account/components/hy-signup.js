/**
 * Hyper Signup
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.account').directive('hySignup', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/account/components/hy-signup.html',
    controller: function ($scope, $state, $ionicModal, $rootScope, User, Account, Authentication, Identity, Profile, FCMBase, Config, UserDevice) {
      $scope.accountOptions = User.getAccountOptions();
      $scope.signup = {
        timeZone: $scope.accountOptions.timezones[0].value
      };

      $scope.openPrivacyLink = function() {
        window.open(Config.PRIVACY_POLICY_LINK, "_system");
      };

      $scope.createAccount = function(strategy) {
        if($scope.signupForm.$valid) {
          Identity.create(
            {
              "strategy": "local",
              "auth_id": $scope.signup.username,
              "secret": $scope.signup.password,
              "contact": {
                "email": $scope.signup.email
              },
              "audience": "traininglab",
              "context": "contact"
            }
          ).then(
            function(response) {
              if(response && response.status.result === 'success') {

                $rootScope.$broadcast('onLoggedIn', response.payload);

                /**
                 * Create FCM token and register device on training API
                 **/
                FCMBase.createToken().then(function(token) {
                  var deviceInfo = ionic.Platform.device();
                  UserDevice.registerDevice({ "deviceId" : deviceInfo.uuid, "fcmToken" : token }).then(function(result) {
                    console.log("Device Registered");
                  });
                }, function(error) {
                  console.log("Error creating FCM token", error);
                });

                /**
                 * Set the authentication cookie and strategy
                 */
                Authentication.setToken(response.payload.token);
                Authentication.setStrategy("local");
               
                User.setIdentityInfo(response.payload.contact);
                setUserAddtionalInformation().then(function() {
                  $state.go('app.profilesignup', { showCongratulations: true });
                  $scope.signupModal.hide();  
                });
              } else {
                 $scope.errorMessage = response.status.message;
              }
            }
          )
        }
      };

      $scope.getFormButtonMode = function() {
        var fixError = (($scope.signupForm.username.$invalid && ($scope.signupForm.$submitted || !$scope.signupForm.username.$pristine) ||
                ($scope.signupForm.email.$invalid && ($scope.signupForm.$submitted || !$scope.signupForm.email.$pristine)) ||
                ($scope.signupForm.userPassword.$invalid && ($scope.signupForm.$submitted || !$scope.signupForm.userPassword.$pristine)) ||
                ($scope.signupForm.confirmPassword.$invalid && ($scope.signupForm.$submitted || !$scope.signupForm.confirmPassword.$pristine)) ||
                (!$scope.signupForm.confirmPassword.$pristine && ($scope.signup.password !== $scope.signup.confirmPassword) && $scope.signup.confirmPassword.length > 0)) == true);
        var disabled = (!$scope.signupForm.$pristine && ($scope.signupForm.$invalid || !$scope.signup.aggreed));

        if(fixError)
          return "FIX";

        if(disabled)
          return "DISABLED";

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
       * Cleanup the modal when we're done with it!
       */
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      /**
       * Execute action on hide modal
       */
      $scope.$on('modal.hidden', function() {
        // Execute action
      });

      /**
       * Execute action on remove modal
       */
      $scope.$on('modal.removed', function() {
        // Execute action
      });

    }
  }
});
