'use strict';

//Setting up route
angular.module('salaries').config(['$stateProvider',
    function ($stateProvider) {
        // Salaries state routing
        $stateProvider.
            state('listSalaries', {
                url: '/salaries',
                templateUrl: 'modules/salaries/views/list-salaries.client.view.html'
            })
            .state('test', {
                url: '/',
                templateUrl: 'modules/salaries/views/list-salaries.client.view.html'
            });
    }
]);
