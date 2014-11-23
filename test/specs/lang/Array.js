/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI.Array

describe("CLI.Array", function() {

    // {{{ before

    before(function() {

        // require CLI
        require('../../../index.js');

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
    // {{{ each

    describe("each", function() {

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

        it("should iterate once over a single, non empty value", function() {

            var count = 0;

            CLI.Array.each('string', function() {
                ++count;
            });

            assert.equal(count, 1);

        });

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
