'use strict';

// Salaries controller
angular.module('salaries').controller('SalariesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Salaries',
    function ($scope, $stateParams, $location, $filter, Authentication, Salaries) {
        $scope.authentication = Authentication;

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
                $scope.employment_type= '';
                $scope.employment_role= '';
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



        // Simple Class to retrieve Data from our app
        var Salary = Salaries.query();

        // Store Re-Arranged Salary Data
        $scope.chartData = [];


        // When we have data, arrange into a format HighCharts can understand
        $scope.initHighChartsData = function () {
            Salary.$promise.then(function (data) {
                angular.forEach(data, function (value, key) {
                    this.push({name: value.name, y: value.salary, gender: value.gender});
                }, $scope.chartData);
                console.log('Promise:', $scope.chartData);
            });
        };
        $scope.initHighChartsData(); // Run just the once.


        // Adjust filters
        $scope.filterUpdate = function () {
            Salary.$promise.then(function () {
                // Log to make sure we're doing something
                console.log('We are making a change to the filters...');

                // Copy original data so we don't end up with duplicate values in view
                $scope.copiedChartData = angular.copy($scope.chartData);

                // Salary Filters, the models such as salary.gender, salary.employment_type etc.
                var salaryFilterObj = $scope.salary;
                $scope.filtered = $filter('filter')($scope.copiedChartData, salaryFilterObj);

            });
        };

    }
]);


