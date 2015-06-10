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
              renderTo: 'container'
            },
            title: {
              text: 'Salary by gender'
            },
            series: [{
              type: 'pie',
              name: 'Salary',
              data: scope.data
            }]
          });
          scope.$watch('data', function (newValue) {
            chart.series[0].setData(newValue, true);
          }, true);
        },

        template: '<div id="container">Error</div>'
      }
    });