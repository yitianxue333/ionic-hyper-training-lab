/**
 * Media Service
 * @description Media service manage Media data on the server
 * @author Kanchana Yapa
 * @since 25/02/16
 */
angular.module('hyper.dashboard').factory('Media', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_URL + '/:op/:type', {}, {
    get: { method: 'GET', params:{ op: 'media' } , authToken: 'params' },
  });

  function get(params) {
    return resource.get(params).$promise;
  }

  return {
    get: get
  };
});
