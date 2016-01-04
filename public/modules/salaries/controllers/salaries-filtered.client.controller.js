'use strict';

angular.module('salaries').controller('SalariesFilteredController', ['$scope', 'SalariesFiltered', '$filter', 'Authentication', '$location',
    function ($scope, SalariesFiltered, $filter, Authentication, $location) {
        // Salaries filtered controller logic
        // ...

        $scope.toggleLegend = function () {
            var clicked = true;
            var series = $scope.chart.series[0];

            if (clicked) {
                series.hide();
                clicked = false;
            } else {
                clicked = true;
                series.show();
            }
        };


        /***
         * Chart Update
         * Use as many times as required
         */
        $scope.chartUpdate = function () {
            var Salary = new SalariesFiltered.query($scope.salary);
            Salary.$promise.then(function (data) {

                if (data[0].type === 'day_charge_rate') {
                    // Day charge rate exists, change max-height of chart currency
                    $scope.chartHeight = 2000;

                } else if (data[0].type === 'salary') {
                    // Salary height
                    $scope.chartHeight = 150000;
                }

                $scope.chartData = data[0].chart; // Chart Data
                $scope.tableData = data[0].table; // Tabular Data
                $scope.count = data[0].count; // Totals
                $scope.original_count = data[0].original_count;
            });
        };

        /***
         * Filter Update
         * Called when ng-change is detected
         */
        $scope.filterUpdate = function () {

            //Catch empty filter values, and remove from query
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
