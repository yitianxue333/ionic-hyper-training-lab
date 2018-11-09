/**
 * Hyper Slider
 * @description
 * @author Samuel Castro
 * @since 11/25/15
 */
angular.module('hyper.core').directive('hyTab', function() {
  return {
    require: '^hyTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addTab(scope);
    },
    templateUrl: 'views/core/components/hy-tab.html'
  };
})
