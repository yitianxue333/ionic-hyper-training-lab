/**
 * Training Module User Profile
 * @description handles profile settings index
 * @author Sadaruwan
 * @since 05/01/17
 */
angular.module('hyper.profile').directive('hyProfileModuleSettings', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
        modules : "=",
        paging : "=",
    },
    templateUrl: 'views/profile/components/hy-profile-module-settings.html',
    controller: function ($scope, $rootScope) {
      $scope.logout = function(){
        $rootScope.$broadcast('onLogOut');
      }
    }
  }
});
