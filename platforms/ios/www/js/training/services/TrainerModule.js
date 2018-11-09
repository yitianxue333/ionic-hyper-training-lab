/**
 * TrainerModule Service
 * @description Trainer Module services provide all services for trainer module management
 * @author Kanchana Yapa
 * @since 28/09/16
 */
angular.module('hyper.training').factory('TrainerModule', function($resource, Config, _) {

    /**
     * Creating resource instance
     */
    var resource = $resource(Config.API_TRAINING_URL + '/:op/:trainers/module', {}, {
        getModuleListByTrainers: { method: 'GET', params:{ op: 'user/training/trainer' }, isArray:true }
    });

    
    function getModuleListByTrainers(trainers) {
        var query = { trainers : trainers.join(",") };
        return resource.getModuleListByTrainers(query).$promise;
    }


  return {
    getModuleListByTrainers: getModuleListByTrainers
  };
});
