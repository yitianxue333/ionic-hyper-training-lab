/**
 * Training Modules Search Compoenent
 * @description this component will show a list of modules
 * @author Sadaruwan
 * @since 04/30/17
 */
angular.module('hyper.profile').directive('hyTrainingModulesLibrary', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/profile/components/hy-training-modules-library.html',
    controller: function ($scope, $ionicModal, $state, $rootScope, $ionicScrollDelegate, $stateParams, Module, MyLibrary, Taxonomy, TrainingStore, Trainer, _) {

      $scope.taxonomies = TrainingStore.getTaxonomies();
      $scope.trainers = TrainingStore.getTrainers();
      $scope.modules = [];
      $scope.no_modules_con = false;

      //$rootScope.$ionicGoBack = $rootScope.$ionicGoBack;
      //$rootScope.$ionicGoBack = function () {
        //$state.go('app.settings');
       //$rootScope.$ionicGoBack = $rootScope.oldSoftBack;
      //};

      function loadModules() {
        var terms = [];

        MyLibrary.getModuleList()
          .then(function (modules) {
            console.log($scope.trainers);
            var modulesProcessed = MyLibrary.processModules(modules.data, $scope.taxonomies, $scope.trainers, null, ["intro"]);
            $scope.modules = modulesProcessed;
            $scope.no_modules_con = ($scope.modules.list.length == 0) ? 'trusse' : 'falssse';
            
          });
      }

      function processTaxonomy(taxonomy_list) {
        const by_name = {};
        const term_by_id = {};
        const list = [];

        taxonomy_list.forEach(function (tax) {
          tax = _.cloneDeep(tax);
          list.push(tax);
          by_name[tax.name] = tax;
          const term_index = indexByProp(tax.terms, '_id');
          _.values(term_index).forEach(function (term) {
            term.parent = {
              _id: tax._id,
              name: tax.name,
              plural: tax.plural,
              singular: tax.singular
            };
          });

          tax.terms = {
            list: tax.terms,
            by_label: indexByProp(tax.terms, 'label')
          };

          // Decorate term_by_id with this taxonomy's terms
          _.assign(term_by_id, term_index);
        });

        return {
          list: list,
          by_name: by_name,
          term_by_id: term_by_id
        };
      }

      function processTrainers(trainersData) {
        const list = [];
        const index = trainersData.reduce(function (struct, trainer) {
          const el = {
            _id: trainer._id,
            name: trainer.name,
            desc: trainer.desc,
            shortDesc: trainer.shortDesc,
            tags: trainer.tags,
            terms: trainer.terms,
            images: _.defaults(indexAttachments(trainer.attachments), {
              portrait: {},
              profile: {},
              thumb: {}
            })
          };

          struct[trainer._id] = el;
          list.push(el);

          return struct;
        }, {});

        return {
          list: list,
          index: index
        };
      }

      function processAttachments(attachments) {
        return attachments.map(function (att) {
          att = _.cloneDeep(att);
          return att;
        });
      }

      function indexAttachments(attachmentData) {
        return indexByProp(processAttachments(attachmentData), 'type');
      }

      function indexByProp(list, prop) {
        return list.reduce(function (struct, i) {
          struct[i[prop]] = i;
          return struct;
        }, {});
      }

      $scope.init = function () {
        var self = this;
        Promise.all([
          Taxonomy.getTaxonomies(),
          Trainer.getTrainers()
        ])
          .then(function (data) {
            var taxonomyData = data[0],
            trainersData = data[1];

            $scope.taxonomies = processTaxonomy(taxonomyData);
            $scope.trainers = processTrainers(trainersData);
            TrainingStore.setTaxonomies($scope.taxonomies);
            TrainingStore.setTrainers($scope.trainers);

            $scope.$apply(function () {
              console.log("update");
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        loadModules();
      }

    }
  }
});
