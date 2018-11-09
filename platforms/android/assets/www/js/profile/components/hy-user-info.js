/**
 * Hyper Signup personal information
 * @description collects personal information after signing up
 * @author Kanchana Yapa
 * @since 12/02/15
 */
 angular.module('hyper.profile').directive('hyUserInfo', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/profile/components/hy-user-info.html',
    controller: function ($rootScope, $scope, $state, $stateParams, $timeout, $ionicHistory, User, Account, Identity, _) {

      $scope.accountOptions = User.getAccountOptions();
      $scope.showCongratulations = $stateParams.showCongratulations;
      $scope.successMessage = false;
      $scope.countries = countries;
      $scope.genderList = ['male','female'];
      
      function birthYears() {
        var years = [],
        current = (new Date()).getFullYear();

        for(var i = current; i > current-100; i--)
          years.push(i); // [i, i]

        return years;
      };

      $scope.identitytInfo = User.getIdentityInfo();
      $scope.personalInfo = {
        firstName: $scope.identitytInfo.first_name,
        lastName: $scope.identitytInfo.last_name,
        nickName: $scope.currentUser.user_info.display_name,
        gender: $scope.currentUser.user_info.gender,
        birthYear: parseInt($scope.currentUser.user_info.birthyear),
        city: $scope.currentUser.user_info.city,
        stateProvince: $scope.currentUser.user_info.state_province,
        country:  _.findWhere($scope.countries, { value: $scope.currentUser.user_info.country}),
        timeZone: _.findWhere($scope.accountOptions.timezones, {value: $scope.currentUser.user_info.timezone}),
        newsLetter: $scope.showCongratulations ===  "true" ? 1 :$scope.currentUser.user_info.newsletter,
        belt: $scope.currentUser.ma_info.current_belt,
        style: $scope.currentUser.ma_info.martial_style,
        school: $scope.currentUser.ma_info.school_name
      };

      $scope.birthYears = birthYears();
      
      /*
      * Set the current time zone of the device when a timezone is not available to the user.
      */
      if (!$scope.personalInfo.timeZone) {
        var currectDate = new Date();
        var offsetSecond = -currectDate.getTimezoneOffset() * 60;
        $scope.personalInfo.timeZone = _.findWhere($scope.accountOptions.timezones, {offset_seconds : offsetSecond});
      };

      /**
       * Saving user account
       */
       $scope.save = function() {
        if($scope.personalInfoForm.$valid) {
          var accResponse = {};

          Account.updateAccount(
          {
            "user_info": {
              "display_name": $scope.personalInfo.nickName,
              "gender": $scope.personalInfo.gender,
              "birthyear": $scope.personalInfo.birthYear,
              "city": $scope.personalInfo.city,
              "state_province": $scope.personalInfo.stateProvince,
              "country": $scope.personalInfo.country ? $scope.personalInfo.country.value : null,
              "timezone": $scope.personalInfo.timeZone.value,
              "newsletter": $scope.personalInfo.newsLetter
            },
            "ma_info": {
              "current_belt": $scope.personalInfo.belt,
              "martial_style": $scope.personalInfo.style,
              "school_name": $scope.personalInfo.school,
              "group_name": null
            }
          })
          .then(function(accResponse) {
            if(accResponse && accResponse.status.result === 'success' && accResponse.payload.account.authenticated) {
                Identity.updateIdentityAccount({
                  contact: {
                    first_name: $scope.personalInfo.firstName,
                    last_name: $scope.personalInfo.lastName
                  },
                  context: "contact"
                }).then(function(identityResponse) {
                  if(accResponse && accResponse.status.result === 'success' && accResponse.payload.account.authenticated) {

                      /**
                       * Set user data
                       */
                      var user = accResponse.payload.account;


                      //user.user_info.profile_image = (User.getUser().user_info && User.getUser().user_info.profile_image) ? User.getUser().user_info.profile_image: 'img/user-default.jpg';

                      /**
                        *  Update the Identity Variables
                        */
                      User.setIdentityInfo(identityResponse.payload.contact);

                      /**
                       * Updating current user
                       */
                      User.setUser(user);

                      /**
                      * Redirect to the dashboard when user singup first time
                      */
                      if ($scope.showCongratulations) {
                        $scope.clearHistory();
                      };

                      $scope.successMessage  =true;
                      $timeout(function () {
                          $scope.successMessage = false;
                      }, 3000);

                      $scope.showUnCompleteMessage();
                      $scope.message = '';

                    } else {
                      $scope.message = {
                        value: identityResponse.status.message,
                        type: 'error'
                      };
                    }
                });
             } else {
               $scope.message = {
                  value: accResponse.status.message,
                  type: 'error'
                };
             } 
          })
          .catch(function(error){
            $scope.message = {
              value: error.message,
              type: 'error'
            };
          });
        }
      };

      /**
      * Redirect to the dashboard and clear the history
      */
      $scope.clearHistory = function () {
        $ionicHistory.clearCache().then(function() {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $state.go('app.dashboard', { reload: true });
        });
      }

      /*
      * Show message when user not fill the user info
      */
      $scope.showUnCompleteMessage = function () {
        if (($scope.personalInfo.firstName) && ($scope.personalInfo.nickName)) {
          $scope.showMessage = false;
          return;
        };
        $scope.showMessage = !$scope.showMessage;
      }

      $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
          input.push(i);
        }
        return input;
      };

      $scope.submitButtonMode = function() {
        var fixError = (((!$scope.personalInfoForm.nickName.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.nickName.$error.required)||
                      ((!$scope.personalInfoForm.nickName.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.nickName.$error.minlength) ||
                      ((!$scope.personalInfoForm.firstName.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.firstName.$error.required) || 
                      ((!$scope.personalInfoForm.lastName.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.lastName.$error.required) ||
                      ((!$scope.personalInfoForm.birthYear.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.birthYear.$error.required) ||
                      ((!$scope.personalInfoForm.city.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.city.$error.required) ||
                      ((!$scope.personalInfoForm.state.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.state.$error.required) ||
                      ((!$scope.personalInfoForm.country.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.country.$error.required) ||
                      ((!$scope.personalInfoForm.timeZone.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.timeZone.$error.required) ||
                      ((!$scope.personalInfoForm.style.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.style.$error.required) ||
                      ((!$scope.personalInfoForm.beltColor.$pristine || $scope.personalInfoForm.$submitted) && $scope.personalInfoForm.beltColor.$error.required)
                      );
        var disabled = !$scope.personalInfoForm.$pristine && $scope.personalInfoForm.$invalid;

        if(fixError) 
          return  "FIX";

        if(disabled)
          return "DISABLED";
      };
    }
  }
});
