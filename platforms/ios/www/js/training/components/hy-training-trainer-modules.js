/**
 * Training Trainer Modules Compoenent
 * @description handles trainers modules
 * @author Kanchana Yapa
 * @since 09/27/16
 */
angular.module('hyper.training').directive('hyTrainingTrainerModules', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      settings : "="
    },
    templateUrl: 'views/training/components/hy-training-trainer-modules.html',
    controller: function ($scope, $rootScope, $state, $timeout, $stateParams, $sce, $ionicScrollDelegate, TrainingStore, TrainerModule, Module) {
      $scope.trainerIds = $stateParams.trainerId.split(",");
      $scope.trainers = [];
      $scope.moduleCount = 0;
      $scope.videoCount = 0;
      $scope.modules = {};
      $scope.intro = [];
      $scope.workout = [];
      $scope.playLists = {};
      $scope.loadingList = false;

      $scope.$watch('settings.active_tab', function() {
        $ionicScrollDelegate.scrollTop();
      });

      $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
      }

      $scope.init = function() {
        $scope.settings.noBio = false;
        $scope.trainerIds.forEach(function(id) {
          $scope.trainers.push(TrainingStore.getTrainers().index[id]);
        });

        if(($scope.trainers && $scope.trainers[0] && $scope.trainers[0].desc && $scope.trainers[0].desc.length > 0) == false) {
          $scope.settings.noBio = true;
        } else {
           var content = String($scope.trainers[0].desc).replace(/<[^>]+>/gm, ''); 
           if(!content || content.length == 0)
               $scope.settings.noBio = true;
        }

        TrainerModule.getModuleListByTrainers($scope.trainers.map(function(t) { 
          return t._id; 
        }))
        .then(function(modules) {
            $scope.modules = Module.processModules(modules, TrainingStore.getTaxonomies(), TrainingStore.getTrainers(), null, ["intro", "workout"]);
            $scope.intro = Module.processModules(modules, TrainingStore.getTaxonomies(), TrainingStore.getTrainers(), ["intro"]);
            $scope.workout = Module.processModules(modules, TrainingStore.getTaxonomies(), TrainingStore.getTrainers(), ["workout"]);
            $scope.videoCount = $scope.modules.videoCount + $scope.intro.videoCount + $scope.workout.videoCount;
            $scope.moduleCount = $scope.modules.list.length + $scope.intro.list.length + $scope.workout.list.length;
        });
      };

      $scope.play = function(module, video, type) {
        console.log("playing");
        console.log("module"+module);
        console.log("video"+video);
        if(!$scope.loadingList) {
          $scope.loadingList  = true;
           loadandPlayModule(module, video);
        }
      };

      function loadandPlayModule(module, video) {
        try {
          if(!$scope.playLists[module._id]) {
            Module.get(module._id).then(function(module) {
                module.attachments.forEach(function(attachment) {
                    if(attachment.type == "thumb" && attachment.url) {
                        $scope.poster = { "background-image" : "url('".concat(attachment.url, "')") };                        
                    }
                });
                module.terms = module.terms.map(function(x) { return x._id; });
                var modules = Module.processModules([module], TrainingStore.getTaxonomies(), TrainingStore.getTrainers());
                var playList = getPlaylist(modules.list[0]); 
                console.log("PLAYLIST", playList);
                $scope.playLists[module._id] = playList;
                $scope.loadingList = false;                
                initJWPlayer(playList, video);
            }).catch(function(e) {
              $scope.loadingList = false;
            });
          } else {
            initJWPlayer($scope.playLists[module._id], video);
            $scope.loadingList = false;   
          }
        }catch(e) {
          $scope.loadingList = false;   
          console.log(e);
        }
      }

      function initJWPlayer(playList, video) {
        console.log("initJWPlayer");
        var converted = [];
        playList.forEach(function(item, index) {
            converted.push({
                    "sources" : [{
                                  "file" : item.file
                                  }],
                    "title" : item.title,
                    "image" : item.image,
                           "width":"50%",
                    "mediaid" : item.mediaid
            });
        });

        try {                                 
          cordova.plugins.CordovaJWPlayer.setup({ autostart: true, onlyFullScreen : true}, converted , function(result) {
                                                console.log("in setup");
                                                
              cordova.plugins.CordovaJWPlayer.setPlaylist(converted, function(success) {
                  executePlay(playList, video);
              });
          }, function(error) {
              console.log(error);
          });
        } catch(e) {
          console.log(e);
        }
      }

      function getPlaylist(module) {
          var playlist = [];
          module.videoGroups.list.forEach(function(group) {
              group.videos.forEach(function(video) {
                  playlist.push({
                      mediaid: video._id,
                      title: video.title,
                      file: video.url,
                      image: module && module.images && module.images.poster ? module.images.poster.url : ""
                  });
              });
          });
          
          return playlist;
      }

      function executePlay(playList, video) {
        var playedIndex = 0;
        playList.forEach(function(item, index) {
            if(video._id == item.mediaid) {
                playedIndex = index;
            }
        });
        
        try {
          console.log("play video");

        screen.orientation.lock("landscape-primary");
          cordova.plugins.CordovaJWPlayer.play(playedIndex);
        } catch(e) {
          console.log(e);
        }
      };
    }
  }
});
