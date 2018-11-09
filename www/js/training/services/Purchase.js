/**
 * Purchase Service
 * @description Purchase modules / Get license
 * @author Sadaruwan
 * @since 04/26/2017
 */
angular.module('hyper.training').factory('Purchase', function($resource, Config) {

  /**
   * Creating resource instance
   */
  var resource = $resource(Config.API_TRAINING_URL + '/user/:op/:id/license', {}, {
    purchaseModule: { method: 'POST', params:{ op: 'training/module' }}
  });

  var resourceVerify = $resource(Config.API_TRAINING_URL + '/user/training/module/license/restore', {}, {
    purchaseModuleVerify: { method: 'POST', params:{}}
  });

  function purchaseModule(id, params) {
    return resource.purchaseModule({id : id}, params).$promise;
  }

  function purchaseModuleVerify(params) {
    var res = resourceVerify.purchaseModuleVerify({}, params).$promise;
    return res;
  }

  return {
    purchaseModule: purchaseModule,
    purchaseModuleVerify: purchaseModuleVerify
  };
});
