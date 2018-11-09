/**
 * MediaList Service
 * @description MediaList services provide all services for MediaList management
 * @author Kanchana Yapa
 * @since 15/09/16
 */
angular.module('hyper.training').factory('MediaList', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op', {}, {
    getMediaList: { method: 'GET', params:{ op: 'user/meta/medialist' }, isArray:true }
  });

  function getMediaList(name) {
    const query = {
      target: 'mobile'
    };
	
    if(name)
      query.name = name;

    return resource.getMediaList(query).$promise;
  }

  return {
    getMediaList: getMediaList
  };
});
