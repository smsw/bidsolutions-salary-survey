'use strict';

angular.module('salaries').controller('SalariesFilterController', ['$scope', 'Salaries',
    function ($scope, Salaries) {
        // Salaries filter controller logic
        // ...

        var Salary = Salaries.query();

        // Called on the view with ng-init
        // When Data is ready, run functions that require our promised data
        $scope.initSalaryFunctions = function () {
            Salary.$promise.then(function (data) {

                $scope.rawData = data;

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
                                average: $scope.calculateAverage('salary', $scope.filterData(value.name, 'bs_job_title', data))
                            },
                            average_age: $scope.calculateAverage('age', $scope.filterData(value.name, 'bs_job_title', data)),
                            median: $scope.calculateMedian($scope.filterData(value.name, 'bs_job_title', data)),
                            maximum: $scope.calculateMinMaxValue('max', $scope.filterData(value.name, 'bs_job_title', data)),
                            minimum: $scope.calculateMinMaxValue('min', $scope.filterData(value.name, 'bs_job_title', data))
                        }
                    );
                });

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
            $scope.dataColumns = [];
            return $scope.dataColumns.push
            (
                data
            );
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
            return Math.floor(totalValue / data.length);
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

            return Math[prop].apply(Math, values);
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
                return values[half];
            else
                return (values[half - 1] + values[half]) / 2.0;
        }
    }
]);
