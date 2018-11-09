/**
 * Stats inspration chart
 * @description this components will show the users stats Inspiration chart
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsChartInspiration', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-chart-inspiration.html',
    controller: function ($scope, User, Chart) {
      
      $scope.chartInspirationPoints = AmCharts.makeChart("chartInspirationPoints", {
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
            "cursorColor": "#73A6CB"
          },
          "trendLines": [],
          "graphs": [
            {
              "balloonText": "[[value]] POINTS - [[category]]",
              "bullet": "round",
              "bulletColor": "#73A6CB",
              "bulletSize": 10,
              "fillAlphas": 0.7,
              "fillColors": "#73A6CB",
              "id": "AmGraph-2",
              "lineColor": "#73A6CB",
              "lineThickness": 2,
              "title": "Inspiration Points",
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
        if(newValue.influence) {
         // $scope.chartInspiration = Chart.getChart(newValue.influence, options, "AreaChart");
          var data = processData(newValue);
          $scope.chartInspirationPoints.dataProvider = data;
          $scope.chartInspirationPoints.validateData();
        }
      });

      function processData(charts) {
        var data = [];
        for(var x=0; x < 7; x++) {
          var influence = 0;
          var date = charts && charts.influence && charts.influence.items && charts.influence.items[x] ? charts.influence.items[x].date : "";
          
          if(charts && charts.influence && charts.influence.items && charts.influence.items[x]) {
            influence = charts.influence.items[x].points;
          }
          
          data.push( {
            "Points" : influence,
            "Date" : date
          });
        }

        $scope.externalInspirationTitle = Chart.getDateRange(charts.influence.items[0].date, charts.influence.items[charts.influence.items.length-1].date);
        return data;
      };
    }
  }
});
