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

        // Return length of object
        $scope.count = function (data) {
            return data.length;
        };






        // Simple Class ref to retrieve Data from our app
        var Salary = Salaries.query();

        // Store Re-Arranged Salary Data
        $scope.chartData = [];






        // When we have data, arrange into a format HighCharts can understand
        $scope.initHighChartsData = function () {
            Salary.$promise.then(function (data) {
                angular.forEach(data, function (value, key) {
                    this.push({name: value.name, y: value.salary, gender: value.gender});
                }, $scope.chartData);

                $scope.filtered = $scope.genderTotal(data);
            });
        };
        $scope.initHighChartsData(); // Run just the once.







        $scope.genderTotal = function (data) {
            $scope.genderByNumbers = [];

            var females = 0, males = 0;
            angular.forEach(data, function (value, key) {

                // Calculate number of males and females and push into object.
                if (value.gender === 'f') {
                    females += 1
                } else if (value.gender === 'm') {
                    males += 1
                }
            }, $scope.genderByNumbers);

            $scope.genderByNumbers.push(
                {name: 'Male', gender: 'm', y: males},
                {name: 'Female', gender: 'f', y: females}
            );

            return $scope.genderByNumbers;
        };






        // Adjust filters
        $scope.filterUpdate = function () {
            Salary.$promise.then(function () {
                $scope.copiedChartData = angular.copy($scope.genderByNumbers);
                $scope.filtered = $filter('filter')($scope.copiedChartData, $scope.salary);
            });
        };

    }
]);


