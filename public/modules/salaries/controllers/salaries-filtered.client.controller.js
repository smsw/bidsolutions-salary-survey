'use strict';

angular.module('salaries').controller('SalariesFilteredController', ['$scope', 'SalariesFiltered', '$filter', 'Authentication', '$location',
	function ($scope, SalariesFiltered, $filter, Authentication, $location) {
		// Salaries filtered controller logic
		// ...

		var Salary = new SalariesFiltered.query();

		$scope.initialiseChart = function (){
			Salary.$promise.then(function (data) {
				$scope.chartData = data;
			});
		};


		/***
		 * Filter Update
		 * Called when ng-change is detected
		 */
		$scope.filterUpdate = function () {
			$scope.copiedChartData = angular.copy($scope.rawData);
			//$scope.initSalaryFunctions($filter('filter')($scope.copiedChartData, $scope.salary));
		};

	}
]);
