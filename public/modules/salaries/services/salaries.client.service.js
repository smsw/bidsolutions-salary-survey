'use strict';

//Salaries service used to communicate Salaries REST endpoints
angular.module('salaries')

    .factory('Salaries', ['$resource',
        function($resource) {
            return $resource('salaries/:salaryId', { salaryId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }]
);