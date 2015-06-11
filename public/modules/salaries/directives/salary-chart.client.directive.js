'use strict';


angular.module('salaries')
    .directive('salaryChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },

        link: function (scope, element, attrs) {
          var chart = new Highcharts.Chart({
            chart: {
              renderTo: element[0]
            },
            title: {
              text: ''
            },
            series: [{
              type: 'pie',
              name: 'Respondents',
              data: scope.data
            }]
          });
          scope.$watch('data', function (newValue) {
            chart.series[0].setData(newValue, true);
          }, true);
        },

        template: '<div>Error</div>'
      }
    });
