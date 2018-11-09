/**
 * Profile Service
 * @description Profile service profile communication with profile api calls
 * @author Kanchana Yapa
 * @since 05/10/2016
 */
angular.module('hyper.account').factory('Profile', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_URL + '/:op/:token', {}, {
    get: { method: 'GET', params:{ op: 'profile' }, authToken: 'params' },
    getOptions: { method: 'GET', params:{ op: 'profile/options' }, public: true },
    validate: { method: 'POST', params:{ op: 'profile/validate' }, public: true }
  });

  function get() {
    return resource.get().$promise;
  }

  function getOptions() {
    return resource.getOptions().$promise;
  }

  function validate(params) {
    return resource.validate(params).$promise;
  }

  return {
    get: get,
    getOptions: getOptions,
    validate: validate
  };
});
