'use strict';

// Salaries controller
angular.module('salaries').controller('SalariesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Salaries',
    function ($scope, $stateParams, $location, $filter, Authentication, Salaries) {
        $scope.authentication = Authentication;

        var Salary = Salaries.query();

        // Create new Salary
        $scope.create = function () {
            // Create new Salary object
            var salary = new Salaries({
                name: this.name,
                salary: this.salary,
                day_charge_rate: this.day_charge_rate,
                total_value: this.total_value,
                bonus: this.bonus,
                gender: this.gender,
                age: this.age,
                employment_location: this.employment_location,
                employment_type: this.employment_type,
                employment_status: this.employment_status,
                working_practice: this.working_practice,
                total_contract_earnings: this.total_contract_earnings,
                bs_job_title: this.bs_job_title,
                contract_job_title: this.contract_job_title,
                highest_education: this.highest_education,
                industry_experience: this.industry_experience,
                primary_industry: this.primary_industry
            });

            // Redirect after save
            salary.$save(function (response) {
                $location.path('salaries/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.salary = '';
                $scope.bonus = '';
                $scope.gender = '';
                $scope.employment_location = '';
                $scope.employment_type = '';
                $scope.employment_role = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Salary
        $scope.remove = function (salary) {
            if (salary) {
                salary.$remove();

                for (var i in $scope.salaries) {
                    if ($scope.salaries [i] === salary) {
                        $scope.salaries.splice(i, 1);
                    }
                }
            } else {
                $scope.salary.$remove(function () {
                    $location.path('salaries');
                });
            }
        };

        // Update existing Salary
        $scope.update = function () {
            var salary = $scope.salary;

            salary.$update(function () {
                $location.path('salaries/' + salary._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Salaries
        $scope.find = function () {
            $scope.salaries = Salaries.query();
        };

        // Find existing Salary
        $scope.findOne = function () {
            $scope.salary = Salaries.get({
                salaryId: $stateParams.salaryId
            });
        };

        // Called on the view with ng-init
        // When Data is ready, run functions that require our promised data
        $scope.initSalaryFunctions = function () {
            Salary.$promise.then(function (data) {

                // Check All data is here
                console.log('All data', data);

                // Sort data by job title
                console.log('By job title', $scope.filterData('Document Manager','bs_job_title', data));

                // Example of putting Document manager results into DataColumn[]
                $scope.populateDataColumn($scope.filterData('Document Manager','bs_job_title', data));
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
                {
                    name: 'Document Manager',
                    salary: {
                        minimum: null,
                        average: null,
                        median: null,
                        maximum: null
                    },
                    average_age: null,
                    raw: data
                }
            );
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


