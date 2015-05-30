'use strict';

// Salaries controller
angular.module('salaries').controller('SalariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Salaries',
    function($scope, $stateParams, $location, Authentication, Salaries) {
        $scope.authentication = Authentication;

        // Calculate Average Salary
        $scope.calculateAvg = function(){
            var salaries = [], totalSalary = 0;

            angular.forEach($scope.salaries, function (value) {
                this.push(value.salary);
                totalSalary += value.salary;
            }, salaries);

            return totalSalary/salaries.length;
        };

        // Create new chart
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'pie'
                }
            },
            series: [{
                data: [22000, 15000, 1000]
            }],
            title: {
                text: 'Average Salary'
            },

            loading: false
        };

        // Create new Salary
        $scope.create = function() {
            // Create new Salary object
            var salary = new Salaries ({
                name: this.name,
                salary: this.salary,
                bonus: this.bonus,
                gender: this.gender,
                employment_location: this.employment_location,
                employment_type: this.employment_type,
                working_practice: this.working_practice
            });

            // Redirect after save
            salary.$save(function(response) {
                $location.path('salaries/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.salary = '';
                $scope.bonus = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Salary
        $scope.remove = function(salary) {
            if ( salary ) {
                salary.$remove();

                for (var i in $scope.salaries) {
                    if ($scope.salaries [i] === salary) {
                        $scope.salaries.splice(i, 1);
                    }
                }
            } else {
                $scope.salary.$remove(function() {
                    $location.path('salaries');
                });
            }
        };

        // Update existing Salary
        $scope.update = function() {
            var salary = $scope.salary;

            salary.$update(function() {
                $location.path('salaries/' + salary._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Salaries
        $scope.find = function() {
            $scope.salaries = Salaries.query();
        };

        // Find existing Salary
        $scope.findOne = function() {
            $scope.salary = Salaries.get({
                salaryId: $stateParams.salaryId
            });
        };
    }
]);