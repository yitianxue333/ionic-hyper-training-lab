/**
 * Training Module Purchase Component
 * @description handles training module purchase
 * @author Sadaruwan
 * @since 04/27/17
 */
angular.module('hyper.training').directive('hyTrainingModulePurchaseError', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/training/components/hy-training-module-purchase-error.html',
    link: function (scope, element, attrbs) {

        function initStage() {

        }

        initStage();
    },
    controller: function ($scope, $stateParams, Module, $ionicHistory, TrainingStore, Config, $rootScope, $location, $state, $timeout) {

        $scope.purchaseErrorContent = "";
        $scope.purchaseErrorTitle = "";

        var lastView = $ionicHistory.backView()

        $scope.init = function() {

            $scope.purchaseErrorContent = "";
            $scope.purchaseErrorTitle = "";

        };


        $scope.returnToModulePage = function(){
            $scope.loadFeedbackForm();
            $timeout(function (){
                $state.go(lastView.stateId);
            }, 2000);
        }

        $scope.loadFeedbackForm = function(){
            window.open(Config.FEEDBACK_LINK, "_system");
        }

    }
  }
});
