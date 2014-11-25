/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ helper

require('../../helper.js');

// }}}
// {{{ assert

var assert = require('power-assert');

// require CLI
require('../../../index.js');

// }}}
// {{{ CLI.Array

describe("CLI.Array", function() {

    var array;

    // {{{ indexOf

    describe("indexOf", function() {

        // {{{ without from argument

        describe("without from argument", function() {

            beforeEach(function() {

                array = [1, 2, 3, 4, 5, 6];

            });

            afterEach(function(){

                array = null;

            });

            it("should always return -1 on an empty array", function(){

                assert.equal(CLI.Array.indexOf([], 1), -1);

            });

            it("should return -1 if them it doesn't exist", function() {

                assert.equal(CLI.Array.indexOf(array, 7), -1);

            });

            it("should return the matching index if found", function() {

                assert.equal(CLI.Array.indexOf(array, 4), 3);

            });

            it("should return the first matching index if found", function(){

                array.push(1);

                assert.equal(CLI.Array.indexOf(array, 1), 0);
            });
        });

        // }}}
        // {{{ with from argument

        describe("with from argument", function() {

            beforeEach(function() {

                array = [1, 2, 3, 4, 5, 6, 7];

            });

            it("should return the matched index if found", function() {

                assert.equal(CLI.Array.indexOf(array, 5, 3), 4);
                assert.equal(CLI.Array.indexOf(array, 5, 4), 4);

            });

            it("should return -1 if the item doesn't exist after the passed from value", function() {

                assert.equal(CLI.Array.indexOf(array, 5, 5), -1);

            });

        });

        // }}}

    });

    // }}}
    // {{{ removing items

    describe("removing items", function() {

        var myArray;

        it("should do nothing when removing from an empty array", function() {

            myArray = [];

            CLI.Array.remove(myArray, 1);

            assert.deepEqual(myArray, []);
        });

        // {{{ when removing an item inside an array

        describe("when removing an item inside an array", function() {

            beforeEach(function() {

                myArray = [1, 2, 3, 4, 5];

                CLI.Array.remove(myArray, 1);
            });

            it("should remove the item", function() {

                assert.deepEqual(myArray, [2, 3, 4, 5]);

            });

            it("should update the index of the following items", function() {

                assert.equal(myArray[1], 3);
                assert.equal(myArray[2], 4);
                assert.equal(myArray[3], 5);

            });

            it("should remove only using a strict type check", function(){

                CLI.Array.remove(myArray, '2');

                assert.deepEqual(myArray, [2, 3, 4, 5]);

            });

        });

        // }}}

    });

    // }}}
    // {{{ contains

    describe("contains", function() {

        it("should always return false with an empty array", function(){

            assert.equal(CLI.Array.contains([], 1), false);

        });

        it("should return false if an item does not exist in the array", function() {

            assert.equal(CLI.Array.contains([1, 2, 3], 10), false);

        });

        it("should return true if an item exists in the array", function() {

            assert.equal(CLI.Array.contains([8, 9, 10], 10), true);

        });

        it("should only match with strict type checking", function(){

            assert.equal(CLI.Array.contains([1, 2, 3, 4, 5], '1'), false);

        });

    });

    // }}}
    // {{{ include

    describe("include", function(){

        var myArray;

        it("should always add to an empty array", function(){

            myArray = [];

            CLI.Array.include(myArray, 1);

            assert.deepEqual(myArray, [1]);

        });

        it("should add the item if it doesn't exist", function(){

            myArray = [1];

            CLI.Array.include(myArray, 2);

            assert.deepEqual(myArray, [1, 2]);
        });

        it("should always add to the end of the array", function(){

            myArray = [9, 8, 7, 6];

            CLI.Array.include(myArray, 10);

            assert.deepEqual(myArray, [9, 8, 7, 6, 10]);

        });

        it("should match using strict type checking", function(){

            myArray = ['1'];

            CLI.Array.include(myArray, 1);

            assert.deepEqual(myArray, ['1', 1]);

        });

        it("should not modify the array if the value exists", function(){

            myArray = [4, 5, 6];

            CLI.Array.include(myArray, 7);

            assert.deepEqual(myArray, [4, 5, 6, 7]);

        });

    });

    // }}}
    // {{{ clone

    describe("clone", function(){

        it("should clone an empty array to be empty", function(){

            assert.deepEqual(CLI.Array.clone([]), []);

        });

        it("should clone an array with items", function(){

            assert.deepEqual(CLI.Array.clone([1, 3, 5]), [1, 3, 5]);

        });

        it("should create a new reference", function(){

            var arr = [1, 2, 3];

            assert.deepEqual(CLI.Array.clone(arr), arr);

        });

        it("should do a shallow clone", function(){

            var o = {},
                arr = [o],
                result;

            result = CLI.Array.clone(arr);

            assert.deepEqual(result[0], o);

        });

    });

    // }}}
    // {{{ clean

    describe("clean", function(){

        it("should return an empty array if cleaning an empty array", function(){

            assert.deepEqual(CLI.Array.clean([]), []);

        });

        it("should remove undefined values", function(){

            assert.deepEqual(CLI.Array.clean([undefined]), []);

        });

        it("should remove null values", function(){

            assert.deepEqual(CLI.Array.clean([null]), []);

        });

        it("should remove empty strings", function(){

            assert.deepEqual(CLI.Array.clean(['']), []);

        });

        it("should remove empty arrays", function(){

            assert.deepEqual(CLI.Array.clean([[]]), []);

        });

        it("should remove a mixture of empty values", function(){

            assert.deepEqual(CLI.Array.clean([null, undefined, '', []]), []);

        });

        it("should remove all occurrences of empty values", function(){

            assert.deepEqual(CLI.Array.clean([null, null, null, undefined, '', '', '', undefined]), []);

        });

        it("should leave non empty values untouched", function(){

            assert.deepEqual(CLI.Array.clean([1, 2, 3]), [1, 2, 3]);

        });

        it("should remove only the empty values", function(){

            assert.deepEqual(CLI.Array.clean([undefined, null, 1, null, 2]), [1, 2]);

        });

        it("should preserve order on removal", function(){

            assert.deepEqual(CLI.Array.clean([1, null, 2, null, null, null, 3, undefined, '', '', 4]), [1, 2, 3, 4]);

        });

    });

    // }}}
    // {{{ unique

    describe("unique", function(){

        it("should return an empty array if run on an empty array", function(){

            assert.deepEqual(CLI.Array.unique([]), []);

        });

        it("should return a new reference", function(){

            var arr = [1, 2, 3];

            assert.deepEqual(CLI.Array.unique(arr), arr);

        });

        it("should return a copy if all items are unique", function(){

            assert.deepEqual(CLI.Array.unique([6, 7, 8]), [6, 7, 8]);

        });

        it("should only use strict typing to match", function(){

            assert.deepEqual(CLI.Array.unique([1, '1']), [1, '1']);

        });

        it("should preserve the order when removing", function(){

            assert.deepEqual(CLI.Array.unique([1, 2, 1, 3, 1, 1, 1, 6, 5, 1]), [1, 2, 3, 6, 5]);

        });

    });

    // }}}
    // {{{ map

    describe("map", function(){

        var emptyFn = function(v){
                return v;
            };

        it("should return an empty array if run on an empty array", function(){

            assert.deepEqual(CLI.Array.map([], function(){}), []);

        });

        it("should return a new reference", function(){

            var arr = [1, 2];

            assert.notEqual(CLI.Array.map(arr, emptyFn), arr);

        });

        it("should execute the function for each item in the array", function(){

            assert.deepEqual(CLI.Array.map([1, 2, 3, 4, 5], function(v){
                return v * 2;
            }), [2, 4, 6, 8, 10]);

        });

        it("should get called with the correct scope", function(){

            var scope = {},
                realScope;

            CLI.Array.map([1, 2, 3, 4, 5], function(){
                realScope = this;
            }, scope);

            assert.deepEqual(realScope, scope);

        });

        it("should get called with the argument, index and array", function(){

            var item,
                index,
                arr,
                data = [1];

            CLI.Array.map(data, function(){
                item = arguments[0];
                index = arguments[1];
                arr = arguments[2];
            });

            assert.equal(item, 1);
            assert.equal(index, 0);
            assert.deepEqual(arr, data);
        });
    });

    // }}}
    // {{{ from

    describe("from", function() {

        it("should return an empty array for an undefined value", function() {

            assert.deepEqual(CLI.Array.from(undefined), []);

        });

        it("should return an empty array for a null value", function() {

            assert.deepEqual(CLI.Array.from(null), []);

        });

        it("should convert an array", function() {

            assert.deepEqual(CLI.Array.from([1, 2, 3]), [1, 2, 3]);

        });

        it("should preserve the order", function() {

            assert.deepEqual(CLI.Array.from(['a', 'string', 'here']), ['a', 'string', 'here']);

        });

        it("should convert a single value to an array", function() {

            assert.deepEqual(CLI.Array.from(true), [true]);
            assert.deepEqual(CLI.Array.from(700), [700]);

        });

        it("should convert arguments to an array", function() {

            var test, fn = function() {
                test = CLI.Array.from(arguments);
            };
            fn(1, 2, 3);

            assert.equal(test instanceof Array, true);
            assert.deepEqual(test, [1, 2, 3]);
        });

        it("should convert a single string", function() {

            assert.deepEqual(CLI.Array.from('Foo'), ['Foo']);

        });

        it("should convert a single function", function() {

            var fn = function() {};

            assert.deepEqual(CLI.Array.from(fn), [fn]);

        });
    });

    // }}}
    // {{{ toArray

    describe("toArray", function() {

        it("should return empty array if the passed value is empty", function() {
            assert.deepEqual(CLI.Array.toArray(false), []);
        });

        it("should convert an array", function() {
            assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4]), [1, 2, 3, 4]);
        });

        it("should convert a string", function() {
            assert.deepEqual(CLI.Array.toArray('12345'), ['1', '2', '3', '4', '5']);
        });

        it("should create a new reference", function() {

            var arr = [6, 7, 8];

            assert.deepEqual(CLI.Array.toArray(arr), arr);

        });

        it("should convert arguments", function() {

            var test, fn = function() {
                test = CLI.Array.toArray(arguments);
            };
            fn(-1, -2, -3);

            assert.equal(test instanceof Array, true);
            assert.deepEqual(test, [-1, -2, -3]);

        });

        // {{{ start/end parameters

        describe("start/end parameters", function() {

            it("should default to whole of the array", function() {

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            });

            it("should work with only the start parameter specified", function() {

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2), [3, 4, 5, 6]);

            });

            it("should work with only the end parameter specified", function() {

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], null, 4), [1, 2, 3, 4]);

            });

            it("should work with both params specified", function() {

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2, 4), [3, 4]);

            });

            it("should work with nagative end", function() {

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2, -1), [3, 4, 5]);

            });

        });

        // }}}

    });

    // }}}
    // {{{ pluck

    describe("pluck", function(){

        it("should return an empty array when an empty array is passed", function(){

            assert.deepEqual(CLI.Array.pluck([], 'prop'), []);

        });

        it("should pull the properties from objects in the array", function(){

            var arr = [{prop: 1}, {prop: 2}, {prop: 3}];

            assert.deepEqual(CLI.Array.pluck(arr, 'prop'), [1, 2, 3]);

        });

        it("should return a new reference", function(){

            var arr = [{prop: 1}, {prop: 2}, {prop: 3}];

            assert.notEqual(CLI.Array.pluck(arr, 'prop', arr));

        });

    });

    // }}}
    // {{{ filter

    describe("filter", function(){

        var trueFn = function(){
                return true;
            };

        it("should return an empty array if filtering an empty array", function(){

            assert.deepEqual(CLI.Array.filter([], trueFn), []);

        });

        it("should create a new reference", function(){

            var arr = [1, 2, 3];

            assert.notEqual(CLI.Array.filter(arr, trueFn), arr);

        });

        it("should add items if the filter function returns true", function(){

            assert.deepEqual(CLI.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                return val % 2 === 0;
            }), [2, 4, 6, 8, 10]);

        });

        it("should add items if the filter function returns a truthy value", function(){

            assert.deepEqual(CLI.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                if (val % 2 === 0) {
                    return 1;
                }
            }), [2, 4, 6, 8, 10]);

        });

        it("should not add items if the filter function returns a falsy value", function(){

            assert.deepEqual(CLI.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                return 0;
            }), []);

        });

        it("should pass the correct parameters", function(){

            var values = [],
                indexes = [],
                arrs = [],
                data = [1, 2, 3];

            CLI.Array.filter([1, 2, 3], function(val, index, arr){
                values.push(val);
                indexes.push(index);
                arrs.push(arr);
            });

            assert.deepEqual(values, [1, 2, 3]);
            assert.deepEqual(indexes, [0, 1, 2]);
            assert.deepEqual(arrs, [data, data, data]);
        });

        it("should do a shallow copy", function(){

            var o1 = {prop: 1},
                o2 = {prop: 2},
                o3 = {prop: 3};

            assert.deepEqual(CLI.Array.filter([o1, o2, o3], trueFn), [o1, o2, o3]);

        });

        it("should execute in scope when passed", function(){

            var scope = {},
                actual;

            assert(CLI.Array.filter([1, 2, 3], function(){
                actual = this;
            }, scope));

            assert.equal(actual, scope);
        });
    });

    // }}}
    // {{{ forEach

    describe("forEach", function(){

        it("should not execute on an empty array", function(){

            var count = 0;

            CLI.Array.forEach([], function(){
                ++count;
            });

            assert.equal(count, 0);

        });

        it("should execute for each item in the array", function(){

            var count = 0;

            CLI.Array.forEach([1, 2, 3, 4, 5], function(){
                ++count;
            });

            assert.equal(count, 5);

        });

        it("should execute in the appropriate scope", function(){

            var scope = {},
                actual;

            CLI.Array.forEach([1, 2, 3], function(){
                actual = this;
            }, scope);

            assert.equal(actual, scope);

        });

        it("should pass the appropriate params to the callback", function(){

            var values = [],
                indexes = [],
                arrs = [],
                data = [1, 2, 3];

            CLI.Array.forEach(data, function(val, index, arr){
                values.push(val);
                indexes.push(index);
                arrs.push(arr);
            });

            assert.deepEqual(values, [1, 2, 3]);
            assert.deepEqual(indexes, [0, 1, 2]);
            assert.deepEqual(arrs, [data, data, data]);

        });

    });

    // }}}
    // {{{ each

    describe("each", function() {

        // {{{ return values

        describe("return values", function() {

            it("should return true if the passed value is empty", function() {
                assert.equal(CLI.Array.each([]), true);
            });

            it("should return the stopping index if iteration is halted", function() {

                assert.equal(CLI.Array.each([1, 2, 3], function(val){
                    return val != 2;
                }), 1);

            });

            it("should return true if iteration is not stopped", function() {

                assert.equal(CLI.Array.each([4, 5, 6], function() {
                    return true;
                }), true);

            });

        });

        // }}}
        // {{{ scope/parameters

        describe("scope/parameters", function() {

            it("should execute in the specified scope", function() {

                var scope = {},
                    actual;

                CLI.Array.each([1, 2, 3], function() {
                    actual = this;
                }, scope);

                assert.equal(actual, scope);
            });

            it("should pass the item, index and array", function() {

                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                CLI.Array.each(data, function(val, index, arr){
                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);
                });

                assert.deepEqual(values, [1, 2, 3]);
                assert.deepEqual(indexes, [0, 1, 2]);
                assert.deepEqual(arrs, [data, data, data]);

            });

        });

        // }}}
        // {{{ stopping iteration

        describe("stopping iteration", function() {

            it("should not stop iteration by default", function() {

                var count = 0;

                CLI.Array.each([1, 2, 3, 4, 5], function() {
                    ++count;
                });

                assert.equal(count, 5);

            });

            it("should not stop unless an explicit false is returned", function() {

                var count = 0;

                CLI.Array.each([1, 2, 3, 4, 5], function() {
                    ++count;
                    return null;
                });

                assert.equal(count, 5);

            });

            it("should stop immediately if false is returned", function() {

                var count = 0;

                CLI.Array.each([1, 2, 3, 4, 5], function(v){
                    ++count;
                    return v != 2;
                });

                assert.equal(count, 2);

            });

        });

        // }}}
        // {{{ other collection types

        describe("other collection types", function() {

            it("should iterate arguments", function() {

                var test, values = [], fn = function() {
                    test = CLI.Array.each(arguments, function(val){
                        values.push(val);
                    });
                };

                fn(1, 2, 3);

                assert.deepEqual(values, [1, 2, 3]);

            });

        });

        // }}}

        it("should iterate once over a single, non empty value", function() {

            var count = 0;

            CLI.Array.each('string', function() {
                ++count;
            });

            assert.equal(count, 1);

        });

        // {{{ reverse iteraction

        describe("reverse iteraction", function() {

            it("should iterate backwards", function() {

                var output = [],
                    input = [1, 2, 3],
                    fn = function(number) {
                        output.push(number);
                    };

                CLI.Array.each(input, fn, undefined, true);

                assert.deepEqual(output, [3, 2, 1]);

            });

            it("should iterate backwards and stop when fn returns false", function() {

                var output = [],
                    input = [1, 2, 3],
                    fn = function(number) {
                        output.push(number);
                        if (number === 2) { return false; }
                    };

                CLI.Array.each(input, fn, undefined, true);

                assert.deepEqual(output, [3, 2]);

            });

        });

        // }}}

    });

    // }}}
    // {{{ every

    describe("every", function(){

        // {{{ scope/params

        describe("scope/params", function(){

            it("should execute in the specified scope", function(){

                var scope = {},
                    actual;

                CLI.Array.every([1, 2, 3], function(){
                    actual = this;
                }, scope);

                assert.equal(actual, scope);

            });

            it("should pass the item, index and array", function(){

                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                CLI.Array.every(data, function(val, index, arr){

                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);

                    return true;
                });

                assert.deepEqual(values, [1, 2, 3]);
                assert.deepEqual(indexes, [0, 1, 2]);
                assert.deepEqual(arrs, [data, data, data]);

            });

        });

        // }}}

        it("should return true on an empty array", function(){

            assert.equal(CLI.Array.every([], function(){}), true);

        });

        it("should throw an exception if no fn is passed", function(){

            beginSilent();
            try {
                CLI.Array.every([1, 2, 3]);
            } catch(e) {
                assert.equal(e.msg, 'CLI.Array.every must have a callback function passed as second argument.');
            }
            endSilent();

        });

        it("should stop as soon as a false value is found", function(){
            var count = 0,
                result;

            result = CLI.Array.every([true, true, false, true], function(v){
                ++count;
                return v;
            });

            assert.equal(count, 3);
            assert.equal(result, false);

        });

        it("should return true if all values match the function", function(){

            assert.equal(CLI.Array.every([1, 2, 3, 4, 5, 6, 7, 8, 9], function(v){
                return v < 10;
            }), true);

        });

    });

    // }}}
    // {{{ some

    describe("some", function(){

        // {{{ scope/params

        describe("scope/params", function(){

            it("should execute in the specified scope", function(){

                var scope = {},
                    actual;

                CLI.Array.some([1, 2, 3], function(){
                    actual = this;
                }, scope);

                assert.equal(actual, scope);

            });

            it("should pass the item, index and array", function(){

                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                CLI.Array.some(data, function(val, index, arr){
                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);
                    return true;
                });

                assert.deepEqual(values, [1]);
                assert.deepEqual(indexes, [0]);
                assert.deepEqual(arrs, [data]);
            });

        });

        // }}}

        it("should return false on an empty array", function(){

            try {
                assert.equal(CLI.Array.some([], function(){}), false);
            } catch (e) {
            }

        });

        it("should throw an exception if no fn is passed", function(){

            beginSilent();
            try {
                CLI.Array.some([1, 2, 3]);
            } catch (e) {
                assert.equal(e.msg, 'CLI.Array.some must have a callback function passed as second argument.');
            }
            endSilent();

        });

        it("should stop as soon as a matching value is found", function(){
            var count = 0,
                result;

            result = CLI.Array.some([1, 2, 3, 4], function(val){
                ++count;
                return val == 3;
            });

            assert.equal(count, 3);
            assert.equal(result, true);

        });

        it("should return false if nothing matches the matcher function", function(){

            var count = 0,
                result;

            result = CLI.Array.some([1, 2, 3, 4, 5, 6, 7, 8, 9], function(val){
                ++count;
                return val > 9;
            });

            assert.equal(count, 9);
            assert.equal(result, false);

        });

    });

    // }}}
    // {{{ merge

    describe("merge", function(){

        it("should return an empty array if run on an empty array", function(){

            assert.deepEqual(CLI.Array.merge([]), []);

        });

        it("should return a new reference", function(){

            var arr = [1, 2, 3];

            assert.deepEqual(CLI.Array.merge(arr), arr);

        });

        it("should return a copy if all items are unique", function(){

            assert.deepEqual(CLI.Array.merge([6, 7, 8]), [6, 7, 8]);

        });

        it("should only use strict typing to match", function(){

            assert.deepEqual(CLI.Array.merge([1, '1']), [1, '1']);

        });

        it("should accept two or more arrays and return a unique union with items in order of first appearance", function(){

            assert.deepEqual(CLI.Array.merge([1, 2, 3], ['1', '2', '3'], [4, 1, 5, 2], [6, 3, 7, '1'], [8, '2', 9, '3']), [1, 2, 3, '1', '2', '3', 4, 5, 6, 7, 8, 9]);

        });

    });

    // }}}
    // {{{ intersect

    describe("intersect", function(){

        it("should return an empty array if no arrays are passed", function(){

            assert.deepEqual(CLI.Array.intersect(), []);

        });

        it("should return an empty array if one empty array is passed", function(){

            assert.deepEqual(CLI.Array.intersect([]), []);

        });

        it("should return a new reference", function(){

            var arr = [1, 2, 3];

            assert.notEqual(CLI.Array.intersect(arr), arr);

        });

        it("should return a copy if one array is passed", function(){

            assert.deepEqual(CLI.Array.intersect([6, 7, 8]), [6, 7, 8]);

        });

        it("should return an intersection of two or more arrays with items in order of first appearance", function(){

            assert.deepEqual(CLI.Array.intersect([1, 2, 3], [4, 3, 2, 5], [2, 6, 3]), [2, 3]);

        });

        it("should return an empty array if there is no intersecting values", function(){

            assert.deepEqual(CLI.Array.intersect([1, 2, 3], [4, 5, 6]), []);

        });

        it("should contain the unique set of intersected values only", function(){

            assert.deepEqual(CLI.Array.intersect([1, 1, 2, 3, 3], [1, 1, 2, 3, 3]), [1, 2, 3]);

        });

        it("should only use strict typing to match", function(){

            assert.deepEqual(CLI.Array.intersect([1], ['1']), []);

        });

        it("should handle arrays containing falsy values", function() {

            assert.deepEqual(CLI.Array.intersect([undefined, null, false, 0, ''], [undefined, null, false, 0, '']), [undefined, null, false, 0, '']);

        });

    });

    // }}}
    // {{{ difference

    describe("difference", function(){

        it("should return a set difference of two arrays with items in order of first appearance", function(){

            assert.deepEqual(CLI.Array.difference([1, 2, 3, 4], [3, 2]), [1, 4]);

        });

        it("should return the first array unchanged if there is no difference", function(){

            assert.deepEqual(CLI.Array.difference([1, 2, 3], [4, 5, 6]), [1, 2, 3]);

        });

        it("should return a new reference", function(){

            var arr = [1, 2, 3];

            assert.notDeepEqual(CLI.Array.difference(arr, [3, 2]), arr);

        });

        it("should remove multiples of the same value from the first array", function(){

            assert.deepEqual(CLI.Array.difference([1, 2, 3, 2, 4, 1], [2, 1]), [3, 4]);

        });

        it("should only use strict typing to match", function(){

            assert.deepEqual(CLI.Array.difference([1], ['1']), [1]);

        });

    });

    // }}}
    // {{{ sort

    describe("sort", function() {

       var sarray, narray;

       beforeEach(function() {
          sarray = ['bbb', 'addda', 'erere', 'fff', 'de3'];
          narray = [1,3,2,4,6,7];
       });

       // {{{ with strings

       describe("with strings", function() {

           it("should be able to sort an array without sortFn", function() {

                CLI.Array.sort(sarray);

                assert.deepEqual(sarray, ['addda', 'bbb', 'de3', 'erere', 'fff']);

           });

           it("should be able to use a sortFn that returns a Number", function() {

                CLI.Array.sort(sarray, function(a,b){
                    if (a === b) {
                        return 0;
                    }
                    return  a > b ? 1: -1;
                });

                assert.deepEqual(sarray, ['addda', 'bbb', 'de3', 'erere', 'fff']);
           });

       });

       // }}}
       // {{{ with numbers

       describe("with numbers", function() {

           it("should be able to sort an array without sortFn", function() {

                CLI.Array.sort(narray);

                assert.deepEqual(narray, [1,2,3,4,6,7]);

           });

           it("should be able to use a sortFn that returns a Number", function() {

                CLI.Array.sort(narray, function(a,b){
                    return a - b;
                });

                assert.deepEqual(narray, [1,2,3,4,6,7]);

           });

       });

       // }}}

    });

    // }}}
    // {{{ min

    describe("min", function() {

        // {{{ numbers

        describe("numbers", function() {

            it("without comparisonFn", function() {

                assert.equal(CLI.Array.min([1,2,3,4,5,6]), 1);
                assert.equal(CLI.Array.min([6,5,4,3,2,1]), 1);

            });

            it("with comparisonFn", function() {

                assert.equal(CLI.Array.min([1,2,3,4,5,6], function(a, b) { return a < b ? 1 : -1; }), 6);

            });

        });

        // }}}

    });

    // }}}
    // {{{ max

    describe("max", function() {

        // {{{ numbers

        describe("numbers", function() {

            it("without comparisonFn", function() {

                assert.equal(CLI.Array.max([1,2,3,4,5,6]), 6);

            });

            it("with comparisonFn", function() {

                assert.equal(CLI.Array.max([1,2,3,4,5,6], function(a, b) { return a < b ? 1 : -1; }), 1);

            });

        });

        // }}}

    });

    // }}}
    // {{{ sum

    describe("sum", function() {

        it("should return 21", function() {

            assert.equal(CLI.Array.sum([1,2,3,4,5,6]), 21);

        });

    });

    // }}}
    // {{{ mean

    describe("mean", function() {

        it("should return 3.5", function() {

            assert.equal(CLI.Array.mean([1,2,3,4,5,6]), 3.5);

        });

    });

    // }}}
    // {{{ testReplace

    function testReplace(replaceFn) {

        var replace = replaceFn;

        return function() {

            it('should remove items in the middle', function () {

                var array = [0, 1, 2, 3, 4, 5, 6, 7];

                replace(array, 2, 2);

                assert.equal(CLI.encode(array), '[0,1,4,5,6,7]');

            });

            it('should insert items in the middle', function () {

                var array = [0, 1, 2, 3, 4, 5, 6, 7];

                replace(array, 2, 0, ['a','b']);

                assert.equal(CLI.encode(array), '[0,1,"a","b",2,3,4,5,6,7]');

            });

            it('should replace in the middle with more items', function () {

                var array = [0, 1, 2, 3, 4, 5, 6, 7];

                replace(array, 2, 2, ['a','b', 'c', 'd']);

                assert.equal(CLI.encode(array), '[0,1,"a","b","c","d",4,5,6,7]');

            });

            it('should replace in the middle with fewer items', function () {

                var array = [0, 1, 2, 3, 4, 5, 6, 7];

                replace(array, 2, 4, ['a','b']);

                assert.equal(CLI.encode(array), '[0,1,"a","b",6,7]');

            });

            it('should delete at front', function () {

                var array = [0, 1, 2, 3];

                replace(array, 0, 2);

                assert.equal(CLI.encode(array), '[2,3]');

            });

            it('should delete at tail', function () {

                var array = [0, 1, 2, 3];

                replace(array, 2, 2);

                assert.equal(CLI.encode(array), '[0,1]');

            });

            it('should delete everything', function () {

                var array = [0, 1, 2, 3];

                replace(array, 0, 4);

                assert.equal(CLI.encode(array), '[]');

            });

            it('should insert at front', function () {

                var array = [0, 1];

                replace(array, 0, 0, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '["a","b","c","d","e",0,1]');

            });

            it('should insert at tail', function () {

                var array = [0, 1];

                replace(array, array.length, 0, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '[0,1,"a","b","c","d","e"]');

            });

            it('should insert into empty array', function () {

                var array = [];

                replace(array, 0, 0, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '["a","b","c","d","e"]');

            });

            it('should replace at front', function () {

                var array = [0, 1];

                replace(array, 0, 1, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '["a","b","c","d","e",1]');

            });

            it('should replace at tail', function () {

                var array = [0, 1];

                replace(array, 1, 1, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '[0,"a","b","c","d","e"]');

            });

            it('should replace entire array', function () {

                var array = [0, 1, 2, 3];

                replace(array, 0, array.length, ['a','b','c','d','e']);

                assert.equal(CLI.encode(array), '["a","b","c","d","e"]');

            });

            it('should handle negative index', function () {

                var array = [0, 1, 2, 3];

                replace(array, -2, 20); // should clip

                assert.equal(CLI.encode(array), '[0,1]');

            });

        };

    };

    // }}}
    // {{{ replace

    describe('replace with native implementation', testReplace(CLI.Array.replace));

    // }}}
    // {{{ splice

    describe('splice', function () {

        it('returns proper result array at the front', function () {

            var ret = CLI.Array.splice([1,2,3,4], 0, 2);

            assert.equal(CLI.encode(ret), '[1,2]');

        });

        it('returns proper result array at the end', function () {

            var ret = CLI.Array.splice([1,2,3,4], 2, 2);

            assert.equal(CLI.encode(ret), '[3,4]');

        });

        it('returns proper result array from the middle', function () {

            var ret = CLI.Array.splice([1,2,3,4], 1, 2);

            assert.equal(CLI.encode(ret), '[2,3]');

        });

        it('return an empty array when nothing removed', function () {

            var ret = CLI.Array.splice([1,2,3,4], 1, 0);

            assert.equal(CLI.encode(ret), '[]');
        });

    });

    // }}}
    // {{{ slice

    describe('slice', function(){

        var array;

        // {{{ with Array

        describe('with Array', function(){

            beforeEach(function(){
                array = [{0:0}, {1:1}, {2:2}, {3:3}];
            });

            tests();

        });

        // }}}
        // {{{ with arguments

        describe('with arguments', function(){

            beforeEach(function(){
                array = (function(){ return arguments; })({0:0}, {1:1}, {2:2}, {3:3});
            });

            tests();

        });

        // }}}
        // {{{ tests

        function tests(){

            it('should shallow clone', function(){

                var newArray = CLI.Array.slice(array, 0);

                assert.equal(newArray === array, false);
                assert.equal(newArray[0] === array[0], true);

            });

            it('should not require a begin or end', function(){

                var newArray = CLI.Array.slice(array);

                assert.equal(newArray === array, false);
                assert.equal(newArray[0], array[0]);

            });

            it('should slice off the first item', function(){

                var newArray = CLI.Array.slice(array, 1);

                assert.equal(newArray.length, 3);
                assert.equal(newArray[0], array[1]);
                assert.equal(newArray[2], array[3]);

            });

            it('should ignore `end` if undefined', function(){

                var newArray = CLI.Array.slice(array, 1, undefined);

                assert.equal(newArray.length, 3);
                assert.equal(newArray[0], array[1]);
                assert.equal(newArray[2], array[3]);

            });

            it('should ignore `begin` if undefined', function(){

                var newArray = CLI.Array.slice(array, undefined);

                assert.equal(newArray.length, 4);
                assert.equal(newArray[0], array[0]);
                assert.equal(newArray[3], array[3]);

            });

            it('should ignore `begin` and `end` if undefined', function(){

                var newArray = CLI.Array.slice(array, undefined, undefined);

                assert.equal(newArray.length, 4);
                assert.equal(newArray[0], array[0]);
                assert.equal(newArray[3], array[3]);

            });

            it('should slice out the middle', function(){

                var newArray = CLI.Array.slice(array, 1, -1);

                assert.equal(newArray.length, 2);
                assert.equal(newArray[0], array[1]);
                assert.equal(newArray[1], array[2]);

            });

        }

        // }}}

    });

    // }}}
    // {{{ toMap

    describe('toMap', function () {

        it('should handle just an array', function () {

            var map = CLI.Array.toMap(['a','b','c']);

            assert.equal(map.a, 1);
            assert.equal(map.b, 2);
            assert.equal(map.c, 3);

            delete map.a;
            delete map.b;
            delete map.c;

            assert.equal(CLI.encode(map), '{}');

        });

        it('should handle just an array and a property name', function () {

            var map = CLI.Array.toMap([
                { name: 'aaa' },
                { name: 'bbb' },
                { name: 'ccc' }
            ], 'name');

            assert.equal(map.aaa, 1);
            assert.equal(map.bbb, 2);
            assert.equal(map.ccc, 3);

            delete map.aaa;
            delete map.bbb;
            delete map.ccc;

            assert.equal(CLI.encode(map), '{}');

        });

        it('should handle just an array and a key extractor', function () {

            var map = CLI.Array.toMap([
                { name: 'aaa' },
                { name: 'bbb' },
                { name: 'ccc' }
            ], function (obj) {
                return obj.name.toUpperCase();
            });

            assert.equal(map.AAA, 1);
            assert.equal(map.BBB, 2);
            assert.equal(map.CCC, 3);

            delete map.AAA;
            delete map.BBB;
            delete map.CCC;

            assert.equal(CLI.encode(map), '{}');

        });

    });

    // }}}
    // {{{ flatten

    describe('flatten', function() {

        var flatten = CLI.Array.flatten;

        it('should convert a multi-dimensional array into 1-d array', function() {

            assert.deepEqual(flatten([
                1,
                [2,3],
                [4,[5,6]]
            ]), [1,2,3,4,5,6]);

        });

    });

    // }}}
    // {{{ push

    describe("push", function() {

        var push = CLI.Array.push;

        it("should create an array", function(){

            assert.deepEqual(push(undefined, 1), [1]);

        });

        it("should convert a non-array to an array", function() {

            assert.deepEqual(push(1, 2), [1, 2]);

        });

        it("should push single elements onto end", function() {

            assert.deepEqual(push([1, 2], 3, 4, 5), [1, 2, 3, 4, 5]);

        });

        it("should push all items of array arguments onto end", function(){

            assert.deepEqual(push([1, 2], [3, 4], [5]), [1, 2, 3, 4, 5]);

        });

        it("should push arrays and single items into the end", function(){

            assert.deepEqual(push([1, 2], [3, 4], 5), [1, 2, 3, 4, 5]);

        });

    });

    // }}}
    // {{{ equals

    describe("equals", function(){

        var equals = CLI.Array.equals;

        it("should match 2 empty arrays", function(){

            assert.equal(equals([], []), true);

        });

        it("should not match if the arrays are a different size", function(){

            assert.equal(equals([1, 2, 3, 4], [1, 2, 3]), false);

        });

        it("should use strict equality matching", function(){

            assert.equal(equals([1], ['1']), false);

        });

        it("should have items in the same order", function(){

            assert.equal(equals(['baz', 'bar', 'foo'], ['foo', 'bar', 'baz']), false);

        });

        it("should match strings", function(){

            assert.equal(equals(['foo', 'bar', 'baz'], ['foo', 'bar', 'baz']), true);

        });

        it("should match numbers", function(){

            assert.equal(equals([1, 2, 3, 4], [1, 2, 3, 4]), true);

        });

        it("should match booleans", function(){

            assert.equal(equals([false, false, false, true], [false, false, false, true]), true);

        });

        it("should match objects", function(){

            var o1 = {},
                o2 = {},
                o3 = {};

            assert.equal(equals([o1, o2, o3], [o1, o2, o3]), true);

        });

        it("should match the same array", function(){

            var arr = [1, 2, 3];

            assert.equal(equals(arr, arr), true);
        });

    });

    // }}}

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
