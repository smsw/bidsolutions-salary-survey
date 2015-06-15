'use strict';

angular.module('salaries').controller('SalariesFilterController', ['$scope', 'Salaries',
	function($scope, Salaries) {
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
				console.log('By job title', $scope.filterData('Document Manager','bs_job_title', data));

				console.log('Average Salary', $scope.calculateAverage('salary',$scope.filterData('Document Manager','bs_job_title', data)));

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

		/***
		 * Calculate Average
		 * @param data
		 * @returns {number}
		 */
		$scope.calculateAverage = function (prop, data) {
			// add up all numbers
			var totalValue = 0;

			// Iterate over property and add value
			angular.forEach(data, function(value, key){
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
