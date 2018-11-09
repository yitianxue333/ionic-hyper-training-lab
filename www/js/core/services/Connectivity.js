/**
 * Connectivity Service
 * @description handles network connectivity alerts
 * @author Kanchana Yapa
 * @since 02/12/16
 */
angular.module('hyper.core').factory('Connectivity', function($resource, $state, $window, Config, $ionicPopup, $ionicLoading, Alert) {


  /**
   * Register users attachment with the training API
   **/
  function isConnected() {
     //   if(!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
     if(navigator && navigator.connection && navigator.connection.type) {
        var networkState = navigator.connection.type;
        return (networkState !== Connection.NONE);
     } else {
         return true;
     }
  }

  function setUpConnectionLosDetection() {
    function onOffline() {
        checkConnection();
    }
    document.addEventListener("offline", onOffline, false);
  }

  function checkConnection() {
    if(!isConnected()) {
        var myPopup = $ionicPopup.show({
            template: 'Hyper training lab requires a valid internet connection to proceed! Please connect to internet and press ok',
            title: 'Connectivity Alert',
            subTitle: 'No internet connection detected',
            buttons: [
                {
                    text: 'OK',
                    type: 'button button-block large-button-font button-black',
                    onTap: function(e) {
                        e.preventDefault();
                        if(isConnected()) {
                            myPopup.close();
                            $window.location.reload(true);
                        }
                    }
                }
            ]
        });
    }
  }

  return {
    checkConnection: checkConnection,
    setUpConnectionLosDetection: setUpConnectionLosDetection
  };
});
