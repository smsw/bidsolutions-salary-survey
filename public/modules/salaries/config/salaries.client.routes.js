'use strict';

//Setting up route
angular.module('salaries').config(['$stateProvider',
	function($stateProvider) {
		// Salaries state routing
		$stateProvider.
		state('listSalaries', {
			url: '/salaries',
			templateUrl: 'modules/salaries/views/list-salaries.client.view.html'
		}).
		state('createSalary', {
			url: '/salaries/create',
			templateUrl: 'modules/salaries/views/create-salary.client.view.html'
		}).
		state('viewSalary', {
			url: '/salaries/:salaryId',
			templateUrl: 'modules/salaries/views/view-salary.client.view.html'
		}).
		state('editSalary', {
			url: '/salaries/:salaryId/edit',
			templateUrl: 'modules/salaries/views/edit-salary.client.view.html'
		});
	}
]);