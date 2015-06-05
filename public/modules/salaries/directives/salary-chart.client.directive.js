'use strict';


angular.module('salaries')
    .directive('salaryChart', function () {
        return {
            restrict: 'E',

            scope: {
                data: '='
            },

            template: '<div id="salaryChart"></div>',

            controller: function ($scope, $element, $attrs) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'salaryChart',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Salary test'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                        percentageDecimals: 1
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Salary',
                        data: $scope.data
                    }]
                });

                $scope.$watch('data', function (newValue, oldValue) {
                    if (newValue) {
                        console.log($scope.data);
                        chart.series[0].setData($scope.data, true);
                    }
                }, true);
            }
        };
    });
