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
 * Populate our response to parse
 * @param data
 * @returns {*[]}
 */
var populateResponse = function (data) {
    return [
        {
            name: 'Minimum Basic Salary',
            type: 'column',
            yAxis: 1,
            // Goes in order of Categories
            data: pickData('salary', 'minimum', data),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Basic Salary',
            type: 'column',
            yAxis: 1,
            data: pickData('salary', 'average', data),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Median Basic Salary',
            type: 'column',
            yAxis: 1,
            data: pickData('salary', 'median', data),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Maximum Basic Salary',
            type: 'column',
            yAxis: 1,
            data: pickData('salary', 'maximum', data),
            tooltip: {
                valueSuffix: '(GBP)'
            }
        },
        {
            name: 'Average Age',
            type: 'spline',
            data: pickData('average_age', '', data),
            tooltip: {
                valueSuffix: ''
            }
        }
    ];
};


/***
 * List of Salaries filtered by Query
 * @param req
 * @param res
 */
exports.list = function (req, res, next) {

    // @TODO: Refactor
    console.log(req.query);

    var age_splitter = function () {
        var min_age, max_age,
            salary = req.query || {};

        salary.age = salary.age || "0,100";

        min_age = salary.age.split(',')[0];
        max_age = salary.age.split(',')[1];

        return {
            min: min_age,
            max: max_age
        }
    };

    console.log(age_splitter());

    var query_copy = req.query;
    query_copy.age = {$gte: age_splitter().min, $lte: age_splitter().max};

    console.log(query_copy);


    Salary.find(query_copy)
        .exec(function (err, salaries) {
            if (err) { return next(err); }

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

            var dataByJobTitles = [];
            _.forEach(jobTitlesArr, function (value, key) {
                dataByJobTitles.push(
                    {
                        name: value.name,
                        salary: {
                            average: calculateAverage('salary', filterData(value.name, 'bs_job_title', salaries)),
                            median: calculateMedian('salary', filterData(value.name, 'bs_job_title', salaries)),
                            maximum: calculateMinMaxValue('salary', 'max', filterData(value.name, 'bs_job_title', salaries)),
                            minimum: calculateMinMaxValue('salary', 'min', filterData(value.name, 'bs_job_title', salaries))
                        },
                        average_age: calculateAverage('age', filterData(value.name, 'bs_job_title', salaries))
                    }
                );
            });

            res.jsonp(
                [
                    {
                        chart: populateResponse(dataByJobTitles),
                        table: dataByJobTitles
                    }
                ]);

        });
};
