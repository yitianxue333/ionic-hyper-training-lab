/**
 * Hyper facebook Connect
 * @description Integrate facebook connect with the app
 * @author Kanchana Yapa
 * @since 12/07/15
 */
angular.module('hyper.account').directive('hyFacebookConnect', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/account/components/hy-facebook-connect.html',
    controller: function ($scope, $state, $q, $ionicLoading, $timeout, User, Account, Authentication, Facebook, Identity, Alert) {
      $scope.linked = false;
      $scope.successMessage = false;
      $scope.fbErrorMessage = "";
      var confirmErrors = [
        "Authorization has expired",
        "Please provide confirmation"
      ];

      /**
       * Retrieve the current connection state for facebook by retreiving the strategies from the API
       */
      function setLoginState() {
        $scope.linked = false;
        Identity.getAuthenticators()
        .then(function(data) {
          if(data.status.result === "failure") {
            $scope.fbErrorMessage = data.status.message;
            if(confirmErrors.indexOf(response.status.message) !== -1)
              Authentication.deleteConfirmationToken();
          } else {
            data.payload.forEach(function(auth) {
              if(auth.strategy === "facebook")
                $scope.linked = auth;
            });
          } 
        })
        .catch(function(error) {
          console.log(error);
        });
      }

      /**
       * This method is executed when the user press the "Connect with facebook" button
       */
      $scope.facebookConnect = function() {
        $scope.fbErrorMessage = "";
        Facebook.connect().then(function success(facebookData) {
            if(facebookData && facebookData.status.result === 'success') {
              setLoginState();            
              $scope.successMessage = true;
              $timeout(function() {
                $scope.successMessage = false;
              }, 2000);
            } else {
              $scope.fbErrorMessage = facebookData.status && facebookData.status.message ? facebookData.status.message : "";
            }
        }, function fail(error) {
            $scope.fbErrorMessage = error.status && error.status.message ? error.status.message : "";
            //$state.go('app.profile');
        });
      };

      /**
       * This method is executed when the user press the "Connect with facebook" button
       */
      $scope.facebookDisconnect = function() {
          if($scope.linked && $scope.linked.strategy === "facebook") {
            Identity.deleteAuthenticator($scope.linked.strategy).then(
              function(response) {
                if(response.status && response.status.result == "success") {
                  User.removeFacebookInfo();
                  setLoginState();
                  Facebook.logout();
                } else if(response && (response.status.result === 'failure') && (confirmErrors.indexOf(response.status.message) !== -1)) {
                  Authentication.deleteConfirmationToken();
                }
              }
            );
          }
          else 
          {
            Alert.showLongCenter("Facebook account is not linked");
          }
      };

      $scope.postShare = function() {
                                          console.log("facebook connect.js");
        var fbUserInfo = User.getFacebookInfo();
        var points = 40;
        var title =  "I just scored "+ points +" Points at the Hyper Training Lab!";
        var description = "Track your martial arts training, earn badges, compete alongside other athletes and get ranked on our regional and worldwide leaderboards.";
        var url = "http://HYPERMARTIALARTS.COM/TRAININGLAB";
        var imageUrl = "https://s3.amazonaws.com/HyperApp/Badges/Martial_Arts_Athlete/Hyper_Rookie/Hyper_Rookie_1.png";
        var accessToken = fbUserInfo.accessToken;
        var site_name = "HYPERMARTIALARTS.COM/TRAININGLAB";
        Facebook.shareGameObject(title, description, points, url, site_name, imageUrl, accessToken).then(function (response) {
          console.log(response)
        });
      };

      /**
       * Initiate the login state
       */
      setLoginState();
    }
  }
});
