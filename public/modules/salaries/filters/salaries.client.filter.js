'use strict';

angular.module('salaries')
    .filter('calcAvg',
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
        }
    )

    .filter('calcBonus',
        function () {
            return function (input) {
                // Calculate Average Salary
                var salaries = [], totalSalary = 0;

                console.log(input);
                angular.forEach(input, function (value) {
                    this.push(value.salary);
                    totalSalary += value.salary;
                }, salaries);

                return totalSalary / salaries.length;
            };
        }
    );

