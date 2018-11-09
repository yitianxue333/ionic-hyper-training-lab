/**
 * Deploy Service
 * @description This is a display service from ionic.io that allow us to check and install our app dynamically.
 * @author Samuel Castro
 * @since 12/23/15
 */
angular.module('hyper.core').factory('Deploy', function($ionicPopup, $ionicLoading, Alert) {

  /**
   * Instantiating a new deploy service
   * @type {Deploy|*}
   */
  var deploy = new Ionic.Deploy();

  /**
   * Updating app
   */
  function update() {
    $ionicLoading.show({
      content: 'Updating',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    deploy.update().then(function(res) {
      $ionicLoading.hide();
      console.log('Hyper Deploy: Update Success! ', res);
      Alert.showLongCenter('Hyper Deploy: Update Success! ');
    }, function(err) {
      $ionicLoading.hide();
      console.log('Hyper Deploy: Update error! ' , err);
      Alert.showLongCenter('Hyper Deploy: Update error! ' + err);
    }, function(prog) {
      console.log('Hyper Deploy: Progress... ', prog);
    });
  }

  /**
   * Checking for updates
   */
  function checkForUpdates() {
    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      console.log('Hyper Deploy: Checking for updates');
      deploy.check().then(function(hasUpdate) {
        console.log('Hyper Deploy: Update available: ' + hasUpdate);

        /**
         * Showing a confirm dialog
         */
        if(hasUpdate) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Hyper Update Available',
            template: 'A new Hyper Update is available for you. Would you like to install now?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              update();
            } else {
              console.log('You are not sure');
            }
          });
        }

      }, function(err) {
        console.error('Hyper Deploy: Unable to check for updates', err);
      });
    }
  }

  return {
    update: update,
    checkForUpdates: checkForUpdates
  };
});
