/**
 * Training Modules Search Compoenent
 * @description this component will show a list of modules
 * @author Kanchana Yapa
 * @since 09/21/16
 */
angular.module('hyper.training').directive('hyTrainingModulesSearch', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/training/components/hy-training-modules-search.html',
    controller: function ($scope, $ionicModal, $state, $ionicScrollDelegate, $stateParams, Module, TrainingStore, _) {
      $scope.filters = [
        {
          name: 'division',
          term: null
        },
        {
          name: 'style',
          term: null
        },
        {
          name: 'level',
          term: null
        }
      ];

      $scope.paging = {
        limit:200,
        skip: 0,
        total: 0,
        loaded: 0
      };

      $scope.filterModal;
      $scope.taxonomies = TrainingStore.getTaxonomies();
      $scope.trainers = TrainingStore.getTrainers();
      $scope.modules = [];
      $scope.filterCount = 0;

      $scope.showFilters = function() {
        $scope.filterModal.show();
      }

      $scope.closeFilters = function() {
        $scope.filterModal.hide();
      }

      /**
       * Initialize filter option modal
       */
      $ionicModal.fromTemplateUrl('views/training/components/hy-training-modules-search-filters.html', {
        scope: $scope,
        animation: 'slide-in-up',
        width: '90%',
        height: '90%'
      }).then(function(modal) {
        $scope.filterModal = modal;
      });



      function loadModules() {
        var terms = [];
        $scope.filters.forEach(function(filter)  { 
            if(filter.term !== null) terms.push(filter.term._id);
        });

        $scope.filterCount = terms.length;
        
        var query = terms.length > 0 ?  { terms : terms.join(",") } : {};

        if($scope.paging.skip) {
          query['$skip'] = $scope.paging.skip;
        }

        if($scope.paging.limit) {
          query['$limit'] = $scope.paging.limit;
        }

        Module.getModuleList(query)
        .then(function(modules){
          
          var modulesProcessed = Module.processModules(modules.data, $scope.taxonomies, $scope.trainers, null, ["intro"]);
          //$scope.paging.limit = modules.limit;
          $scope.paging.skip = modules.skip;
          $scope.paging.total = modules.total;
          if($scope.paging.skip > 0) {
            modulesProcessed.list.forEach(function(item) {
              $scope.modules.list.push(item);
            });

          } else {
            $scope.modules = modulesProcessed;
          }

          $scope.paging.loaded = $scope.modules.list.length;

        });
      }

      $scope.init = function() {
        if($stateParams.query && angular.isArray($stateParams.query)) {
          $stateParams.query.forEach(function(item) {
            if(item.name && item.value && item.value.term && item.value.term._id)
              $scope.setFilter(item.name, item.value.term._id, true);
          });
        }

        loadModules();
      }

      $scope.setFilter = function(filterName, termId, reload) {
        $scope.taxonomies.by_name[filterName].terms.list.forEach(function(term) {
          if(term._id === termId) {
            if(term.selected) {
              delete term.selected;
              $scope.filters.forEach(function(filter)  { 
                if(filter.name === filterName) filter.term = null;
              }); 
            } else {
              term.selected = true;
              $scope.filters.forEach(function(filter)  { 
                if(filter.name === filterName) {
                  filter.term = term;
                  filter.show = true;
                }
              });
            }
          } else {
            delete term.selected;
          }
        });

        if(filterName == 'division'){
          $scope.filters[1].term = null;
          $scope.taxonomies.by_name['style'].terms.list.forEach(function(term) {
            delete term.selected;
          });
          
        }

        if(reload) {
          resetPaging();
          loadModules();
          updateState();
        }
      }

      $scope.isStyleInDivision = function(filter, term_id){
        
        if(!($scope.taxonomies.by_name[filter.name] && $scope.taxonomies.by_name[filter.name].terms && $scope.taxonomies.by_name[filter.name].terms.list)) {
          return false
        }

        if(filter.name == 'style' && $scope.isGroupShown(filter)){
          var selectedDevision = null;
            $scope.taxonomies.by_name["division"].terms.list.forEach(function(term) {
              if(term.selected)
              selectedDevision = term;
            });

            if(selectedDevision && selectedDevision.terms){
              return selectedDevision.terms.indexOf(term_id) !== -1;
            }else{
              return $scope.isGroupShown(filter);
            }
        }else{
          return $scope.isGroupShown(filter);
        }
      }

      $scope.loadMore = function() {
        $scope.paging.skip = $scope.paging.skip + $scope.paging.limit;
        loadModules();
      }

      $scope.resetFilters = function() {
        $scope.filters.forEach(function(filter)  { 
          filter.term = null;

          $scope.taxonomies.by_name[filter.name].terms.list.forEach(function(term) {
            delete term.selected;
          });
        }); 
        resetPaging();
        loadModules();
        updateState();
      }

      function resetPaging() {
        $scope.paging = {
          limit:200,
          skip: 0,
          total: 0,
          loaded: 0
        };
      }

      function updateState() {
        var query = [];
        $scope.filters.forEach(function(filter)  { 
             if(filter.term !== null) {
               query.push({ name : filter.name, value : { term : { _id : filter.term._id} } });
             }
        }); 

        $state.transitionTo('app.modules', { query : query }, { notify: false });
      }
      
      /*
      * if given group is the selected group, deselect it
      * else, select the given group
      */
      $scope.toggleGroup = function(group) {
        group.show = !group.show;

        setTimeout(function() {
          $ionicScrollDelegate.resize();
        }, 500);
      };

      $scope.isGroupShown = function(group) {
        return group.show;
      };
    }
  }
});
