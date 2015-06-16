'use strict';

angular.module('salaries').controller('SalariesFilterController', ['$scope', 'Salaries', '$filter', '$q',
    function ($scope, Salaries, $filter, $q) {
        // Salaries filter controller logic
        // ...

        var Salary = Salaries.query();

        // Called on the view with ng-init
        // When Data is ready, run functions that require our promised data
        $scope.initSalaryFunctions = function (newData) {
            Salary.$promise.then(function (data) {

                if (newData) {
                    console.log('New data has come in', newData);
                    data = newData;
                } else {
                    console.log('Using data with no filters', data);
                    $scope.rawData = data;
                }

                // Store job titles to iterate over
                // We could also iterate over the existing data and pull a unique list of job titles instead...
                var jobTitlesArr = [
                    {name: 'Bid Manager'},
                    {name: 'Document Manager'},
                    {name: 'Graphic Designer'},
                    {name: 'Head of Bid Management'},
                    {name: 'Head of Proposal Management'},
                    {name: 'Knowledgebase Manager'},
                    {name: 'Proposal Manager'},
                    {name: 'Proposal Writer'}
                ];

                var dataByJobTitles = [];
                angular.forEach(jobTitlesArr, function (value, key) {
                    dataByJobTitles.push(
                        {
                            name: value.name,
                            salary: {
                                average: $scope.calculateAverage('salary', $scope.filterData(value.name, 'bs_job_title', data)),
                                median: $scope.calculateMedian($scope.filterData(value.name, 'bs_job_title', data)),
                                maximum: $scope.calculateMinMaxValue('max', $scope.filterData(value.name, 'bs_job_title', data)),
                                minimum: $scope.calculateMinMaxValue('min', $scope.filterData(value.name, 'bs_job_title', data))
                            },
                            average_age: $scope.calculateAverage('age', $scope.filterData(value.name, 'bs_job_title', data))
                        }
                    );
                });
                console.log('Populate our graph;', dataByJobTitles);
                $scope.populateDataColumn(dataByJobTitles);
            });
        };

        /***
         * Filter data by various params
         * @param filter
         * @param prop
         * @param data
         * @returns {Array}
         */
        $scope.filterData = function (filter, prop, data) {
            var result = [];

            angular.forEach(data, function (value, key) {
                if (value[prop] === filter) {
                    result.push(value);
                }
            });
            return result;
        };

        /***
         * Populate DataColumn Model with our results
         * @param data
         * @returns {Number}
         */
        $scope.populateDataColumn = function (data) {
            /*
             $scope.dataColumns = [];

             return $scope.dataColumns.push
             (
             data
             );
             */


            // Suited Format for HighCharts
            $scope.dataColumns = [
                {
                    name: 'Minimum Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    // Goes in order of Categories
                    data: $scope.pickData('salary', 'minimum', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Average Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'average', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Median Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'median', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Maximum Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'maximum', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Average Age',
                    type: 'spline',
                    data: $scope.pickData('average_age', '', data),
                    tooltip: {
                        valueSuffix: ''
                    }
                }
            ];
        };

        /***
         * Pick a property and return its values
         * @param prop
         * @param type
         * @param data
         * @returns {*}
         */
        $scope.pickData = function (prop, type, data) {

            return data.map(function (o) {
                if (type !== '') {
                    return o[prop][type];
                } else {
                    return parseInt(o[prop]) || 0;
                }
            });
        };

        /***
         * Calculate Average
         * @param data
         * @returns {number}
         */
        $scope.calculateAverage = function (prop, data) {
            // add up all numbers
            var totalValue = 0;

            // iterate over property and add its value to total
            angular.forEach(data, function (value, key) {
                totalValue += value[prop];
            });

            // divide by how many numbers and return value
            return parseInt(Math.floor(totalValue / data.length)) || 0;
        };

        /***
         * Calculate Min/Max Value
         * @param prop
         * @param data
         * @returns {*}
         */
        $scope.calculateMinMaxValue = function (prop, data) {
            var values = data.map(function (o) {
                // Pluck Salary values only
                return o.salary;
            })
                .filter(function (val) {
                    // Filter out null as that gives a value of 0
                    return val !== null
                });

            return parseInt(Math[prop].apply(Math, values)) || 0;
        };

        /***
         * Calculate Median
         * https://gist.github.com/caseyjustus/1166258
         * @param prop
         * @returns {*}
         */
        $scope.calculateMedian = function (data) {

            var values = data.map(function (o) {
                // Pluck Salary values only
                return o.salary;
            });

            values.sort(function (a, b) {
                return a - b;
            });
            var half = Math.floor(values.length / 2);

            if (values.length % 2)
                return parseInt(values[half]) || 0;
            else
                return parseInt((values[half - 1] + values[half]) / 2.0) || 0;
        };

        /***
         * Filter Update
         * Called when ng-change is detected
         */
        $scope.filterUpdate = function () {
            $scope.copiedChartData = angular.copy($scope.rawData);
            $scope.initSalaryFunctions($filter('filter')($scope.copiedChartData, $scope.salary));
        };
    }
]);
