'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Salary = mongoose.model('Salary'),
    _ = require('lodash');


var response =
    [
        {
            name: 'Minimum Basic Salary',
            type: 'column',
            yAxis: 1,
            // Goes in order of Categories
            data: 0,
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Basic Salary',
            type: 'column',
            yAxis: 1,
            data: 0,
            //data: $scope.pickData('salary', 'average', data),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Median Basic Salary',
            type: 'column',
            yAxis: 1,
            data: 0,
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Maximum Basic Salary',
            type: 'column',
            yAxis: 1,
            data: 0,
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Age',
            type: 'spline',
            data: 0,
            tooltip: {
                valueSuffix: ''
            }
        }
    ];

/**
 * List of Salaries filters
 */

exports.list = function (req, res) {
    Salary.find(req.query)
        .exec(function (err, salaries, next) {
            if (err) {
                return next(err);
            } else {
                // Populate our response
                response[0].data = calculateMinMaxValue('salary', 'min', salaries);
                response[1].data = calculateAverage('salary', salaries);
                response[3].data = calculateMinMaxValue('salary', 'max', salaries);
                response[2].data = calculateMedian('salary', salaries);
                response[3].data = calculateMinMaxValue('salary', 'max', salaries);
                response[4].data = calculateAverage('age', salaries);
                res.jsonp(response);
            }
        });
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
            return val !== null
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
