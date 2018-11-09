/**
 * Stats training chart
 * @description this components will show the users stats training chart
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsChartTraining', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-chart-training.html',
    controller: function ($scope, $filter, User, Chart) {
      var options = {
        colors: ['#005ca0']
      }
      $scope.showTraining = true;

      $scope.chartTrainingPoints = AmCharts.makeChart( "chartTraining", {
        "type": "serial",
        "categoryField": "Date",
        "startDuration": 1,
        "fontFamily": "Open Sans",
        "categoryAxis": {
          "gridPosition": "start",
          "markPeriodChange": false,
          "parseDates": true,
          "boldLabels": true,
          "fontSize": 10,
          "autoGridCount": false,
          "equalSpacing": false,
          "gridCount": 7,
           'type': 'date'
        },
        "chartCursor": {
          "enabled": true,
          "cursorColor": "#005CA0"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "[[value]] POINTS - [[category]]",
            "bullet": "round",
            "bulletColor": "#005CA0",
            "bulletSize": 10,
            "fillAlphas": 0.7,
            "fillColors": "#005CA0",
            "id": "AmGraph-2",
            "lineColor": "#005CA0",
            "lineThickness": 2,
            "title": "Training Points",
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
        if(newValue.train) {
          var data = processData(newValue);
          $scope.chartTrainingPoints.dataProvider = data;
          $scope.chartTrainingPoints.validateData();
        }
      });

      function processData(charts) {
        var data = [];
        for(var x=0; x < 7; x++) {
          var train = 0;
          var date = charts && charts.athlete && charts.athlete.items && charts.athlete.items[x] ? charts.athlete.items[x].date : "";
          
          if(charts && charts.achieve && charts.achieve.items && charts.achieve.items[x]) {
            train = charts.train.items[x].points;
          }
          
          data.push( {
            "Points" : train,
            "Date" : date
          });
        }

        $scope.externalTrainingTitle = Chart.getDateRange(charts.athlete.items[0].date, charts.athlete.items[charts.athlete.items.length-1].date);
        return data;
      };
    }
  }
});
