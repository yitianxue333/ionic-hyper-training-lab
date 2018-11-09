/**
 * Training Service
 * @description Training services provide all services for Training management
 * @author Kanchana Yapa
 * @since 15/09/16
 */
angular.module('hyper.training').factory('Trainer', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op', {}, {
    getTrainers: { method: 'GET', params:{ op: 'user/training/trainer' }, isArray:true  }
  });

  function getTrainers() {
    return resource.getTrainers().$promise;
  }

  return {
    getTrainers: getTrainers
  };
});
