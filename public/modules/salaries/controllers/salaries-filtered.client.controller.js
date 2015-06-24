'use strict';

angular.module('salaries').controller('SalariesFilteredController', ['$scope', 'SalariesFiltered', '$filter', 'Authentication', '$location',
    function ($scope, SalariesFiltered, $filter, Authentication, $location) {
        // Salaries filtered controller logic
        // ...

        /***
         * Retrieve data from our service
         */
        $scope.chartUpdate = function () {
            var Salary = new SalariesFiltered.query($scope.salary);

            Salary.$promise.then(function (data) {
                $scope.chartData = data[0].chart;
                $scope.tableData = data[0].table;
            });
        };

        /***
         * Filter Update
         * Called when ng-change is detected
         */
        $scope.filterUpdate = function () {

            // Catch empty filter values, and remove from query
            angular.forEach($scope.salary, function (value, key) {
                if (value === '') {
                    delete $scope.salary[key];
                }
            });

            // Update query
            $scope.chartUpdate();
        };
    }
]);
