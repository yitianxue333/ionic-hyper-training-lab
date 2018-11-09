/**
 * Authentication Service
 * @description Handles authentication data
 * @author Kanchana Yapa
 * @author Samuel Castro
 * @since 12/07/15
 */
angular.module('hyper.authentication').factory('Authentication', function($rootScope, $injector, jwtHelper, User, LocalStorage) {

  /**
   * set the token for the current user
   * @param token
   */
  function setToken(token) {
    LocalStorage.set('token', token);
  }

  /**
   * Getting current user token
   */
  function getToken() {
    return LocalStorage.get('token');
  }

  /**
   * Removing token
   */
  function deleteToken() {
    LocalStorage.remove('token');
  }

  /**
   * Storing current user login strategy
   */
  function setStrategy(strategy) {
    LocalStorage.set('strategy', strategy);
  }

  /**
   * Getting current user login strategy
   */
  function getStrategy() {
    return LocalStorage.get('strategy');
  }

  /**
   * Get confirmation Token info
   */
  function getConfirmationToken() {
    return LocalStorage.get('confirmation');    
  }

  /**
   * Removing Confirmation token
   */
  function deleteConfirmationToken() {
    LocalStorage.remove('confirmation');
    $rootScope.$broadcast('onUpdateConfirmation', null);    
  }


  /**
   * Storing Confirmation token data
   * @param confirmation
   */
  function setConfirmationToken(confirmation) {
    LocalStorage.set('confirmation', confirmation);
    $rootScope.$broadcast('onUpdateConfirmation', confirmation);
  }

  /**
   * Decoding and validating JWT token
   */
  function tokenValidation() {
    var self = this;

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      var isInvalidToken = false;
      var isExpiredToken = false;

      try {
        var token = jwtHelper.decodeToken(self.getToken());
        console.log('HYPER::LOG::TOKEN  ', token);
        isExpiredToken = jwtHelper.isTokenExpired(self.getToken());
        console.log('HYPER::LOG::IS_EXPERIED_TOKEN  ', isExpiredToken);
      } catch(err) {
        console.log("HYPER::LOG::Error validating token" , err);
        isInvalidToken = true;
      }

      /**
       * If user is already logged in, so go to the dashboard
       */
      if(toState.name == 'home' && (!isInvalidToken && !isExpiredToken)) {
        $injector.get('$state').go('app.dashboard', {}, { reload: true });
      }

      /**
       * Denny access for restrict area when user is not logged
       */
      if(!toState.public && (isInvalidToken || isExpiredToken)) {
        self.deleteToken();
        User.setUser({});
        $injector.get('$state').go('home', {}, { reload: true });
      }
    });
  }

  return {
    getToken: getToken,
    setToken: setToken,
    deleteToken: deleteToken,
    setStrategy: setStrategy,
    getStrategy: getStrategy,
    getConfirmationToken: getConfirmationToken,
    setConfirmationToken: setConfirmationToken,
    deleteConfirmationToken: deleteConfirmationToken,
    tokenValidation: tokenValidation
  };
});
