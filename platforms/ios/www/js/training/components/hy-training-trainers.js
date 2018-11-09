/**
 * Training Trainers Compoenent
 * @description this components will show a carousal of trainers
 * @author Kanchana Yapa
 * @since 09/21/16
 */
angular.module('hyper.training').directive('hyTrainingTrainers', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      trainers: '=',
      filter: '='
    },
    templateUrl: 'views/training/components/hy-training-trainers.html',
    controller: function ($scope, $state, $filter) {

        function applyGridLayout(columns, items) {
            var rows = [];
            var cols = [];
            var counter = 0;
            var filtered = [];
            if($scope.filter) {
                filtered = $filter('filter')(items, { terms: $scope.filter });
            } else {
                filtered = items;
            }
            
            var idx = 0;
            filtered.forEach(function(item, index) {
                cols.push(item);
                if(index%columns == (columns-1)) {
                    rows.push(cols);
                    cols = [];
                }
                idx = index;
            });

            if(idx%columns != (columns-1)) {
                rows.push(cols);
            }
            
            return rows;
        }
        
        $scope.$watch("trainers", function() {
            if($scope.trainers && $scope.trainers.list)
                $scope.trainingGrid = applyGridLayout(2, $scope.trainers.list);
        });

        $scope.$watch("filter", function() {
            if($scope.trainers && $scope.trainers.list)
                $scope.trainingGrid = applyGridLayout(2, $scope.trainers.list);
        });
    }
  }
});
