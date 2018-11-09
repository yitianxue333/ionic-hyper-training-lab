/**
 * Hyper Signup personal information
 * @description collects personal information after signing up
 * @author Kanchana Yapa
 * @since 12/02/15
 */
 angular.module('hyper.profile').directive('hyConfirmAccount', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/profile/components/hy-confirm-account.html',
    controller: function ($scope, $state, $stateParams, $timeout, $ionicHistory, User, Authentication, Identity, Facebook, _) {
        var audience = "confirmation",
            context = "authenticators";

        $scope.identity = {};
        $scope.confirmAcccount = function() {
          if($scope.confirmAccountForm.$valid) {
            Identity.confirm("local", audience, context, $scope.identity.username, $scope.identity.password)
            .then(function(response) {
              if(response && response.status.result === 'success' && response.payload.token) {
                Authentication.setConfirmationToken(response.payload.token);
                $scope.reloadStrategies();
              } else {
                $scope.errorMessage = response.status.message;
              }
            })
            .catch(function(error) {
                console.log(error);
            });
          }
        };

        $scope.facebookConfirm = function() {
          $scope.fbErrorMessage = "";
          Facebook.login().then(function success(facebookData) {
              Identity.confirm("facebook", audience, context, facebookData.authResponse.userID, facebookData.authResponse.accessToken)
              .then(function(response) {
                if(response && response.status.result === 'success' && response.payload.token) {
                  Authentication.setConfirmationToken(response.payload.token);
                  $scope.reloadStrategies();
                } else {
                  $scope.fbErrorMessage = response.status.message;
                }
              })
              .catch(function(error) {
                  console.log(error);
              });
          }, function fail(error) {
            $state.go('app.profile');
          });
        };

        $scope.submitButtonMode = function() {
          var fixError = (
            ((!$scope.confirmAccountForm.username.$pristine || $scope.confirmAccountForm.$submitted) && $scope.confirmAccountForm.username.$error.required) ||
            ((!$scope.confirmAccountForm.password.$pristine || $scope.confirmAccountForm.$submitted) && $scope.confirmAccountForm.password.$error.required)
          );

          var disabled = !$scope.confirmAccountForm.$pristine && $scope.confirmAccountForm.$invalid;

          if(fixError) 
            return "FIX";

          if(disabled)
            return "DISABLED";
        };
    }
  }
});
