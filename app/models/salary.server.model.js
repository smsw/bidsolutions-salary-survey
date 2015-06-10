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
		required: '',
		trim: true
	},
    salary: {
        type: Number,
        default: '',
        required: '',
        trim: true
    },
    bonus: {
        type: Number,
        default: '',
        required: '',
        trim: true
    },
    total_value: {
        type: Number,
        default: '',
        required: '',
        trim: true
    },
    day_charge_rate: {
        type: Number,
        default: '',
        required: '',
        trim: true
    },
    total_contract_earnings: {
        type: Number,
        default: '',
        required: '',
        trim: true
    },
    bs_job_title: {
        type: String,
        default: '',
        trim: true
    },
    contract_job_title: {
        type: String,
        default: '',
        trim: true
    },
    highest_education: {
        type: String,
        default: '',
        trim: true
    },
    industry_experience: {
        type: String,
        default: '',
        trim: true
    },
    gender: {
        type: String,
        default: '',
        trim: true
    },
    age: {
        type: Number,
        default: '',
        trim: true
    },
    employment_location: {
        type: String,
        default: '',
        trim: true
    },
    primary_industry: {
        type: String,
        default: '',
        trim: true
    },
    employment_status: {
        type: String,
        default: '',
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
