'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var salaries = require('../../app/controllers/salaries.server.controller');

    // Salaries Routes
    app.route('/salaries')
        .get(salaries.list)
        .post(users.requiresLogin, salaries.create);

    app.route('/salaries/:salaryId')
        .get(salaries.read)
        .put(users.requiresLogin, salaries.hasAuthorization, salaries.update)
        .delete(users.requiresLogin, salaries.hasAuthorization, salaries.delete);

    // Finish by binding the Salary middleware
    app.param('salaryId', salaries.salaryByID);
};
