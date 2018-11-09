/**
 * Training Module Profile Compoenent
 * @description handles training module profile display
 * @author Kanchana Yapa
 * @since 09/29/16
 */
angular.module('hyper.training').directive('hyTrainingModuleProfile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/training/components/hy-training-module-profile.html',
    link: function (scope, element, attrbs) {

        function initStage() {
            if(scope.player && scope.player.remove){
                scope.player.remove();
            }

            var getTemplate = function (playerId) {
                return '<div id="' + playerId + '"></div>';
            };

            var playerElement = angular.element(document.getElementById("playerContent"));
            playerElement.html(getTemplate(scope.playerId));
            $compile(playerElement.contents())(scope);
        }

        initStage();
    },
    controller: function ($scope, $stateParams, $rootScope, $ionicHistory, Module, TrainingStore) {
        $scope.id = $stateParams.moduleId;
        $scope.poster = {};
        $scope.module = {};
        $scope.taxonomies = TrainingStore.getTaxonomies();
        $scope.trainers = TrainingStore.getTrainers();
        $scope.currentTrainers = {};
        $scope.playList = [];
        $scope.player = null;
        $scope.playerId = "videoPlayer";
        $scope.playedIndex = null;
        $scope.setPlaylist = false;


        //var lastView = $ionicHistory.backView()
        //if(lastView.stateId == "app.myLibrary"){
        //    $rootScope.$ionicGoBack = $rootScope.oldSoftBack;
        //}

        function getPlaylist(module) {
            var playlist = [];
            module.videoGroups.list.forEach(function(group) {
                if(group.status !== "disable") {
                    group.videos.forEach(function(video) {
                        playlist.push({
                            mediaid: video._id,
                            title: video.title,
                            file: video.url,
                            locked: video.locked,
                            image: module && module.images && module.images.poster ? module.images.poster.url : ""
                        });
                    });
                }
            });
            
            return playlist;
        }

        function initPlayer() {
            $scope.player = jwplayer($scope.playerId);
            $scope.player.setup({
                "autoplay": false,
                "playlist": $scope.playList,
                "width" : "94%"
            });

            $scope.player.on('fullscreen', function(data) {

                if(data.fullscreen) {
                    if(screen && screen.unlockOrientation)
                        screen.unlockOrientation();
                } else {
                    if(screen && screen.lockOrientation)
                        screen.lockOrientation('portrait');
                        
                    $scope.player.stop();
                }
            });

            $scope.player.on('error',function(data) {
                screen.lockOrientation('portrait');
            });
        }

        function initJWPlayer() {
          var converted = [];
           $scope.playList.forEach(function(item, index) {
               converted.push({
                              "sources" : [{
                                           "file" : item.file
                                           }],
                              "title" : item.title,
                              "image" : item.image,
                              "mediaid" : item.mediaid
                 });
            });

            try{                           
                cordova.plugins.CordovaJWPlayer.setup({ autostart: false, onlyFullScreen : true }, converted , function(result) {                                           
                    cordova.plugins.CordovaJWPlayer.setPlaylist(converted, function(success) {
                        console.log("Update playlist");
                    });
                }, function(error) {
                    console.log(error);
                });
            }catch(e) {
                console.log(e);
            }

        }


        $scope.init = function() {
            Module.get($scope.id).then(function(module) {
                module.attachments.forEach(function(attachment) {
                    if(attachment.type == "thumb" && attachment.url) {
                        $scope.poster = { "background-image" : "url('".concat(attachment.url, "')") };                        
                    }
                });
                module.terms = module.terms.map(function(x) { return x._id; });

                var modules = Module.processModules([module], $scope.taxonomies, $scope.trainers);
                $scope.module = modules.list[0];
                $scope.playList = getPlaylist($scope.module);            
                $scope.currentTrainers = $scope.module.trainers.list;
                
                initJWPlayer();
            });
        };



        $scope.play = function(video) {


            $scope.playList.forEach(function(item, index) {
                if(video._id == item.mediaid) {
                    $scope.playedIndex = index;
                }
            });

           // alert("module profile");
                   screen.orientation.lock("landscape-primary");

            
            cordova.plugins.CordovaJWPlayer.play($scope.playedIndex);
        };

        $scope.trainerParams = function() {
            return $scope.currentTrainers.map(function(t) { return t._id; }).join(",");
        };
    }
  }
});
