'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Salary = mongoose.model('Salary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, salary;

/**
 * Salary routes tests
 */
describe('Salary CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Salary
		user.save(function() {
			salary = {
				name: 'Salary Name'
			};

			done();
		});
	});

	it('should be able to save Salary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salary
				agent.post('/salaries')
					.send(salary)
					.expect(200)
					.end(function(salarySaveErr, salarySaveRes) {
						// Handle Salary save error
						if (salarySaveErr) done(salarySaveErr);

						// Get a list of Salaries
						agent.get('/salaries')
							.end(function(salariesGetErr, salariesGetRes) {
								// Handle Salary save error
								if (salariesGetErr) done(salariesGetErr);

								// Get Salaries list
								var salaries = salariesGetRes.body;

								// Set assertions
								(salaries[0].user._id).should.equal(userId);
								(salaries[0].name).should.match('Salary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Salary instance if not logged in', function(done) {
		agent.post('/salaries')
			.send(salary)
			.expect(401)
			.end(function(salarySaveErr, salarySaveRes) {
				// Call the assertion callback
				done(salarySaveErr);
			});
	});

	it('should not be able to save Salary instance if no name is provided', function(done) {
		// Invalidate name field
		salary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salary
				agent.post('/salaries')
					.send(salary)
					.expect(400)
					.end(function(salarySaveErr, salarySaveRes) {
						// Set message assertion
						(salarySaveRes.body.message).should.match('Please fill Salary name');
						
						// Handle Salary save error
						done(salarySaveErr);
					});
			});
	});

	it('should be able to update Salary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salary
				agent.post('/salaries')
					.send(salary)
					.expect(200)
					.end(function(salarySaveErr, salarySaveRes) {
						// Handle Salary save error
						if (salarySaveErr) done(salarySaveErr);

						// Update Salary name
						salary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Salary
						agent.put('/salaries/' + salarySaveRes.body._id)
							.send(salary)
							.expect(200)
							.end(function(salaryUpdateErr, salaryUpdateRes) {
								// Handle Salary update error
								if (salaryUpdateErr) done(salaryUpdateErr);

								// Set assertions
								(salaryUpdateRes.body._id).should.equal(salarySaveRes.body._id);
								(salaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Salaries if not signed in', function(done) {
		// Create new Salary model instance
		var salaryObj = new Salary(salary);

		// Save the Salary
		salaryObj.save(function() {
			// Request Salaries
			request(app).get('/salaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Salary if not signed in', function(done) {
		// Create new Salary model instance
		var salaryObj = new Salary(salary);

		// Save the Salary
		salaryObj.save(function() {
			request(app).get('/salaries/' + salaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', salary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Salary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salary
				agent.post('/salaries')
					.send(salary)
					.expect(200)
					.end(function(salarySaveErr, salarySaveRes) {
						// Handle Salary save error
						if (salarySaveErr) done(salarySaveErr);

						// Delete existing Salary
						agent.delete('/salaries/' + salarySaveRes.body._id)
							.send(salary)
							.expect(200)
							.end(function(salaryDeleteErr, salaryDeleteRes) {
								// Handle Salary error error
								if (salaryDeleteErr) done(salaryDeleteErr);

								// Set assertions
								(salaryDeleteRes.body._id).should.equal(salarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Salary instance if not signed in', function(done) {
		// Set Salary user 
		salary.user = user;

		// Create new Salary model instance
		var salaryObj = new Salary(salary);

		// Save the Salary
		salaryObj.save(function() {
			// Try deleting Salary
			request(app).delete('/salaries/' + salaryObj._id)
			.expect(401)
			.end(function(salaryDeleteErr, salaryDeleteRes) {
				// Set message assertion
				(salaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Salary error error
				done(salaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Salary.remove().exec();
		done();
	});
});