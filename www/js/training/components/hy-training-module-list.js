/**
 * Training Module List Compoenent
 * @description handles trainers modules
 * @author Kanchana Yapa
 * @since 09/28/16
 */
angular.module('hyper.training').directive('hyTrainingModuleList', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
        modules : "=",
        paging : "=",
    },
    templateUrl: 'views/training/components/hy-training-module-list.html',
    controller: function ($scope) {

    }
  }
});
