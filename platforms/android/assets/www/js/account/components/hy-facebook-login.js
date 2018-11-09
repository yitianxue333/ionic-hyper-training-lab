/**
 * Hyper facebook Login
 * @description Integrate facebook login with the app
 * @author Kanchana Yapa
 * @since 12/01/15
 */
angular.module('hyper.account').directive('hyFacebookLogin', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      buttonText: '@text',
      cancelPath: '@cancelPath',
      modal: "=",
      errorMessage : "="
    },
    template: '<a on-tap="facebookSignIn()" class="button button-block button-facebook large-button-font"><i class="icon icon-facebook pull-left"></i><span>{{buttonText}}</span></a>',
    controller: function ($rootScope, $scope, $state, $q, Facebook, User, Account, Identity, Profile, Authentication, FCMBase, UserDevice) {
      $scope.strategy = "facebook";
      $scope.audience = "traininglab";
      $scope.context = "contact";

      /**
       * Creating user account
       * @param userID
       * @param accessToken
       */
      function createAccount(facebookData) {
        Account.createAccount(
          {
            auth: {
              strategy: "facebook",
              userID: facebookData.profileInfo.id,
              accessToken: facebookData.authResponse.accessToken
            },
            user_info: {
              display_name: facebookData.profileInfo.name,
              email: facebookData.profileInfo.email
            }
          }
        ).then(
          function(response) {
            if(response && response.state.result === 'success') {
              $rootScope.$broadcast('onLoggedIn', response.payload);
              console.log("HYFACEBOOKLOGIN: User Hyper Account creation successful");

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
              Authentication.setToken(response.state.token);
              Authentication.setStrategy("facebook");
              getUserAuthenticator();

              /**
               * Setting user data
               */
              var user = response.data.account;
              User.setUser(user);
              User.setStats(response.data.stats);

              /**
               * Set Facebook info
               */
              User.setFacebookInfo({
                userId : facebookData.authResponse.userID,
                accessToken: facebookData.authResponse.accessToken,
                expire: facebookData.authResponse.expiresIn,
                name: facebookData.profileInfo.name,
                email: facebookData.profileInfo.email
              });

              $state.go('app.profilesignup', { showCongratulations: true });
            } else {

              console.log("HYFACEBOOKLOGIN: User Hyper Account creation failed", response);
              Facebook.logout();
              if(response && response.state.result === "failure" && response.state.message == "Email address is already in use") {
                $state.go('signupwarning');
                if($scope.modal)
                  $scope.modal.hide();
                
              } else {
                //$state.go($scope.cancelPath);
              }
            }
          }
        );
      };

      /**
       * Handling the Facebook authentication
       * @param authResponse
       */
      function handleAuthentication(facebookData) {

        console.log("HYFACEBOOKLOGIN: Creds", {
          strategy: "facebook",
          userID: facebookData.authResponse.userID,
          accessToken: facebookData.authResponse.accessToken
        });

        /**
         * Check if we have our user saved
         */
        Identity.login($scope.strategy, $scope.audience, $scope.context, facebookData.authResponse.userID, facebookData.authResponse.accessToken)
        .then(
          function(response) {
            if(response && response.status.result === 'success') {
              console.log("HYFACEBOOKLOGIN: User logged into Hyper successfully");

              Authentication.setToken(response.payload.token);
              Authentication.setStrategy($scope.strategy);

              //TODO get authenticators
              User.setIdentityInfo(response.payload.contact);

              $rootScope.$broadcast('onLoggedIn', response.payload);
              setUserAddtionalInformation(facebookData).then(function() {
                User.setFacebookInfo({
                  userId : facebookData.authResponse.userID,
                  accessToken: facebookData.authResponse.accessToken,
                  expire: facebookData.authResponse.expiresIn,
                  name: facebookData.profileInfo.name,
                  email: facebookData.profileInfo.email
                });

                if(response.payload.created) {
                  $state.go('app.profilesignup', { showCongratulations: true });
                } else {
                  $state.go('app.dashboard', { reload: true });
                }

                if($scope.modal) {
                  $scope.modal.hide();
                }
              });
            } else {
              if(response.status && response.status.message)
                $scope.errorMessage = response.status.message;
            }
        });
      };
      

      /**
       * This method is executed when the user press the "Login with facebook" button
       */
      $scope.facebookSignIn = function() {
        Facebook.login().then(function(response) {
          if(response && response.profileInfo && response.profileInfo.email) {
            handleAuthentication(response);
          } else {

            // If required information is not there
            if(response && response.profileInfo && (!response.profileInfo.email)) {
              $state.go("signupfbwarningunverified");
            } else {
              $state.go("signupfbwarning");
            }

            if($scope.modal)
                  $scope.modal.hide();
          }
        }, function(fail) {
          console.log("HYFACEBOOKLOGIN: Failed signin", fail);

          if(fail.errorMessage == "User cancelled dialog") {
            //$state.go($scope.cancelPath);
          } else {
            $state.go("signupfbwarning");
            if($scope.modal)
              $scope.modal.hide();
          }
        });
      };

      /**
       * Set Users Data
       */
      function setUserAddtionalInformation(facebookData) {
        return new Promise(function(resolve, reject) {
          Profile.validate({
              "email": facebookData.profileInfo.email,
              "auth": {
                  "strategy": $scope.strategy,
                  "auth_id": facebookData.authResponse.userID
              }
          })
          .then(function(data) {
            if(data.status.result == "success" && data.payload.valid) {
              Profile.get()
              .then(function(response) {
                  User.setUser(response.payload.account);
                  User.setStats(response.payload.stats);
                  resolve(response);
              })
              .catch(function(error) {
                reject(error);
              });
            } else {
              reject(data.status);
            }
          });
        });
      };

     /*
      * Set the user strategies list
      */
      // function getUserAuthenticator() {
      //    Account.getUserAuthenticator().then(function(response) {
      //       if(response && response.state.result === 'success') {
      //         User.setStrategies(response.data);
      //       }
      //    });
      // }
    }
  }
});
