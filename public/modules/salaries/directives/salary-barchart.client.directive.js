'use strict';

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

                var drawPlot = function() {
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: element[0]
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
                            { // Primary yAxis

                                title: {
                                    text: 'Age',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                }
                            },
                            { // Secondary yAxis
                                labels: {
                                    format: '£ {value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                title: {
                                    text: 'GBP',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                            opposite: true
                            }],
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            x: 0,
                            y: 20,
                            verticalAlign: 'top',
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        series: scope.chartData
                    });
                };
            }
        };
    }
]);
