/**
 * Account Service
 * @description Account services provide all services for account management
 * @author Samuel Castro
 * @since 12/3/15
 */
angular.module('hyper.account').factory('Account', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_URL + '/:op/:token', {}, {
    createAccount: { method: 'POST', params:{ op: 'account' }, public: true },
    getAccount: { method: 'GET', params:{ op: 'account' }, authToken: 'params' },
    updateAccount: { method: 'PUT', params:{ op: 'profile' }, authToken: 'params' },
    getAccountOptions: { method: 'GET', params:{ op: 'account/options' }, public: true },
    accountValidate: { method: 'POST', params:{ op: 'account/validate' }, authToken: 'params' },
    login: { method: 'POST', params:{ op: 'account/login' }, public: true },
    confirmAccount: { method: 'POST', params:{ op: 'account/auth' }, authToken: 'params' },
    deleteAuthenticator: { method: 'POST', params:{ op: 'account/auth/delete' }, authToken: 'params' }
  });

  var authResource = $resource(Config.AUTH_URL + '/:op/:audience', {}, {
    login: { method: 'POST', params:{ op: 'identify' }, public: true },
  });

  function createAccount(params) {
    return resource.createAccount(params).$promise;
  }

  function getAccount(params) {
    return resource.getAccount(params).$promise;
  }

  function updateAccount(params) {
    return resource.updateAccount(params).$promise;
  }

  function getAccountOptions(params) {
    return resource.getAccountOptions(params).$promise;
  }

  function accountValidate(params) {
    return resource.accountValidate(params).$promise;
  }

  function confirmAccount(params) {
    return resource.confirmAccount(params).$promise;
  }

  /**
   * Handles user login to the identity server
   * 
   * @param strategy string Method to use for authenticatioo. = ['local', 'facebook']
   * @param audience string Purpose for which the token is intended
   * @param context string Requested user data
   * @param auth_id string which uniquely identifies the user
   * @param secret string which authenticates the auth_id
   */
  function login(strategy, audience, context, auth_id, secret) {
    return authResource.login(
            {
              audience: audience,
              context: context 
            }, 
            {
              strategy: strategy,
              auth_id: auth_id,
              secret: secret
            }).$promise;
  }

  function updateIdentityAccount(params) {
    return resource.updateAccount(params).$promise;
  }

  return {
    createAccount: createAccount,
    getAccount: getAccount,
    updateAccount: updateAccount,
    getAccountOptions: getAccountOptions,
    accountValidate: accountValidate,
    login: login,
    confirmAccount: confirmAccount
  };
});
