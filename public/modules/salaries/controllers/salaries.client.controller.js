'use strict';

// Salaries controller
angular.module('salaries').controller('SalariesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Salaries',
  function ($scope, $stateParams, $location, $filter, Authentication, Salaries) {
    $scope.authentication = Authentication;

    /*
      // To be put into a service

      // Arrange data for highcharts
      Salaries.query({}, function (data) {
        $scope.salary_data = [];

        angular.forEach(data, function (value, key) {
          this.push({
            name: value.name,
            gender: value.gender,
            employment_type: value.employment_type,
            y: value.salary
          });
        }, $scope.salary_data);
        console.log('Prepared Salary object for Highcharts!');
      });
    */

    // Sample data for now
    $scope.salary_data = [{
        name: 'Jen',
        gender: 'f',
        employment_type: 'secondary',
        current_role: 'Bid Manager',
        y: 2000
      },
      {
        name: 'Bob',
        gender: 'm',
        employment_type: 'primary',
        current_role: 'Bid Manager',
        y: 1200
      },
      {
        name: 'John',
        gender: 'm',
        employment_type: 'secondary',
        current_role: 'Document Manager',
        y: 1000
      },
      {
        name: 'Lucy',
        gender: 'f',
        employment_type: 'primary',
        current_role: 'Document Manager',
        y: 2500
      },
      {
        name: 'Claire',
        gender: 'f',
        employment_type: 'secondary',
        current_role: 'Proposal Manager',
        y: 2500
      }
    ];


    $scope.selectionChange = function () {
      var data = angular.copy($scope.salary_data);
      var salaryObj = $scope.salary;
      console.log(salaryObj);
      $scope.filtered = $filter('filter')(data, salaryObj);
    };

    $scope.selectionChange();


    // Create new Salary
    $scope.create = function () {
      // Create new Salary object
      var salary = new Salaries({
        name: this.name,
        salary: this.salary,
        bonus: this.bonus,
        gender: this.gender,
        employment_location: this.employment_location,
        employment_type: this.employment_type,
        working_practice: this.working_practice
      });

      // Redirect after save
      salary.$save(function (response) {
        $location.path('salaries/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.salary = '';
        $scope.bonus = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Salary
    $scope.remove = function (salary) {
      if (salary) {
        salary.$remove();

        for (var i in $scope.salaries) {
          if ($scope.salaries [i] === salary) {
            $scope.salaries.splice(i, 1);
          }
        }
      } else {
        $scope.salary.$remove(function () {
          $location.path('salaries');
        });
      }
    };

    // Update existing Salary
    $scope.update = function () {
      var salary = $scope.salary;

      salary.$update(function () {
        $location.path('salaries/' + salary._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Salaries
    $scope.find = function () {
      $scope.salaries = Salaries.query();
    };

    // Find existing Salary
    $scope.findOne = function () {
      $scope.salary = Salaries.get({
        salaryId: $stateParams.salaryId
      });
    };

  }
]);