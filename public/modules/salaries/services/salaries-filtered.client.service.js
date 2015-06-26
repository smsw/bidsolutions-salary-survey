'use strict';

//Salaries service used to communicate SalariesFiltered REST endpoint
angular.module('salaries').factory('SalariesFiltered', ['$resource', function ($resource) {
    return $resource('salaries/search');
}]);
