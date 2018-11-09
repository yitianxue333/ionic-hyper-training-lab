/**
 * Notification Service
 * @description This service handles the notifications
 * @author Kanchana Yapa
 * @since 28/07/16
 */
angular.module('hyper.core').factory('Notification', function($resource,$state, $q, $ionicModal, $ionicPopup, Attachment) {

  var scope = {};

  function init($scope) {
    scope = $scope;
  }

  function process(payload) {
    if(payload.type) {
      switch (payload.type) {
        case "mindset":
          handleMindset(payload);
          break;
        default:
          // do nothing
      }
    } else {
      $state.go('app.dashboard', { reload: true });
    }
  }

  function handleMindset(payload) {
    if(!payload.wasTapped && payload.message) {
      var myPopup = $ionicPopup.show({
        template: payload.message,
        title: 'Notification',
        scope: scope,
        cssClass: "notification-popup",
        buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Show</b>',
              type: 'button-positive',
              onTap: function(e) {
                loadAttachment(payload);
              }
            }
          ]
        });
    } else {
      loadAttachment(payload);
    }
  }

  function loadAttachment(payload) {
    Attachment.getAttachment({ id : payload.target } ).then(function(result) {
      if(result.path) {
        scope.attachment = result;
        isImage(result.path).then(function(test) {
          if(test) {
            $ionicModal.fromTemplateUrl('views/core/components/hy-attachment-modal.html', {
              scope: scope, animation: 'slide-in-up', width: '90%', height: '90%'
            }).then(function(modal) {
              scope.attachmentModal = modal;
              scope.attachmentModal.show();
            });
          } else {
            $state.go('app.dashboard', { reload: true });
          }
        });
      }
    }, function(error) {
      $state.go('app.dashboard', { reload: true });
    });
  }

  function isImage(src) {
    var deferred = $q.defer();

    var image = new Image();
    image.onerror = function() {
        deferred.resolve(false);
    };
    image.onload = function() {
        deferred.resolve(true);
    };
    image.src = src;

    return deferred.promise;
  }

  return {
    init : init,
    process: process
  };
});
