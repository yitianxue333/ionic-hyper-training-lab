angular.module('hyper.badges').directive('hyBadgesInfo', function() {
                                         return {
                                         restrict: 'E',
                                         replace: true,
                                         templateUrl: 'views/badges/components/hy-badges-info.html',
                                         controller: function ($scope, $ionicModal, $timeout, User, Activity, Facebook, Alert, Config) {
                                         $scope.badges = [];
                                         $scope.currentBadge = {};
                                         $scope.facebookInfo = {};
                                         $scope.successMessage = false;
                                         $scope.currentBadge.ranked = true;
                                         $scope.share = {};
                                         $scope.facebookAppName = Config.FACEBOOK_APP_NAME;
                                         $scope.ranked = true;
                                         /**
                                          * Initialize Share option modal
                                          */
                                         $ionicModal.fromTemplateUrl('views/record-points/share-preview-popup.html', {
                                                                     scope: $scope,
                                                                     animation: 'slide-in-up',
                                                                     width: '90%',
                                                                     height: '90%'
                                                                     }).then(function(modal) {
                                                                             $scope.previewPopup = modal;
                                                                             });
                                         
                                         //Load badges intially
                                         Activity.getBadges().then(function(response) {
                                                                console.log("amswrer"+"dewbfewf");
                                                                   if(response.status && response.status.result === "success") {
                                                                   $scope.badges = response.payload;
                                                                   if(response.payload.length > 0) setCurrentBadge(0);
                                                                   $scope.ranked = false;
                                                                   $scope.badges.forEach(function(badge) {
                                                                                         if(badge.ranked) $scope.ranked = true;
                                                                                         });
                                                                   }
                                                                   $scope.facebookInfo = User.getFacebookInfo();
                                                                   });
                                         
                                         $scope.showPreview = function() {
                                         if($scope.currentBadge && ($scope.currentBadge.ranks.length > 0) && $scope.currentBadge.urls.png) {
                                         $scope.share = getNewBadgeObject();
                                         $scope.previewPopup.show();
                                         }
                                         };
                                         
                                         /**
                                          * Share the current badge
                                          **/
                                         $scope.shareSuccess = function() {
                                         console.log("share success");
                                         var fbInfo = User.getFacebookInfo();
                                         if($scope.currentBadge && ($scope.currentBadge.ranks.length > 0) && $scope.currentBadge.urls.png) {
                                         $scope.share = getNewBadgeObject();
                                         if(fbInfo && fbInfo.accessToken) {
                                         var share = $scope.share;
                                         Facebook.shareBadgeObject(share.title, share.description, share.url, share.siteName, share.imageUrl, fbInfo.accessToken).then(function(response) {
                                                                                                                                                                       if(response.statusText ==  "OK") {
                                                                                                                                                                       $scope.successMessage = true;
                                                                                                                                                                       $timeout(function() {
                                                                                                                                                                                $scope.successMessage = false;
                                                                                                                                                                                $scope.modalBadgeInfo.remove();
                                                                                                                                                                                }, 3000);
                                                                                                                                                                       }
                                                                                                                                                                       }, function(error) {
                                                                                                                                                                       console.log(error);
                                                                                                                                                                       });
                                         } else {
                                         Alert.showLongCenter("Your profile is not connected to Facebook! Please connect the profile to share images !");
                                         }
                                         } else {
                                         Alert.showLongCenter("Current badge does not contain any shairable information !");
                                         }
                                         };
                                         
                                         /**
                                          * Show info popup
                                          **/
                                         $scope.showInfo = function(index) {
                                         alert("vnfjvd");
                                         console.log("show info");
                                         setCurrentBadge(index);
                                         $ionicModal.fromTemplateUrl('views/badges/components/hy-badge-info.html', {
                                                                     scope: $scope,
                                                                     animation: 'slide-in-up',
                                                                     width: '90%',
                                                                     height: '90%'
                                                                     }).then(function(modal) {
                                                                             $scope.modalBadgeInfo = modal;
                                                                             if (window.StatusBar)
                                                                             StatusBar.styleBlackTranslucent();
                                                                             
                                                                             $scope.modalBadgeInfo.show();
                                                                             });
                                         };
                                         
                                         $scope.$on('modal.hidden', function() {
                                                    if (window.StatusBar)StatusBar.styleDefault();
                                                    });
                                         
                                         $scope.$on('modal.removed', function() {
                                                    if (window.StatusBar)StatusBar.styleDefault();
                                                    });
                                         
                                         /**
                                          * Connect to facebook if not connected
                                          */
                                         $scope.connectFacebook = function() {
                                         Facebook.connect().then(function success(response) {
                                                                 $scope.facebookInfo = User.getFacebookInfo();
                                                                 }, function fail(error) {
                                                                 Alert.showLongCenter("Failed to connect to Facebook");
                                                                 });
                                         };
                                         
                                         function getNewBadgeObject() {
                                         var share = {
                                         title : ("I've achieved the " + $scope.currentBadge.label +" "+ ($scope.currentBadge.rank_label ? $scope.currentBadge.rank_label+' ' : '')  +"Badge level " + $scope.currentBadge.level + " at the Hyper Training Lab!") ,
                                         description : "Track your martial arts training, earn rewards, compete alongside other athletes and get ranked on the worldwide leaderboards.",
                                         siteName: Config.PUBLIC_URL.toUpperCase(),
                                         imageUrl: $scope.currentBadge.urls.share,
                                         url: Config.PUBLIC_URL
                                         };
                                         
                                         return share;
                                         }
                                         
                                         var setCurrentBadge = function(index) {
                                         var currentBadge = $scope.badges[index];
                                         $scope.currentBadge = currentBadge;
                                         };
                                         
                                         var groupLevels = function(levels, size) {
                                         var arr = angular.copy(levels);
                                         var out = [],i = 0, n= Math.ceil((arr.length)/size);
                                         while(i < n) {
                                         out.push(arr.splice(0, (i==n-1) && size < arr.length ? arr.length: size));
                                         i++;
                                         }
                                         arr = null;
                                         return out;
                                         };
                                         }
                                         }
});
