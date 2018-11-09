/**
 * Stats Points chart
 * @description this components will show the users stats points chart
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsChartPoints', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-chart-points.html',
    controller: function ($scope, $filter, User, Chart) {
      var options = {
        "colors":['#005ca0']
      }
      
      $scope.chartTotalPoints = AmCharts.makeChart( "chartTotalPoints", {
        "type": "serial",
        "categoryField": "Date",
        "dataDateFormat": "YYYY-MM-DD",
        "startDuration": 1,
        "fontFamily": "Open Sans",
        "fontSize": 10,
        "handDrawScatter": 0,
        "handDrawThickness": 0,
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
        "trendLines": [],
        "graphs": [
          {
            "balloonColor": "#005CA0",
            "balloonText": "[[category]]: [[value]] [[title]] Points",
            "color": "#000000",
            "columnWidth": 0.54,
            "fillAlphas": 1,
            "fillColors": "#005CA0",
            "id": "train",
            "lineColor": "#005CA0",
            "title": "Train",
            "type": "column",
            "valueField": "Train"
          },
          {
            "balloonColor": "#9FC9C5",
            "balloonText": "[[category]]: [[value]] [[title]] Points",
            "columnWidth": 0.54,
            "fillAlphas": 1,
            "fillColors": "#9FC9C5",
            "id": "achieve",
            "lineColor": "#9FC9C5",
            "title": "Achieve",
            "type": "column",
            "valueField": "Achieve"
          },
          {
            "balloonColor": "#73A6CB",
            "balloonText": "[[category]]: [[value]] [[title]] Points",
            "columnWidth": 0.54,
            "fillAlphas": 1,
            "fillColors": "#73A6CB",
            "id": "inspire",
            "lineColor": "#73A6CB",
            "title": "Inspire",
            "type": "column",
            "valueField": "Inspire"
          }
        ],
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "stackType": "regular",
            "title": "",
            "autoGridCount": false
          }
        ],
        "allLabels": [],
        "balloon": {
          "fillAlpha": 1
        },
        "legend": {
          "enabled": false,
          "align": "center",
          "markerBorderThickness": 0,
          "markerSize": 20,
          "useGraphSettings": true
        },
        "titles": []
      });

      $scope.$watch("weeklyStats", function(newValue, oldValue) {
        if(newValue.athlete) {

          //$scope.chartPoints = Chart.getChart(newValue.athlete, options, "ColumnChart");
          var data = processData(newValue);
          $scope.chartTotalPoints.dataProvider = data;
          $scope.chartTotalPoints.validateData();
        }
      });

      function processData(charts) {
        var data = [];
        for(var x=0; x < 7; x++) {
          var train,achieve,inspire = 0;
          var date = charts && charts.athlete && charts.athlete.items && charts.athlete.items[x] ? charts.athlete.items[x].date : "";
          
          if(charts && charts.achieve && charts.achieve.items && charts.achieve.items[x]) {
            achieve = charts.achieve.items[x].points;
          }
                    
          if(charts && charts.train && charts.train.items && charts.train.items[x]) {
            train = charts.train.items[x].points;
          }

          if(charts && charts.influence && charts.influence.items && charts.influence.items[x]) {
            influence = charts.influence.items[x].points;
          }

          data.push( {
            "Train" : train,
            "Achieve" : achieve,
            "Inspire" : influence,
            "Date" : date
          });
        }

        $scope.externalPointsTitle = Chart.getDateRange(charts.athlete.items[0].date, charts.athlete.items[charts.athlete.items.length-1].date);
        return data;
      };
    }
  }
});
