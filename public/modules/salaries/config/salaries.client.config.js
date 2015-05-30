'use strict';

// Configuring the Articles module
angular.module('salaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Salaries', 'salaries', 'dropdown', '/salaries(/create)?');
		Menus.addSubMenuItem('topbar', 'salaries', 'List Salaries', 'salaries');
		Menus.addSubMenuItem('topbar', 'salaries', 'New Salary', 'salaries/create');
	}
]);