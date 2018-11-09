/**
 * Stats training power chart
 * @description this components will show the users stats training power chart
 * @author Kanchana Yapa
 * @since 08/02/16
 */
angular.module('hyper.stats').directive('hyStatsChartPower', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stats/components/hy-stats-chart-power.html',
    controller: function ($scope, User, Chart) {
      $scope.power = {
        "forms": 0,
				"weapons": 0,
				"tricking": 0,
				"sparring": 0
      };

      $scope.chartPowerPoints = AmCharts.makeChart( "chartPowerPoints", {
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
                "balloonColor": "#73476B",
                "balloonText": "[[category]]: [[value]] [[title]] Points",
                "color": "#000000",
                "columnWidth": 0.54,
                "fillAlphas": 1,
                "fillColors": "#73476B",
                "id": "forms",
                "lineColor": "#73476B",
                "title": "Forms",
                "type": "column",
                "valueField": "Forms"
              },
              {
                "balloonColor": "#EEB211",
                "balloonText": "[[category]]: [[value]] [[title]] Points",
                "color": "#000000",
                "columnWidth": 0.54,
                "fillAlphas": 1,
                "fillColors": "#EEB211",
                "id": "weapons",
                "lineColor": "#EEB211",
                "title": "Weapons",
                "type": "column",
                "valueField": "Weapons"
              },
              {
                "balloonColor": "#00766D",
                "balloonText": "[[category]]: [[value]] [[title]] Points",
                "color": "#000000",
                "columnWidth": 0.54,
                "fillAlphas": 1,
                "fillColors": "#00766D",
                "id": "tricking",
                "lineColor": "#00766D",
                "title": "Tricking",
                "type": "column",
                "valueField": "Tricking"
              },
              {
                "balloonColor": "#8E0017",
                "balloonText": "[[category]]: [[value]] [[title]] Points",
                "color": "#000000",
                "columnWidth": 0.54,
                "fillAlphas": 1,
                "fillColors": "#8E0017",
                "id": "sparring",
                "lineColor": "#8E0017",
                "negativeFillAlphas": 0,
                "negativeLineAlpha": 0,
                "title": "Sparring",
                "topRadius": 0,
                "type": "column",
                "valueField": "Sparring"
              }
            ],
            "guides": [],
            "valueAxes": [
              {
                "id": "ValueAxis-1",
                "stackType": "regular",
                "title": ""
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
        if(newValue["training-power"]) {
          var powerData = newValue["training-power"];
          //$scope.chartPower = Chart.getChart({ items: powerData }, options, "ComboChart");

          var data = processData(powerData);
          $scope.chartPowerPoints.dataProvider = data;
          $scope.chartPowerPoints.validateData();
        }
      });

      function processData(charts) {
        var data = [];
        for(var x=0; x < 7; x++) {
          var forms = 0,
              weapons = 0 , 
              tricking = 0 , 
              sparring = 0;

          var date = charts && charts[x] ? charts[x].date : "";
          
          if(charts && charts[x] && charts[x].points && charts[x].points) {
            forms = charts[x].points.forms;
            $scope.power.forms += forms;

            weapons = charts[x].points.weapons;
            $scope.power.weapons += weapons;

            tricking = charts[x].points.tricking;
            $scope.power.tricking += tricking;

            sparring = charts[x].points.sparring;
            $scope.power.sparring += sparring;
          }

          data.push( {
            "Date" : date,
            "Forms" : forms,
            "Sparring" : sparring,
            "Weapons" : weapons,
            "Tricking" : tricking
          });
        }

        $scope.externalPowerTitle = Chart.getDateRange(charts[0].date, charts[charts.length-1].date);
        return data;
      };

    }
  }
});
