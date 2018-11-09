/**
 * Training Store Service
 * @description Handles Storage of training data
 * @author Kanchana Yapa
 * @since 21/09/16
 */
angular.module('hyper.training').factory('TrainingStore', function($rootScope, LocalStorage, Config, $resource) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op', {}, {
    getLicensedModules: { method: 'GET', params:{ op: 'user/training/module/licensed' }, isArray:true  }
  });

  function setTaxonomies(taxonomies) {
    LocalStorage.set('taxonomies', taxonomies);
  }


  function getTaxonomies() {
    return LocalStorage.get('taxonomies');
  }

  function setTrainers(trainers) {
    LocalStorage.set('trainers', trainers);
  }

  function getTrainers() {
    return LocalStorage.get('trainers');
  }

  return {
    setTaxonomies: setTaxonomies,
    getTaxonomies: getTaxonomies,
    setTrainers: setTrainers,
    getTrainers: getTrainers
  };
});
