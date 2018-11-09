/**
 * Camera Service
 * @description This is a $cordovaCamera service wrapper
 * @moreInfo http://ngcordova.com/docs/plugins/camera/
 * @author Samuel Castro
 * @since 12/19/15
 */
angular.module('hyper.recordPoints').factory('Camera', function($cordovaCamera, $q) {

  /**
   * Getting picture options based on source type
   * @param sourceType
   * @returns {{quality: number, destinationType: number, sourceType: *, allowEdit: boolean, encodingType: number, targetWidth: number, targetHeight: number, popoverOptions: CameraPopoverOptions, saveToPhotoAlbum: boolean}}
     */
  function getMediaFromSourceType(sourceType, mediaType, destinationType, allowEdit) {
    return {
      quality: 50,
      destinationType: destinationType,
      sourceType: sourceType,
      mediaType : mediaType,
      allowEdit: allowEdit,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }
  }

  /**
   * Opening the native photo library
   */
  function getPictureFromPhotoLibrary(destinationType) {
    var defer = $q.defer();
    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      var destination = (destinationType === "FILE_URI") ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL;
      var options = getMediaFromSourceType(Camera.PictureSourceType.PHOTOLIBRARY, Camera.MediaType.PICTURE, destination, false);
      return $cordovaCamera.getPicture(options);
    } else {
      defer.reject('CAMERA_SERVICE: Unsupported platform');
      return defer.promise;
    }
  }

  /**
   * Opening the device native camera
   */
  function getPictureFromCamera(destinationType) {
    var defer = $q.defer();
    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      var destination = (destinationType === "FILE_URI") ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL;
      var options = getMediaFromSourceType(Camera.PictureSourceType.CAMERA, Camera.MediaType.PICTURE, destination, false);
      return $cordovaCamera.getPicture(options);
    } else {
      defer.reject('CAMERA_SERVICE: Unsupported platform');
      return defer.promise;
    }
  }

  /**
   * Opening the native photo library
   */
  function getVideoFromPhotoLibrary(destinationType) {
    var defer = $q.defer();
    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      var destination = (destinationType === "FILE_URI") ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL;
      var options = getMediaFromSourceType(Camera.PictureSourceType.PHOTOLIBRARY, Camera.MediaType.VIDEO, destination, true);
      return $cordovaCamera.getPicture(options);
    } else {
      defer.reject('CAMERA_SERVICE: Unsupported platform');
      return defer.promise;
    }
  }

  return {
    getPictureFromPhotoLibrary: getPictureFromPhotoLibrary,
    getPictureFromCamera: getPictureFromCamera,
    getVideoFromPhotoLibrary: getVideoFromPhotoLibrary
  };
});
