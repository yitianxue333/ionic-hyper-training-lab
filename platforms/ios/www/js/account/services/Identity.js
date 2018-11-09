/**
 * Account Service
 * @description Account services provide all services for account management
 * @author Samuel Castro
 * @since 12/3/15
 */
angular.module('hyper.account').factory('Identity', function($resource, Config) {

  var resource = $resource(Config.AUTH_URL + '/:op/:audience', {}, {
    login: { method: 'POST', params:{ op: 'identify' }, public: true },
    confirm: { method: 'POST', params:{ op: 'identify' } },
    updateIdentityAccount: { method: 'PUT', params:{ op: 'account' }, confirmToken: true },
    create: { method: 'POST', params : { op: 'account' }, public: true}
  });

  var resourceAuth = $resource(Config.AUTH_URL + '/:op/:strategy', {}, {
    getAuthenticators : { method: 'GET', params: { op: 'account/auth'}, confirmToken: true },            
    addAuthenticator: { method: 'POST', params:{ op: 'account/auth' }, confirmToken: true },
    createIdentityAccountAuth: { method: 'POST', params:{ op: 'account/auth' }, confirmToken: true },    
    updateIdentityAccountAuth: { method: 'PUT', params:{ op: 'account/auth' }, confirmToken: true },    
    deleteAuthenticator: { method: 'DELETE', params : { op: 'account/auth' }, confirmToken: true }
  });

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
    return resource.login(
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

  /**
   * Handles updating identity record for te specific accessToken
   * @params params object email, first_name, last_name
   */
  function updateIdentityAccount(params) {
    return resource.updateIdentityAccount(params).$promise;
  }

  /**
   * Handles creating an account
   * @params params account + strategy objects
   */
  function create(params) {
    return resource.create(params).$promise;
  }

  /**
   * Handles the calls to identity api which needs to authToken
   * 
   * @param strategy string Method to use for authenticatioo. = ['local', 'facebook']
   * @param audience string Purpose for which the token is intended
   * @param context string Requested user data
   * @param auth_id string which uniquely identifies the user
   * @param secret string which authenticates the auth_id
   */
  function confirm(strategy, audience, context, auth_id, secret) {
    return resource.confirm(
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

  /**
   * get authenticators
   */
  function getAuthenticators() {
    return resourceAuth.getAuthenticators().$promise
  }

  /**
   * Handles updating a specified strategy
   * @params params object strategy, auth_id, secret
   */
  function createIdentityAccountAuth(params) {
    return resourceAuth.createIdentityAccountAuth(params).$promise;
  }


  /**
   * Handles updating a specified strategy
   * @params params object strategy, auth_id, secret
   */
  function updateIdentityAccountAuth(params) {
    return resourceAuth.updateIdentityAccountAuth(params).$promise;
  }

  /**
   * add a specified strategy
   * @params params object strategy, auth_id, secret
   */
  function addAuthenticator(params) {
    return resourceAuth.addAuthenticator(params).$promise
  }

  /**
   * delete a specified strategy
   * @params params string strategy name
   */
  function deleteAuthenticator(strategy) {
    return resourceAuth.deleteAuthenticator( { "strategy" : strategy }).$promise
  }

  return {
    updateIdentityAccount: updateIdentityAccount,
    updateIdentityAccountAuth: updateIdentityAccountAuth,
    createIdentityAccountAuth: createIdentityAccountAuth,
    login: login,
    create: create,
    confirm: confirm,
    getAuthenticators: getAuthenticators,
    deleteAuthenticator: deleteAuthenticator,
    addAuthenticator: addAuthenticator
  };
});
