'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Salary Schema
 */
var SalarySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Salary name',
		trim: true
	},
    salary: {
        type: Number,
        default: '',
        required: 'Please enter a Figure for the Salary',
        trim: true
    },
    bonus: {
        type: Number,
        default: '',
        required: 'Please enter a Figure for the Bonus',
        trim: true
    },
    gender: {
        type: String,
        default: 'Please select a Gender',
        trim: true
    },
    employment_location: {
        type: String,
        default: 'Please select a location!',
        trim: true
    },
    employment_type: {
        type: String,
        default: 'What type of Employment?',
        trim: true
    },
    working_practice: {
        type: String,
        default: 'Please specify the working practice!',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Salary', SalarySchema);