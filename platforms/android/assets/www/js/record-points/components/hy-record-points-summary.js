/**
 * Record Points Summary
 * @description this component will show summary section for record points page
 * @author Samuel Castro
 * @since 12/22/15
 */
angular.module('hyper.recordPoints').directive('hyRecordPointsSummary', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      summary: '=',
      onRecordsSave: '&'
    },
    templateUrl: 'views/record-points/components/hy-record-points-summary.html',
    controller: function ($scope, $state, $ionicModal, $ionicHistory, $timeout, $q, User, Facebook, Alert, Config) {

      $scope.activities = [];
      $scope.stats = {};
      $scope.facebookInfo = {};
      $scope.sharingSuccess = {};
      $scope.successMessage = false;
      $scope.date = Date.now();
      $scope.achievements  = [];
      $scope.share = {};
      $scope.facebookAppName = Config.FACEBOOK_APP_NAME;
      $scope.currentStats = User.getStats();
      $scope.sharePopup = {};
      /**
       * Initialize Share option modal
       */
      $ionicModal.fromTemplateUrl('views/record-points/summary-popup.html', {
        scope: $scope,
        animation: 'slide-in-up',
        width: '90%',
        height: '90%'
      }).then(function(modal) {
        $scope.summaryPopup = modal;
      });

            /**
       * Initialize Share option modal
       */
      $ionicModal.fromTemplateUrl('views/record-points/share-preview-popup.html', {
        scope: $scope,
        animation: 'slide-in-up',
        width: '90%',
        height: '90%'
      }).then(function(modal) {
        $scope.sharePopup = modal;
      });

      /**
       * Saving recordPoints
       */
      $scope.recordPoints = function() {
        if($scope.summary.activities.length > 0) {
          $scope.onRecordsSave().then(
            function(response) {
              if(response.payload && response.status.result === 'success') {
                $scope.summaryStats = response.payload.stats;
                User.setStats(response.payload.stats);
                $scope.achievements  = response.payload.achievements;
                $scope.summary.activities = [];
                $scope.facebookInfo = User.getFacebookInfo();
                $scope.summaryPopup.show();
              }
            }
          );
        }
      };

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

      $scope.showPreview = function () {
          $scope.share.userMessage = "";
          $scope.share = ($scope.achievements.length > 0 ) ? $scope.getNewBadgeObject() : $scope.getNewPointsObject();
          $scope.sharePopup.show();
      };

      $scope.shareSuccess = function() {
                                               console.log("record points summary");
          var fbInfo = User.getFacebookInfo();
                                               console.log("1");
          if(fbInfo && fbInfo.accessToken) {
                                               console.log("inside if");
            var share = $scope.share;
                                               
            Facebook.sharePointsObject(share.title, share.description, share.userMessage, share.totalPoints, share.url, share.siteName, share.imageUrl, fbInfo.accessToken).then(
              function success(response) {
                                                                                                                                                                                 console.log(response);
                $scope.successMessage = true;
                var destination = 'app.dashboard';
                $timeout(function () {
                  $scope.closePreview(); 
                  $scope.summaryPopup.remove();
                  $state.go(destination, { reload: true });
                  $scope.successMessage = false;
                }, 1000);
              }, function error(error) {
                console.log(error);
              }
            );
          } else {
                                               console.log("error");
            Alert.showLongCenter("Facebook is not connected to your profile !");
          }
      };

      $scope.getNewPointsObject = function() {
        var  totalPoints  = $scope.summary.train + $scope.summary.achieve + $scope.summary.inspire + $scope.summary.media;
        var share = {
           title : ("I just scored "+ totalPoints +" points at the Hyper Training Lab!"),
           description : "Track your martial arts training, earn rewards, compete alongside other athletes and get ranked on the worldwide leaderboards.",
           siteName : Config.PUBLIC_URL.toUpperCase(),
           imageUrl : Config.DEFAULT_POINTS_URL,
           url : Config.PUBLIC_URL,
           userMessage: $scope.sharingSuccess.description,
           totalPoints: totalPoints
        };
        return share;
      };

      $scope.getNewBadgeObject = function() {
        var totalPoints = $scope.summary.train + $scope.summary.achieve + $scope.summary.inspire + $scope.summary.media;
        var level = $scope.achievements[0].level;
        var badgeLabel = $scope.achievements[0].badge_label;
        var rankLabel = $scope.achievements[0].rank_label;

        var share = {
          title : ("I just scored " + totalPoints + " points at the Hyper Training Lab and earned " + badgeLabel +' ' + (rankLabel ? rankLabel + ' ' : '') + "level " + level),
          description : "Track your martial arts training, earn badges, compete and get ranked on our leaderboard.",
          siteName : Config.PUBLIC_URL.toUpperCase(),
          imageUrl: $scope.achievements[0].urls.share,
          url: Config.PUBLIC_URL,
          userMessage: $scope.sharingSuccess.description,
          totalPoints: totalPoints
        }

        return share
      };

      $scope.closeSummary = function() {
        closeSummary();
      };

      $scope.closePreview = function() {
        $scope.sharePopup.hide();
      };

      $scope.skipShare = function(destination) {
        closeSummary(destination);
      }

      function closeSummary(destination) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $scope.summaryPopup.remove();
        $state.go(destination, { reload: true });
      }
    }
  }
});
