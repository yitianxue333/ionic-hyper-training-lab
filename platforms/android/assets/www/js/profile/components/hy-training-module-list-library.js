/**
 * Training Module List - My Library
 * @description handles profile module - my library
 * @author Sadaruwan
 * @since 05/01/17
 */
angular.module('hyper.profile').directive('hyTrainingModuleListLibrary', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
        modules : "=",
        paging : "=",
    },
    templateUrl: 'views/profile/components/hy-training-module-list-library.html',
    controller: function ($scope, Purchase, $timeout) {


      $scope.restored = false;
      $scope.restoreError = false;
      $scope.errorMessage = "";
      $scope.showNoModules = true;
      $scope.restoreOnProgress = false;
      $scope.isPlatformIOS = ionic.Platform.isIOS();

      $scope.restoreProduct = function (){

          if($scope.restoreOnProgress){
                //console.log('** processing **');
                $scope.restoreError = false;
                $scope.errorMessage = "";
                return false;
          }else{

                if(ionic.Platform.isIOS()){

                    inAppPurchase
                    .restorePurchases()
                    .then(function (data) {
                        
                        inAppPurchase
                        .getReceipt()
                        .then(function (receipt) {
                            var params = {
                                "recoveryToken": receipt,
                                "provider": "apple",
                                "recoveryProducts": data
                            }

                            Purchase.purchaseModuleVerify(params).then(function (response){
                                //console.log('*** success restore *** '+ JSON.stringify(response));
                                if(response){
                                    $scope.restored = true;
                                    $scope.showNoModules = false;
                                    $timeout(function (){
                                        $scope.restoreOnProgress = true;
                                        window.location.reload();
                                    }, 1500);
                                }
                            
                            });
                        })
                        .catch(function (err) {
                            $scope.restoreOnProgress = false;
                            if(err.errorCode != 2){
                                $scope.restoreError = true;
                                $scope.errorMessage = err.message;
                            }else{
                                $scope.restoreError = false;
                                $scope.errorMessage = "";
                            }
                            //console.log('*** restore not working ***', JSON.stringify(err));
                        });

                    })
                    .catch(function (err) {
                        $scope.restoreOnProgress = false;
                        if(err.errorCode != 2){
                            $scope.restoreError = true;
                            $scope.errorMessage = err.message;
                        }else{
                            $scope.restoreError = false;
                            $scope.errorMessage = "";
                        }
                        //console.log('*** restore error ***', JSON.stringify(err));
                    });

                            
                }
          }
      }

    }
  }
});
