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

                scope.$watch('chartData', function (newVal,oldVal) {
                    if (newVal) {
                        drawPlot();
                    }
                }, true);

                var drawPlot = function() {
                    var chart = new Highcharts.Chart({
                        chart: {
                            zoomType: 'xy',
                            renderTo: element[0]
                        },
                        title: {
                            text: 'Salary Survey'
                        },
                        subtitle: {
                            text: 'Source: Bid Solutions'
                        },
                        xAxis: [{
                            categories: ['Bid Manager', 'Document Manager', 'Graphic Designer', 'Head of Bid Management',
                                'Head of Proposal Management', 'Knowledgebase Manager', 'Proposal Manager', 'Proposal Writer'],
                            crosshair: true
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
                            layout: 'vertical',
                            align: 'left',
                            x: 120,
                            verticalAlign: 'top',
                            y: 100,
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
