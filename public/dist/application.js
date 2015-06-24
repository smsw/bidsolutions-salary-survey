'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'salarysurvey';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
		//$locationProvider.html5Mode(true);
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('salaries');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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

'use strict';

angular.module('salaries').controller('SalariesFilterController', ['$scope', 'Salaries', '$filter', 'Authentication', '$location',
    function ($scope, Salaries, $filter, Authentication, $location) {
        // Salaries filter controller logic
        // ...

        $scope.authentication = Authentication;

        var Salary = Salaries.query();

        // Called on the view with ng-init
        // When Data is ready, run functions that require our promised data
        $scope.initSalaryFunctions = function (newData) {
            Salary.$promise.then(function (data) {

                if (newData) {
                    console.log('New data has come in', newData);
                    data = newData;
                } else {
                    console.log('Using data with no filters', data);
                    $scope.rawData = data;
                }

                // Store job titles to iterate over
                // We could also iterate over the existing data and pull a unique list of job titles instead...
                var jobTitlesArr = [
                    {name: 'Bid Manager'},
                    {name: 'Document Manager'},
                    {name: 'Graphic Designer'},
                    {name: 'Head of Bid Management'},
                    {name: 'Head of Proposal Management'},
                    {name: 'Knowledgebase Manager'},
                    {name: 'Proposal Manager'},
                    {name: 'Proposal Writer'}
                ];

                $scope.dataByJobTitles = [];
                angular.forEach(jobTitlesArr, function (value, key) {
                    $scope.dataByJobTitles.push(
                        {
                            name: value.name,
                            salary: {
                                average: $scope.calculateAverage('salary', $scope.filterData(value.name, 'bs_job_title', data)),
                                median: $scope.calculateMedian($scope.filterData(value.name, 'bs_job_title', data)),
                                maximum: $scope.calculateMinMaxValue('max', $scope.filterData(value.name, 'bs_job_title', data)),
                                minimum: $scope.calculateMinMaxValue('min', $scope.filterData(value.name, 'bs_job_title', data))
                            },
                            average_age: $scope.calculateAverage('age', $scope.filterData(value.name, 'bs_job_title', data))
                        }
                    );
                });
                console.log('Populate our graph;', $scope.dataByJobTitles);
                $scope.populateDataColumn($scope.dataByJobTitles);
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
            /*
             $scope.dataColumns = [];

             return $scope.dataColumns.push
             (
             data
             );
             */

            // Suited Format for HighCharts
            $scope.dataColumns = [
                {
                    name: 'Minimum Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    // Goes in order of Categories
                    data: $scope.pickData('salary', 'minimum', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Average Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'average', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Median Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'median', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Maximum Basic Salary',
                    type: 'column',
                    yAxis: 1,
                    data: $scope.pickData('salary', 'maximum', data),
                    tooltip: {
                        valueSuffix: '(GBP)'
                    }
                },
                {
                    name: 'Average Age',
                    type: 'spline',
                    data: $scope.pickData('average_age', '', data),
                    tooltip: {
                        valueSuffix: ''
                    }
                }
            ];
        };

        /***
         * Pick a property and return its values
         * @param prop
         * @param type
         * @param data
         * @returns {*}
         */
        $scope.pickData = function (prop, type, data) {

            return data.map(function (o) {
                if (type !== '') {
                    return o[prop][type];
                } else {
                    return parseInt(o[prop]) || 0;
                }
            });
        };

        /***
         * Calculate Average
         * @param data
         * @returns {number}
         */
        $scope.calculateAverage = function (prop, data) {
            // add up all numbers
            var totalValue = 0;

            // iterate over property and add its value to total
            angular.forEach(data, function (value, key) {
                totalValue += value[prop];
            });

            // divide by how many numbers and return value
            return parseInt(Math.floor(totalValue / data.length)) || 0;
        };

        /***
         * Calculate Min/Max Value
         * @param prop
         * @param data
         * @returns {*}
         */
        $scope.calculateMinMaxValue = function (prop, data) {
            var values = data.map(function (o) {
                // Pluck Salary values only
                return o.salary;
            })
                .filter(function (val) {
                    // Filter out null as that gives a value of 0
                    return val !== null;
                });

            return parseInt(Math[prop].apply(Math, values)) || 0;
        };

        /***
         * Calculate Median
         * https://gist.github.com/caseyjustus/1166258
         * @param prop
         * @returns {*}
         */
        $scope.calculateMedian = function (data) {

            var values = data.map(function (o) {
                // Pluck Salary values only
                return o.salary;
            });

            values.sort(function (a, b) {
                return a - b;
            });
            var half = Math.floor(values.length / 2);

            if (values.length % 2)
                return parseInt(values[half]) || 0;
            else
                return parseInt((values[half - 1] + values[half]) / 2.0) || 0;
        };

        /***
         * Filter Update
         * Called when ng-change is detected
         */
        $scope.filterUpdate = function () {
            $scope.copiedChartData = angular.copy($scope.rawData);
            $scope.initSalaryFunctions($filter('filter')($scope.copiedChartData, $scope.salary));
        };
    }
]);

'use strict';

angular.module('salaries').controller('SalariesFilteredController', ['$scope', 'SalariesFiltered', '$filter', 'Authentication', '$location',
    function ($scope, SalariesFiltered, $filter, Authentication, $location) {
        // Salaries filtered controller logic
        // ...

        /***
         * Retrieve data from our service
         */
        $scope.chartUpdate = function () {

            console.log($scope.salary);

            var Salary = new SalariesFiltered.query($scope.salary);

            Salary.$promise.then(function (data) {
                $scope.chartData = data[0].chart;
                $scope.tableData = data[0].table;
            });
        };

        /***
         * Filter Update
         * Called when ng-change is detected
         */
        $scope.filterUpdate = function () {

            // Catch empty filter values, and remove from query
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

'use strict';

// Salaries controller
angular.module('salaries').controller('SalariesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Salaries',
    function ($scope, $stateParams, $location, $filter, Authentication, Salaries) {
        $scope.authentication = Authentication;

        // Create new Salary
        $scope.create = function () {
            // Create new Salary object
            var salary = new Salaries({
                name: this.name,
                salary: this.salary,
                day_charge_rate: this.day_charge_rate,
                total_value: this.total_value,
                bonus: this.bonus,
                gender: this.gender,
                age: this.age,
                employment_location: this.employment_location,
                employment_type: this.employment_type,
                employment_status: this.employment_status,
                working_practice: this.working_practice,
                total_contract_earnings: this.total_contract_earnings,
                bs_job_title: this.bs_job_title,
                contract_job_title: this.contract_job_title,
                highest_education: this.highest_education,
                industry_experience: this.industry_experience,
                primary_industry: this.primary_industry
            });

            // Redirect after save
            salary.$save(function (response) {
                $location.path('salaries/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.salary = '';
                $scope.bonus = '';
                $scope.gender = '';
                $scope.employment_location = '';
                $scope.employment_type = '';
                $scope.employment_role = '';
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

'use strict';

angular.module('salaries').directive('salaryBarchart', [
    function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                chartData: '='
            },
            controller: ["scope", "element", "attrs", function (scope, element, attrs) {

                scope.$watch('chartData', function () {
                    drawPlot();
                });

                var drawPlot = function () {
                    // jshint ignore: start
                    new Highcharts.Chart({

                        chart: {
                            renderTo: element[0]
                        },
                        title: {
                            text: ' '
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: ['Bid Manager', 'Document Manager', 'Graphic Designer', 'Head of Bid Management',
                                'Head of Proposal Management', 'Knowledgebase Manager', 'Proposal Manager', 'Proposal Writer']
                        }],
                        yAxis: [
                            { // Secondary yAxis
                                title: {
                                    text: 'Age',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                opposite: true
                            },
                            { // Secondary yAxis

                                title: {
                                    text: 'GBP',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                labels: {
                                    format: '£ {value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                }
                            }
                        ],
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            x: 0,
                            y: 20,
                            verticalAlign: 'top',
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        series: scope.chartData
                    });
                };
                // jshint ignore: end
            }]
        };
    }
]);

'use strict';

//Salaries service used to communicate SalariesFiltered REST endpoint
angular.module('salaries')

    .factory('SalariesFiltered', ['$resource',
        function ($resource) {
            return $resource('salaries/search');
        }]
);



'use strict';

//Salaries service used to communicate Salaries REST endpoints
angular.module('salaries')

    .factory('Salaries', ['$resource',
        function ($resource) {
            return $resource('salaries/:salaryId', {
                salaryId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }]
);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);