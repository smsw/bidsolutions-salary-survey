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

                // Check All data is here
                console.log('All data', data);
                // Sort data by job title
                console.log('By job title', $scope.filterData('Document Manager', 'bs_job_title', data));
                // Output average salary based on a job title
                console.log('Average Salary', $scope.calculateAverage('salary', $scope.filterData('Document Manager', 'bs_job_title', data)));

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
                        [
                            {name: value.name},
                            {
                                salary: {
                                    average: $scope.calculateAverage('salary', $scope.filterData(value.name, 'bs_job_title', data))
                                },
                                average_age: $scope.calculateAverage('age', $scope.filterData(value.name, 'bs_job_title', data))
                            }
                        ]
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
            return totalValue / data.length;
        };


        // Example model for our Data columns we require
        $scope.exampleDataColumModel = [
            {
                "name": "Document Manager",
                "salary": {
                    minimum: 100,
                    average: 200,
                    median: 300,
                    maximum: 400
                },
                "average_age": 35
            }
        ];

    }
]);
