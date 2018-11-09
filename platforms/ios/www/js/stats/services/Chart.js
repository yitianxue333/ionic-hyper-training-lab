/**
 * Chart Service
 * @description This service formats data according the elevant chart
 * @author Kanchana Yapa
 * @since 16/02/16
 */
angular.module('hyper.stats').factory('Chart', function($filter) {

  /**
   * Create Chart title according to end date start date
   * @param Start date
   * @param End Date
   **/
  function getDateRange(startDate, endDate) {
    return $filter('date')(startDate, "MMM d") + ' - ' + $filter('date')(endDate, "MMM d")
  }

  /**
   * Get the Short Day value from a passed date
   * @param date
   **/
  function getDay(date) {
    return $filter('date')(date, "EEE")
  }

  /**
   * Returns formatted options and data for Google Area Chart
   * @param data
   * @param options
   **/
  function getAreaChart(data, options) {

    //set initial data
    var chartData = {};
    chartData.data = {"cols": [
       { id: "t", label: "Day", type: "string" },
       { id: "s", label: "Total Points", type: "number" }
    ], "rows": [] };
    chartData.type = "AreaChart";
    chartData.options = {
          "hAxis": { "title": "" },
          'legend': "none",
          'pointSize': 5,
          'vAxis': {
              'viewWindow': {
                  'min': 0
              }
          },
          'chartArea': {
            'top': 10,
            'height': "80%",
            'width': '85%'

          },
          "areaOpacity": "1.00",
          "pointSize": "3",
          'hAxis': {
            'title': "",
            'titleTextStyle': {
              "color": "#797979",
             "fontSize": "14",
             "bold": false,
             "italic": false
           }
         }
    };

    angular.extend(chartData.options, options);

    var rows = [];
    if(data.items) {
      for (var i = 0; i < data.items.length; i++) {
        rows.push({ c : [ { v: getDay(data.items[i].date) }, { v: data.items[i].points } ] });
      }
      chartData.data.rows = rows;
      chartData.options.hAxis.title = getDateRange(data.items[0].date, data.items[data.items.length-1].date);
    }

    return chartData;
  }

  /**
   * Returns formatted options and data for Google Column Chart
   * @param data
   * @param options
   **/
  function getColumnChart(data, options) {
    var chartData = {};
    chartData.data = {"cols": [
       { id: "t", label: "Day", type: "string" },
       { id: "s", label: "Total Points", type: "number" }
    ], "rows": [] };

    chartData.type = "ColumnChart";
    chartData.options = {
          'legend': "none",
          'chartArea': {
            'top': 10,
            'height': '80%',
            'width': '85%'
          },
          'vAxis': {
                'viewWindow': {
                    'min': 0
                }
             //'baselineColor': 'transparent',
             //'gridlineColor': 'transparent'
          },
          'hAxis': {
            'title': "",
            'baselineColor': '#000000',
            "gridlines": { color: '#000000', count: 3},
            'titleTextStyle': {
              "color": "#797979",
              "fontSize": "10"
           }
        }
    };

    angular.extend(chartData.options, options);

    var rows = [];
    if(data.items) {
      for (var i = 0; i < data.items.length; i++) {
        rows.push({ c : [
          { v: getDay(data.items[i].date) },
          { v: data.items[i].points } ] });
      }
      chartData.data.rows = rows;
      chartData.options.externalTitle = getDateRange(data.items[0].date, data.items[data.items.length-1].date);
    }

    return chartData;
  }


  function getComboChart(data, options) {
    var chartData = {};
    chartData.type = "ComboChart";
    chartData.options = {
      'title' : '',
      'titlePosition': 'none',
      'seriesType': 'bars',
      'series': { 7: { type: 'line' }},
      'legend': 'none',
      'vAxis': {
          'viewWindow': {
              'min': 0
          }
      },
      'chartArea': {
        'top': 15,
        'height': '80%' ,
        'width': '85%'
      }
    };

    chartData.data = {"cols": [
        { id: "day", label: "Day", type: "string"},
        { id: "forms", label: "forms", type: "number"},
        { id: "weapons", label: "weapons", type: "number"},
        { id: "tricking", label: "tricking", type: "number"},
        { id: "sparring", label: "sparring", type: "number"}
    ], "rows": [ ]};

    angular.extend(chartData.options, options);

    var rows = [];
    if(data.items) {
      for (var i = 0; i < data.items.length; i++) {
        rows.push({ c : [
            { v: getDay(data.items[i].date) },
            { v: data.items[i].points.forms } ,
            { v: data.items[i].points.weapons },
            { v: data.items[i].points.tricking },
            { v: data.items[i].points.sparring }
          ]}
        );
      }
      chartData.data.rows = rows;
    }

    return chartData;

  }

  return {
    getDateRange: getDateRange,
    getDay: getDay,
    getChart: function(data, options, type) {
      switch (type) {
        case 'AreaChart':
            return getAreaChart(data, options);
          break;
        case 'ColumnChart':
          return getColumnChart(data, options);
          break;
        case 'ComboChart':
          return getComboChart(data, options);
          break;
      }
    }
  };
});
