'use strict';

angular.module('salaries')
    .filter('averageSalary', [
        function () {
            return function (input) {
                // Calculate Average Salary
                var salaries = [], totalSalary = 0;

                angular.forEach(input, function (value) {
                    this.push(value.salary);
                    totalSalary += value.salary;
                }, salaries);

                return totalSalary / salaries.length;
            };
    }]
);