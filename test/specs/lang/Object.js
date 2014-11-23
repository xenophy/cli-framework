/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI.Object

describe("CLI.Object", function() {

    // {{{ before

    before(function() {

        // require CLI
        require('../../../index.js');

    });

    // }}}
    // {{{ each

    describe("each", function(){

        describe("scope/params", function(){

            it("should execute using the passed scope", function(){

                var scope = {},
                    actual;

                CLI.Object.each({
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, function(){
                    actual = this;
                }, scope);

                assert.equal(actual, scope);
            });

            it("should default the scope to the object", function(){

                var o = {
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, actual;

                CLI.Object.each(o, function(){
                    actual = this;
                });

                assert.equal(actual, o);
            });

            it("should execute passing the key value and object", function(){

                var keys = [],
                    values = [],
                    data = {
                        foo: 1,
                        bar: 'value',
                        baz: false
                    },
                    obj;

                CLI.Object.each(data, function(key, value, o){
                    keys.push(key);
                    values.push(value);
                    obj = o;
                });

                assert.deepEqual(keys, ['foo', 'bar', 'baz']);
                assert.deepEqual(values, [1, 'value', false]);
                assert.deepEqual(obj, data);

            });

        });

        describe("stopping", function(){

            it("should not stop by default", function(){

                var count = 0;

                CLI.Object.each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(){
                    ++count;
                });

                assert.equal(count, 4);

            });

            it("should only stop if the function returns false", function(){

                var count = 0;

                CLI.Object.each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(){
                    ++count;
                    return null;
                });

                assert.equal(count, 4);

            });

            it("should stop immediately when false is returned", function(){

                var count = 0;

                CLI.Object.each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(key){
                    ++count;
                    return key != 'b';
                });

                assert.equal(count, 2);

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
