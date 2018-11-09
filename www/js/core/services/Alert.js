/**
 * Toast Component
 * @description The Toast component will show a default toast alert
 * @moreInfo http://ngcordova.com/docs/plugins/toast/
 * @author Samuel Castro
 * @since 12/3/15
 */
angular.module('hyper.core').factory('Alert', function($injector) {

  /**
   * Default show method
   * @param message
   * @param duration
   * @param position
     */
  function show(message, duration, position) {
    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      $injector.get('$cordovaToast')
        .show(message, duration, position)
        .then(function(success) {
          // success
        }, function (error) {
          alert('A error occurred on Toast plugin ' + error);
        });
    } else {
      alert(message);
    }
  }

  return {
    showShortTop: function(message) {
      show(message, 'short', 'top');
    },
    showShortCenter: function(message) {
      show(message, 'short', 'center')
    },
    showShortBottom: function(message) {
      show(message, 'short', 'center')
    },
    showLongTop: function(message) {
      show(message, 'long', 'top')
    },
    showLongCenter: function(message) {
      show(message, 'long', 'center')
    },
    showLongBottom: function(message) {
      show(message, 'long', 'bottom')
    }
  };
});
