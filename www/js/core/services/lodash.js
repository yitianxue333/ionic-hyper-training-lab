/**
 * Created by samuelcastro on 12/2/15.
 */
angular.module('hyper.core')
  .factory('_', function() {
    return window._; // assumes lodash has already been loaded on the page
  });
