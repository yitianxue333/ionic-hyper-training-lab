/**
 * Training Module Purchase Component
 * @description handles training module purchase
 * @author Sadaruwan
 * @since 04/22/17
 */
angular.module('hyper.training').directive('hyTrainingModulePurchase', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/training/components/hy-training-module-purchase.html',
    link: function (scope, element, attrbs) {

        function initStage() {

        }

        initStage();
    },
    controller: function ($scope, $stateParams, Module, Purchase, TrainingStore, Config, $rootScope, $location, $state, $timeout) {
        $scope.id = $stateParams.moduleId;
        $scope.poster = {};
        $scope.module = {};
        $scope.taxonomies = TrainingStore.getTaxonomies();
        $scope.trainers = TrainingStore.getTrainers();
        $scope.currentTrainers = {};

        $rootScope.purchaseViewBg = "";
        $scope.feedbackLink = Config.FEEDBACK_LINK;

        $scope.purchaseStatus = "none";
        $scope.purchaseErrorContent = "";
        $scope.purchaseErrorTitle = "";

        $scope.processingPayment = false;

        $scope.init = function() {
            $scope.purchaseStatus = "none";
            $scope.purchaseErrorContent = "";
            $scope.purchaseErrorTitle = "";

            Module.get($scope.id).then(function(module) {

                if(module._id && module._id != ''){
                    module.attachments.forEach(function(attachment) {
                        if(attachment.type == "thumb" && attachment.url) {
                            $scope.poster = { "background" : "url('".concat(attachment.url, "') no-repeat center top fixed #000") };
                            $rootScope.purchaseViewBg = $scope.poster;
                        }
                    });
                    module.terms = module.terms.map(function(x) { return x._id; });

                    var modules = Module.processModules([module], $scope.taxonomies, $scope.trainers);
                    $scope.module = modules.list[0];

                    $scope.currentTrainers = $scope.module.trainers.list;
                }else{
                    $state.go('app.purchaseError');
                }
            });
        };

        $scope.trainerParams = function() {
            return $scope.currentTrainers.map(function(t) { return t._id; }).join(",");
        };

        $scope.pay = function (){
            if($scope.processingPayment){
                return false;
            }else{
                $scope.processingPayment = true;
                if(ionic.Platform.isIOS()){ 

                    var result_set = {};

                    inAppPurchase
                    .getProducts([$scope.module.sku])
                    .then(function (products) {
                        
                    
                        inAppPurchase
                        .buy($scope.module.sku)
                        .then(function (data){
                
                            var params = {
                                "transactionToken": data.receipt,
                                "provider": "apple"
                            }
                            
                            Purchase.purchaseModule($scope.module._id, params).then(function (response){
                                if(response.result == 'success'){
                                    $scope.purchaseStatus = "none";
                                    $state.go('app.module', {moduleId:$scope.module._id});
                                }else if(response.result == 'failure'){
                                    $scope.purchaseStatus = "400";
                                    $scope.purchaseErrorTitle = response.message;
                                    $scope.purchaseErrorContent = (response.detail) ? response.detail : '';
                                    $scope.processingPayment = false;
                                }else{
                                    $scope.purchaseStatus = "500";
                                    $scope.purchaseErrorTitle = "";
                                    $scope.purchaseErrorContent = "";
                                    $scope.processingPayment = false;
                                }

                            });
                            
                        })
                        .catch(function (err) {
                            if(err.errorCode == 2){
                                console.log('error',err);
                                $scope.purchaseStatus = "none";
                                $scope.purchaseErrorTitle = "";
                                $scope.purchaseErrorContent = "";
                                $scope.processingPayment = false;
                            }else{
                                console.log('error',err);
                                $scope.purchaseStatus = "500";
                                $scope.purchaseErrorTitle = "";
                                $scope.purchaseErrorContent = "";
                                $scope.processingPayment = false;
                            }
                            
                        });
                        
                    })
                    .catch(function (err) {
                        console.log('error',err);
                        $scope.purchaseStatus = "500";
                        $scope.purchaseErrorTitle = "";
                        $scope.purchaseErrorContent = "";
                        $scope.processingPayment = false;
                    });

                }else if(ionic.Platform.isAndroid()){ 
                    // Load default stripe checkout
                    var handler = StripeCheckout.configure({
                        key: Config.STRIPE_PK,
                        image: $scope.module.images.thumb.url,
                        locale: 'auto',
                        token: function(token) {

                            var params = {
                                "transactionToken": token.id,
                                "provider": "stripe"
                            }

                            Purchase.purchaseModule($scope.module._id, params).then(function (response){
                                if(response.result == 'success'){
                                    $scope.purchaseStatus = "none";
                                    $state.go('app.module', {moduleId:$scope.module._id});
                                }else if(response.result == 'failure'){
                                    $scope.purchaseStatus = "400";
                                    $scope.purchaseErrorTitle = response.message;
                                    $scope.purchaseErrorContent = (response.detail) ? response.detail : '';
                                    $scope.processingPayment = false;
                                }else{
                                    $scope.purchaseStatus = "500";
                                    $scope.purchaseErrorTitle = "";
                                    $scope.purchaseErrorContent = "";
                                    $scope.processingPayment = false;
                                }

                            });

                        }
                    });

                    // Open Checkout with further options:
                    handler.open({
                        name: 'Hyper Training Lab',
                        description: 'License for '+$scope.module.title,
                        amount: ($scope.module.price) ?  parseFloat($scope.module.price)*100 : 0,
                        closed: function(){
                            $scope.processingPayment = false;
                        }
                    });

                    window.addEventListener('popstate', function() {
                        $scope.processingPayment = false;
                        handler.close();
                    });
                }
            }
        }

        $scope.returnToModulePage = function(){
            $timeout(function (){
                $state.go('app.module', {moduleId:$scope.module._id});
            }, 2000);
        }

        $scope.loadFeedbackForm = function(){
            window.open(Config.FEEDBACK_LINK, "_system");
        }

    }
  }
});
