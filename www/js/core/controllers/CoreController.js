/**
 * Core Controller
 * @description The main controller
 * @author Samuel Castro
 * @since 12/4/15
 */
angular.module('hyper.core').controller('CoreController', function($scope, $interval, $ionicHistory, User, $state, Authentication, Facebook, LocalStorage, $rootScope) {

  $scope.currentUser = User.getUser();
  $scope.currentIdentity = User.getIdentityInfo();
  $scope.userProfileImageUrl = User.getProfileImageUrl("large");

  /**
   * User has been updated, so lets update the current user object.
   */
  $scope.$on('onUpdateUser', function(event, user) {
    $scope.currentUser = user;
    $scope.userProfileImageUrl = User.getProfileImageUrl("large");
  });

  /**
   * User Identity has been updated, so lets update the current user Identity object.
   */
  $scope.$on('onUpdateIdentity', function(event, user) {
    $scope.currentIdentity = User.getIdentityInfo();
  });
 
  /**
   * User Logged in event
   */
  $scope.$on('onLoggedIn', function(event, identity) {
    var timestamp = new Date().getTime();
    LocalStorage.set('loggedInTime', timestamp);
  });

  /**
   * User Log out
   */
  $scope.$on('onLogOut', function(event, identity) {
      LocalStorage.set('loggedInTime', null);
      logOut();
  });


  function logOut() {
    $ionicHistory.clearCache().then(function() {
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

      Authentication.deleteToken();
      Authentication.deleteConfirmationToken();
      User.setUser({});
      User.setIdentityInfo({});


      /**
       * Ensuring that we wont have problems when try logout on web view.
       */
      if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        User.removeFacebookInfo();
        Facebook.logout();
      }

      $state.go('home', { reload: true });
    });
  }

});
