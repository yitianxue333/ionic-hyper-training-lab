/**
 * Taxonomy Service
 * @description Taxonomy services provide all services for Taxonomy management
 * @author Kanchana Yapa
 * @since 15/09/16
 */
angular.module('hyper.training').factory('Taxonomy', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op', {}, {
    getTaxonomies: { method: 'GET', params:{ op: 'user/training/taxonomy' }, isArray:true }
  });

  function getTaxonomies() {
    return resource.getTaxonomies().$promise;
  }

  return {
    getTaxonomies: getTaxonomies
  };
});
