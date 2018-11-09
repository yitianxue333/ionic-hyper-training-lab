/**
 * UserDevice Service
 * @description UserDevice services provide all services for UserDevice management
 * @author Kanchana Yapa
 * @since 25/07/16
 */
angular.module('hyper.account').factory('UserDevice', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op', {}, {
    createDevice: { method: 'POST', params:{ op: 'user/device' } },
  });

  /**
   * Register users device with the training API
   **/
  function registerDevice(params) {
      return resource.createDevice(params).$promise;
  }

  return {
    registerDevice: registerDevice
  };
});
