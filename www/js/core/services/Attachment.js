/**
 * Attachment Service
 * @description Attachment services provide required services for user attachment api
 * @author Kanchana Yapa
 * @since 28/07/16
 */
angular.module('hyper.core').factory('Attachment', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/:op/:id', {}, {
    getAttachment: { method: 'GET', params:{ op: 'user/meta/attachment' } },
  });

  /**
   * Register users attachment with the training API
   **/
  function getAttachment(params) {
      return resource.getAttachment(params).$promise;
  }

  return {
    getAttachment: getAttachment
  };
});
