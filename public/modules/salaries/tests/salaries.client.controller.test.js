'use strict';

(function() {
	// Salaries Controller Spec
	describe('Salaries Controller Tests', function() {
		// Initialize global variables
		var SalariesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Salaries controller.
			SalariesController = $controller('SalariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Salary object fetched from XHR', inject(function(Salaries) {
			// Create sample Salary using the Salaries service
			var sampleSalary = new Salaries({
				name: 'New Salary'
			});

			// Create a sample Salaries array that includes the new Salary
			var sampleSalaries = [sampleSalary];

			// Set GET response
			$httpBackend.expectGET('salaries').respond(sampleSalaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.salaries).toEqualData(sampleSalaries);
		}));

		it('$scope.findOne() should create an array with one Salary object fetched from XHR using a salaryId URL parameter', inject(function(Salaries) {
			// Define a sample Salary object
			var sampleSalary = new Salaries({
				name: 'New Salary'
			});

			// Set the URL parameter
			$stateParams.salaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/salaries\/([0-9a-fA-F]{24})$/).respond(sampleSalary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.salary).toEqualData(sampleSalary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Salaries) {
			// Create a sample Salary object
			var sampleSalaryPostData = new Salaries({
				name: 'New Salary'
			});

			// Create a sample Salary response
			var sampleSalaryResponse = new Salaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Salary'
			});

			// Fixture mock form input values
			scope.name = 'New Salary';

			// Set POST response
			$httpBackend.expectPOST('salaries', sampleSalaryPostData).respond(sampleSalaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Salary was created
			expect($location.path()).toBe('/salaries/' + sampleSalaryResponse._id);
		}));

		it('$scope.update() should update a valid Salary', inject(function(Salaries) {
			// Define a sample Salary put data
			var sampleSalaryPutData = new Salaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Salary'
			});

			// Mock Salary in scope
			scope.salary = sampleSalaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/salaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/salaries/' + sampleSalaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid salaryId and remove the Salary from the scope', inject(function(Salaries) {
			// Create new Salary object
			var sampleSalary = new Salaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Salaries array and include the Salary
			scope.salaries = [sampleSalary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/salaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSalary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.salaries.length).toBe(0);
		}));
	});
}());