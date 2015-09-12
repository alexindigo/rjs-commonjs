var assert      = require('assert');
var fs          = require('fs');
var rjsCommonjs = require('./index.js');

var inputFile    = './test/input.js';
var expectedFile = './test/expected.js';

var input    = fs.readFileSync(inputFile, {encoding: 'utf8'});
var expected = fs.readFileSync(expectedFile, {encoding: 'utf8'});

var moduleName = 'rendr/client/app_view';
var output = rjsCommonjs(moduleName, input);

// assert input and expected as different
assert.notEqual(input, expected, 'Input and output should be different from one another');
// assert input and expected as different
assert.equal(output, expected, 'Output should match expected string');
