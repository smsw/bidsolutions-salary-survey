'use strict';
// Code here will be linted with JSHint.
/* jshint ignore:start */

angular.module('salaries').directive('salaryBarchart', [
    function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                chartData: '='
            },
            link: function (scope, element, attrs) {

                scope.$watch('chartData', function () {
                    drawPlot();
                });

                var drawPlot = function () {
                    scope.chart = new Highcharts.Chart({
                        chart: {
                            renderTo: element[0]
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ' '
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['Bid Manager', 'Document Manager', 'Graphic Designer', 'Head of Bid Management',
                                'Head of Proposal Management', 'Knowledgebase Manager', 'Proposal Manager', 'Proposal Writer']
                        }],
                        yAxis: [
                            { // Secondary yAxis
                                title: {
                                    text: 'Age',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                opposite: true,
                                min: 0
                            },
                            { // Secondary yAxis

                                title: {
                                    text: 'GBP',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                labels: {
                                    format: '£ {value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                max: 150000
                            }
                        ],

                        plotOptions: {
                            series: {
                                threshold: 0
                            }
                        },
                        tooltip: {
                            shared: true
                        },

                        series: scope.chartData
                    });
                };
            }
        };
    }
]);
/* jshint ignore:end */
