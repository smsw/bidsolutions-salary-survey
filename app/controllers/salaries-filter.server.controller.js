'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Salary = mongoose.model('Salary'),
    _ = require('lodash');

/***
 * Pick a property and return values
 * @param prop
 * @param type
 * @param data
 * @returns {*}
 */
var pickData = function (prop, type, data) {
    return data.map(function (o) {
        if (type !== '') {
            return o[prop][type];
        } else {
            return parseInt(o[prop]) || 0;
        }
    });
};

/***
 * Filter data by various params
 * @param filter
 * @param prop
 * @param data
 * @returns {Array}
 */
var filterData = function (filter, prop, data) {
    var result = [];

    _.forEach(data, function (value, key) {
        if (value[prop] === filter) {
            result.push(value);
        }
    });
    return result;
};

/***
 * Calculate total
 * @param prop
 * @param data
 * @returns {Number|number}
 */
var calculateTotal = function (data) {
    // add up all numbers
    var totalValue = 0;

    _.forEach(data, function (value, key) {
        totalValue++;
    });

    return totalValue;
};

/***
 * Calculate Average
 * @param prop
 * @param data
 * @returns {Number|number}
 */
var calculateAverage = function (prop, data) {
    // add up all numbers
    var totalValue = 0;

    _.forEach(data, function (value, key) {
        totalValue += value[prop];
    });

    return parseInt(Math.floor(totalValue / data.length)) || 0;
};

/***
 * Calculate Min/Max Value
 * @param prop
 * @param data
 * @returns {*}
 */
var calculateMinMaxValue = function (prop, minMax, data) {
    var values = data.map(function (o) {
        // Pluck Salary values only
        return o[prop];
    })
        .filter(function (val) {
            // Filter out null as that gives a value of 0
            return val !== null;
        });

    return parseInt(Math[minMax].apply(Math, values)) || 0;
};

/***
 * Calculate Median
 * https://gist.github.com/caseyjustus/1166258
 * @param prop
 * @returns {*}
 */
var calculateMedian = function (prop, data) {

    var values = data.map(function (o) {
        // Pluck Salary values only
        return o[prop];
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
 * Create object based on Job Title
 * @param prop
 * @param data
 * @returns {Array}
 */
var createByJobTitle = function (prop, data) {

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

    var dataByJobTitles = [];
    var total = 0;

    // @TODO: Refactor, push prop into object name
    if (prop === 'day_charge_rate') {
        _.forEach(jobTitlesArr, function (value, key) {
            total = calculateTotal(filterData(value.name, 'bs_job_title', data));
            dataByJobTitles.push({
                name: value.name,
                day_charge_rate: {
                    average: total > 5 ? calculateAverage('day_charge_rate', filterData(value.name, 'bs_job_title', data)) : 0,
                    median: total > 5 ? calculateMedian('day_charge_rate', filterData(value.name, 'bs_job_title', data)) : 0,
                    maximum: total > 5 ? calculateMinMaxValue('day_charge_rate', 'max', filterData(value.name, 'bs_job_title', data)) : 0,
                    minimum: total > 5 ? calculateMinMaxValue('day_charge_rate', 'min', filterData(value.name, 'bs_job_title', data)) : 0
                },
                average_age: total > 5 ? calculateAverage('age', filterData(value.name, 'bs_job_title', data)) : 0,
                total: total
            });
        });
        return dataByJobTitles;
    } else {
        _.forEach(jobTitlesArr, function (value, key) {
            total = calculateTotal(filterData(value.name, 'bs_job_title', data));
            dataByJobTitles.push({
                name: value.name,
                salary: {
                    average: total > 5 ? calculateAverage('salary', filterData(value.name, 'bs_job_title', data)) : 0,
                    median: total > 5 ? calculateMedian('salary', filterData(value.name, 'bs_job_title', data)) : 0,
                    maximum: total > 5 ? calculateMinMaxValue('salary', 'max', filterData(value.name, 'bs_job_title', data)) : 0,
                    minimum: total > 5 ? calculateMinMaxValue('salary', 'min', filterData(value.name, 'bs_job_title', data)) : 0
                },
                average_age: total > 5 ? calculateAverage('age', filterData(value.name, 'bs_job_title', data)) : 0,
                total: total
            });
        });
        return dataByJobTitles;
    }
};

/***
 * Populate our response to parse
 * @param data
 * @returns {*[]}
 */
var populateResponse = function (prop, data, name) {

    var jobTitles = createByJobTitle(prop, data);
    return [
        {
            name: 'Minimum Basic ' + name,
            type: 'column',
            yAxis: 1,
            // Goes in order of Categories
            data: pickData(prop, 'minimum', jobTitles),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Basic ' + name,
            type: 'column',
            yAxis: 1,
            data: pickData(prop, 'average', jobTitles),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Median Basic ' + name,
            type: 'column',
            yAxis: 1,
            data: pickData(prop, 'median', jobTitles),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Maximum Basic ' + name,
            type: 'column',
            yAxis: 1,
            data: pickData(prop, 'maximum', jobTitles),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Age',
            type: 'spline',
            data: pickData('average_age', '', jobTitles),
            tooltip: {
                valueSuffix: ''
            }
        }
    ];
};


/***
 * Split Age Values into seperate values
 * @returns {{min: *, max: *}}
 */
var age_splitter = function (req) {
    var min_age, max_age,
        salary = req.query || {};

    salary.age = salary.age || '0,100';

    min_age = salary.age.split(',')[0];
    max_age = salary.age.split(',')[1];

    return {
        min: min_age,
        max: max_age
    };
};


/***
 * List of Salaries filtered by Query
 * @param req
 * @param res
 */
exports.list = function (req, res, next) {

    var newQuery = req.query;
    newQuery.age = {$gte: age_splitter(req).min, $lte: age_splitter(req).max};

    if (newQuery.employment_status === 'Self-Employed, Independent Consultant or Freelance') {
        // We need to create a query by day earnings and not by salary
        Salary.find(newQuery)
            .exec(function (err, salaries) {
                if (err) {
                    return next(err);
                }
                res.jsonp([{
                    chart: populateResponse('day_charge_rate', salaries, 'Day Charge Rate'),
                    table: createByJobTitle('day_charge_rate', salaries),
                    type: 'day_charge_rate'
                }]);
            });

    } else {
        Salary.find(newQuery)
            .exec(function (err, salaries) {
                if (err) {
                    return next(err);
                }
                res.jsonp([{
                    chart: populateResponse('salary', salaries, 'Salary'),
                    table: createByJobTitle('salary', salaries),
                    type: 'salary'
                }]);
            });
    }
};
