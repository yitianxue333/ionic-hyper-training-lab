/**
 * Stats Achievement chart
 * @description this components will show the users stats Achievement chart
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsChartAchievement', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-chart-achievement.html',
    controller: function ($scope, $filter, User, Chart) {

      $scope.chartAchievementPoints = AmCharts.makeChart( "chartAchievementPoints", {
          "type": "serial",
          "categoryField": "Date",
          "startDuration": 1,
          "fontFamily": "Open Sans",
          "theme": "default",
          "categoryAxis": {
            "gridPosition": "start",
            "markPeriodChange": false,
            "parseDates": true,
            "boldLabels": true,
            "fontSize": 10,
            "autoGridCount": false,
            "equalSpacing": false,
            "gridCount": 7
          },
          "chartCursor": {
            "enabled": true,
            "cursorColor": "#9FC9C5"
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]] POINTS - [[category]]",
              "bullet": "round",
              "bulletColor": "#9FC9C5",
              "bulletSize": 10,
              "fillAlphas": 0.7,
              "fillColors": "#9FC9C5",
              "id": "AmGraph-2",
              "lineColor": "#9FC9C5",
              "lineThickness": 2,
              "title": "Achievement Points",
              "valueField": "Points"
            }
          ],
          "guides": [],
          "valueAxes": [
            {
              "id": "ValueAxis-1",
              "title": ""
            }
          ],
          "allLabels": [],
          "balloon": {},
          "titles": []
        });

      $scope.$watch("weeklyStats", function(newValue, oldValue) {
        if(newValue.achieve && newValue.achieve.items) {
          //$scope.chartAchievement = Chart.getChart(newValue.achieve, options, "AreaChart");
          var data = processData(newValue);
          $scope.chartAchievementPoints.dataProvider = data;
          $scope.chartAchievementPoints.validateData();
        }
      });

      function processData(charts) {
        var data = [];
        for(var x=0; x < 7; x++) {
          var achieve = 0;
          var date = charts && charts.achieve && charts.achieve.items && charts.achieve.items[x] ? charts.achieve.items[x].date : "";
          
          if(charts && charts.achieve && charts.achieve.items && charts.achieve.items[x]) {
            achieve = charts.achieve.items[x].points;
          }
          
          data.push( {
            "Points" : achieve,
            "Date" : date
          });
        }

        $scope.externalAchieveTitle = Chart.getDateRange(charts.achieve.items[0].date, charts.achieve.items[charts.achieve.items.length-1].date);
        return data;
      };
    }
  }
});
