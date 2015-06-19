'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Salary = mongoose.model('Salary'),
	_ = require('lodash');

/**
 * Create a Salary
 */
exports.create = function(req, res) {
	var salary = new Salary(req.body);
	salary.user = req.user;

	salary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(salary);
		}
	});
};

/**
 * Show the current Salary
 */
exports.read = function(req, res) {
	res.jsonp(req.salary);
};

/**
 * Update a Salary
 */
exports.update = function(req, res) {
	var salary = req.salary ;

	salary = _.extend(salary , req.body);

	salary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(salary);
		}
	});
};

/**
 * Delete an Salary
 */
exports.delete = function(req, res) {
	var salary = req.salary ;

	salary.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(salary);
		}
	});
};

/**
 * List of Salaries
 */
exports.list = function(req, res) {
	Salary.find().sort('-created').select('-_id -created -name').exec(function(err, salaries) {

		var ip = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
		if (ip !== '::1') {
			return res.status(403).send({
				message: 'Remote access not allowed'
			});
		}

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(salaries);
		}
	});
};

/**
 * Salary middleware
 */
exports.salaryByID = function(req, res, next, id) { 
	Salary.findById(id).populate('user', 'displayName').exec(function(err, salary) {
		if (err) return next(err);
		if (! salary) return next(new Error('Failed to load Salary ' + id));
		req.salary = salary ;
		next();
	});
};

/**
 * Salary authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.salary.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
