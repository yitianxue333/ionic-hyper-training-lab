/**
 * Hyper Account information
 * @description Account profile information
 * @author Samuel Castro
 * @since 12/02/15
 */
 angular.module('hyper.profile').directive('hyAccountInfo', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/profile/components/hy-account-info.html',
    controller: function ($rootScope, $scope, $state, $ionicModal, $timeout, User, Account, Identity, Authentication, Alert, _) {
      $scope.hasCode = false;
      $scope.createSuccessMessage = false;
      $scope.updateSuccessMessage = false;
      $scope.emailUpdateSuccessMessage = false;
      $scope.credentialErrorMessage = "";
      $scope.emailErrorMessage = "";
      $scope.confirmMode = "";
      var confirmErrors = [
        "Authorization has expired",
        "Please provide confirmation"
      ];

      $scope.init = function() {
          $scope.credentialErrorMessage = "";
          $scope.emailErrorMessage = "";
          $scope.reloadStrategies();
      }


      function updateIdentity() {
        if($scope.accountInfoForm.$valid) {

          var payload = {"strategy": "login"};
         
          if($scope.profile.username.length == 0 && $scope.profile.newPassword.length == 0) {
            $scope.credentialErrorMessage = "Please enter username or password to update";
            return ;
          }

          if($scope.profile.username) {
            payload.auth_id = $scope.profile.username;
          }

          if($scope.profile.newPassword) {
            payload.secret = $scope.profile.newPassword;
          }

          Identity.updateIdentityAccountAuth(payload).then(
          function(response) {
            if (response && response.status.result === 'success') {
              showMessage('password');
              $scope.reloadStrategies();
            } else if(response && (response.status.result === 'failure')) {
              $scope.credentialErrorMessage = response.status.message;
              
              if(confirmErrors.indexOf(response.status.message) !== -1)
                  Authentication.deleteConfirmationToken();
            }
          });
        }
      }

      function createIdentity() {
        if($scope.accountInfoCreateForm.$valid) {
          var payload = {"strategy": "login"};
          payload.auth_id = $scope.profile.username;
          payload.secret = $scope.profile.newPassword;

          Identity.createIdentityAccountAuth(payload).then(
          function(response) {
            if (response && response.status.result === 'success') {
              showMessage('createPassword');
              $scope.reloadStrategies();
              $scope.accountInfoCreateForm.$setPristine();
            } else if(response && (response.status.result === 'failure')) {
              $scope.credentialErrorMessage = response.status.message;
              
              if(confirmErrors.indexOf(response.status.message) !== -1)
                    Authentication.deleteConfirmationToken();
            }
          });
        }
      }

      /**
       * Add or update password
       */
      $scope.createOrUpdatePassword = function() {
        $scope.credentialErrorMessage = "";
        if($scope.strategies['local'] && $scope.strategies['local'].strategy) {
          updateIdentity();
        } else {
          createIdentity();
        }
      };

      /**
      * Update user email
      */
      $scope.updateEmail = function() {
        Identity.updateIdentityAccount({
          "contact": {
            "email": $scope.profile.email 
          } 
        })
        .then(function(response) {
          if (response && response.status.result === 'success') {
            var identity = response.payload.contact;
            
            if($scope.profile) {
              $scope.profile.email = identity.email;
            } else {
              $scope.profile = {
                email : identity.email
              };
            }
            

            User.setIdentityInfo(identity);
            showMessage('email');

          } else if(response && (response.status.result === 'failure')) {
            $scope.emailErrorMessage = response.status.message;
            if(confirmErrors.indexOf(response.status.message) !== -1) 
                 Authentication.deleteConfirmationToken();
          }
        });
      };


      /**
      * Show successfull update message
      */
      function showMessage(messageType) {
        switch(messageType) {
          case 'email':
            $scope.emailUpdateSuccessMessage = true;
            break;
          case 'password' :
            $scope.profile.newPassword = '';
            $scope.profile.confirmNewPassword = '';
            $scope.accountInfoForm.$setPristine();
            $scope.updateSuccessMessage = true;
            break;
          case 'createPassword' :
            $scope.profile.newPassword = '';
            $scope.profile.confirmNewPassword = '';
            $scope.accountInfoForm.$setPristine();
            $scope.createSuccessMessage = true;
            break;
          
        }

        $timeout(function () {
          $scope.updateSuccessMessage = false;
          $scope.createSuccessMessage = false;
          $scope.emailUpdateSuccessMessage = false;
        }, 3000);
      };

      $scope.validatePasswordConfirm = function() {
        var password =  $scope.accountInfoForm.newPassword.$viewValue ?  $scope.accountInfoForm.newPassword.$viewValue : "";
        var confirm = $scope.accountInfoForm.confirmNewPassword.$viewValue ? $scope.accountInfoForm.confirmNewPassword.$viewValue : "";
        return (!$scope.accountInfoForm.confirmNewPassword.$pristine && password != confirm);
      };
    }
  }
});
