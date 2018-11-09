/**
 * Share media options dialog
 * @description this components provides options for media sharing
 * @author Kanchana Yapa
 * @since 12/21/15
 */
angular.module('hyper.recordPoints').directive('hyShareOptions', function() {
  return {
    restrict: 'A',
    replace: false,
    controller: function ($scope, $sce, $q, $timeout, Facebook, User, Alert) {

      $scope.progress = {
        message : "",
        percentage: null,
        complete: false
      };

      $scope.facebookInfo = {};

      $scope.previewVideoUrl = "";
      $scope.previewVideoMime = "";

      /**
       * Show controls on tap
       */
      $scope.handleControls = function() {
        var video = document.getElementById("shareVideo");
        if(ionic.Platform.isAndroid() && (ionic.Platform.version() < 5.0) ) {
          NativeVideoPlayer.play($scope.previewVideoUrl);
        } else {
          if (video.hasAttribute("controls")) {
              video.removeAttribute("controls");
              video.pause();
          } else {
              video.setAttribute("controls", "controls");
              video.play();
          }
        }
      };

      /**
       * Initialize options
       */
      function init() {

        //Init Facebook Creds
        $scope.facebookInfo = User.getFacebookInfo();

        //init media paths
        if($scope.shareMedia) {
          Facebook.reolveFilePath($scope.shareMedia, function(fileEntry) {
            fileEntry.file(function(file) {
              $scope.previewVideoMime = file.type;
              $scope.previewVideoUrl = fileEntry.nativeURL;
            });
          });
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

      /**
       *  Make url secure
       */
      $scope.getSecureResource = function(shareMedia) {
        return $sce.trustAsResourceUrl(shareMedia);
      };

      $scope.shareFBMedia = function() {
        var fbInfo = User.getFacebookInfo();
        var sharePromise = {};

        if(!fbInfo || !fbInfo.accessToken) {
          Alert.showLongCenter("Your account is not connected with Facebook! please connect to share with facebook");
          return;
        }

        if($scope.mediaType === "image") {
          showProgress("Sharing image on facebook...", "");
          sharePromise = shareFBPhoto(fbInfo);
        } else if ($scope.mediaType === "video") {
          showProgress("Sharing video on facebook...", "");
          sharePromise = shareFBVideo(fbInfo);
        }

        sharePromise.then(function success(response) {
          setMedia(response, "facebook");
          $scope.progress.message = "SUCCESSFULLY SHARED";
          $scope.progress.percentage = "";
          $timeout(function() {
            hideProgress();
            $scope.closeShare();
            
          }, 500);
        }, function fail(error) {
            Alert.showLongCenter("Failed to share on Facebook !")
        });
      };

      $scope.closeShare = function() {
        $scope.modalShareOptions.remove();
      };

      /**
       * Save the options user has selected
       */
      function setMedia(response, socialType) {
          for(var x=0; x < $scope.activities.length; x++ )  {
              if($scope.activities[x].name == $scope.mediaType) {
                $scope.activities[x].media = {
                  "channel": "facebook",
                  "id": response.id,
                  "title": $scope.share.title,
                  "desc": $scope.share.description
                };
                $scope.activities[x].selected = true;
              }
          }
      }

      function shareFBPhoto(fbInfo) {
        var shareDiffered = $q.defer();
        var caption = $scope.share.description ? $scope.share.description : "";
        Facebook.sharePhoto($scope.shareMedia, caption, fbInfo.accessToken).then(function(response) {
          shareDiffered.resolve(response);
        }, function(error) {
          shareDiffered.reject(error);
        });

        return shareDiffered.promise;
      }

      function shareFBVideo(fbInfo) {
        var shareDiffered = $q.defer();
        var title = $scope.share.title ? $scope.share.title : "";
        var description = $scope.share.description ? $scope.share.description : "";
        Facebook.shareVideo($scope.shareMedia, title, description, fbInfo.accessToken).then(function(response) {
          shareDiffered.resolve(response);
        }, function (error) {
          shareDiffered.reject(error);
        }, function(update) {
          console.log(update);
          
          if(update.message) {
            showProgress(update.message, "");
          } else {
            if(update.loaded > 0 && update.total > 0) {
              showProgress("Sharing video on facebook...", Math.floor((update.loaded/update.total)*100) + " %" );
            } else {
              showProgress("Sharing video on facebook...");
            }
          }
        });

        return shareDiffered.promise;
      }

      /**
       *
       */
      function getDetails() {
        $scope.retry = false;
        Facebook.getPostDetails($scope.postId, "source,picture", User.getFacebookInfo().accessToken).then(function(response) {
          var media = (response.data) ? { thumb_url : response.data.picture, media_url: response.data.source } : { };
          setMedia(media, "facebook");
          hideProgress();
        }, function(response) {
          if(response && response.message === "Information retreival timed out") {
            $scope.postId = response.data.id;
            $scope.progress.retry = true;
          }
        }, function(update) {
          showProgress(update.message, "");
        });
      }

      function showProgress(message, percentage) {
        $scope.progress.message = message;
        $scope.progress.percentage = percentage;
      }

      function hideProgress() {
        $scope.progress.message = "";
        $scope.progress.percentage = "";
        $scope.progress.complete = true;
      }

      init();
    }
  }
});
