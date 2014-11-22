/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI.Util

describe("CLI.Array", function() {

    // {{{ before

    before(function(){

        // require CLI
        require('../../../index.js');

    });

    // }}}
    // {{{ toArray

    describe("toArray", function() {

        it("should convert an array", function(){
            assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4]), [1, 2, 3, 4]);
        });

        it("should convert a string", function(){
            assert.deepEqual(CLI.Array.toArray('12345'), ['1', '2', '3', '4', '5']);
        });

        it("should create a new reference", function(){

            var arr = [6, 7, 8];

            assert.deepEqual(CLI.Array.toArray(arr), arr);

        });

        it("should convert arguments", function(){

            var test, fn = function(){
                test = CLI.Array.toArray(arguments);
            };
            fn(-1, -2, -3);

            assert.equal(test instanceof Array, true);
            assert.deepEqual(test, [-1, -2, -3]);

        });

        // {{{ start/end parameters

        describe("start/end parameters", function(){

            it("should default to whole of the array", function(){

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            });

            it("should work with only the start parameter specified", function(){

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2), [3, 4, 5, 6]);

            });

            it("should work with only the end parameter specified", function(){

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], null, 4), [1, 2, 3, 4]);

            });

            it("should work with both params specified", function(){

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2, 4), [3, 4]);

            });

            it("should work with nagative end", function(){

                assert.deepEqual(CLI.Array.toArray([1, 2, 3, 4, 5, 6], 2, -1), [3, 4, 5]);

            });

        });

        // }}}

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
