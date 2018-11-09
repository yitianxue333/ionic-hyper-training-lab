/**
 * Firebase Cloud Messaging Component
 * @description The FCM Service will handle firebase cloud Messaging
 * @author Kanchana Yapa
 * @since 11/07/2016
 */
angular.module('hyper.core').factory("FCMBase", function($injector) {

  /**
   * Register the device for Firebase cloud Messaging
   */
  function createToken() {
    return new Promise(function(resolve, reject) {
      FCMPlugin.getToken( function(token) {
          resolve(token);
          //alert(token);
        }, function(err){
          reject(err);
        }
      );
    });
  }

  return {
    createToken: createToken
  };
});
