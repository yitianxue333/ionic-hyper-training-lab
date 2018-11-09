/**
 * Sharing Media
 * @description this components will show the user record points
 * @author Samuel Castro
 * @since 12/16/15
 */
angular.module('hyper.recordPoints').directive('hyShareMedia', function() {
  return {
    restrict: 'E',
    replace: false,
    template: '',
    controller: function ($scope, $q, $ionicModal, Alert, Camera, User, Facebook) {
      $scope.isMedia = function(activity) {
        return activity.type == "media";
      };

      /**
       * Initialize Share option modal
       */
      function openShareOptions() {
        $ionicModal.fromTemplateUrl('views/record-points/components/hy-share-options.html', {
          scope: $scope,
          animation: 'slide-in-up',
          width: '90%',
          height: '90%'
        }).then(function(modal) {
          $scope.modalShareOptions = modal;
          $scope.modalShareOptions.show();
        });
      }

      $scope.cancelSharing = function(media) {
        for(var x = 0; x < $scope.activities.length; x++) {
          if($scope.activities[x].name == media && $scope.data.activities[x].media) {
            delete $scope.activities[x].media;
            $scope.activities[x].selected = false;
          }
        }
      };

      $scope.checkPermissions = function() {
        var info = $q.defer();
        var fbInfo = User.getFacebookInfo();
        if(fbInfo && fbInfo.accessToken) {
          var granted = false;
          Facebook.getPermissions(fbInfo.accessToken).then(function (response) {
            var permissions = response.data.data;
            for(var x=0; x < permissions.length; x++) {
              if(permissions[x].permission == "publish_actions" && permissions[x].status == "granted") {
                granted = true;
              }
            }
            info.resolve( { hasPublishPermission : granted , hasConnected : true});
          }, function(error) {
            info.reject(error);
          });
        } else {
            info.resolve( { hasPublishPermission : false , hasConnected : false});
        }

        return info.promise;
      }

      /**
       * Opening the native photo library
       */
      $scope.openPhotoLibrary = function(activity) {
        Camera.getPictureFromPhotoLibrary("FILE_URI").then(function(imageURI) {
          $scope.shareMedia = imageURI;
          $scope.mediaType = "image";
          $scope.share = {};
          openShareOptions();
          console.log('UPLOADING ' + $scope.shareMedia);
        }, function(err) {
          Alert.showLongCenter(err);
        });
      };

      /**
       * Opening the native video library
       */
      $scope.openVideoLibrary = function(activity) {
        Camera.getVideoFromPhotoLibrary("FILE_URI").then(function(videoURI) {
          $scope.shareMedia = videoURI;
          $scope.mediaType = "video";
          $scope.share = {};

          openShareOptions();
          console.log('UPLOADING ' + $scope.shareMedia);
        }, function(err) {
          Alert.showLongCenter(err);
        });
      };
    }
  }
});
