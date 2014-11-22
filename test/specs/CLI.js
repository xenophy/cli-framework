/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI

describe("CLI", function() {

    // {{{ before

    before(function(){

        // require CLI
        require('../../index.js');

    });

    // }}}
    // {{{ CLI.global

    describe("CLI.global", function() {

        it("should return the global scope", function() {
            assert(CLI.global === (function(){ return this; }).call());
        });

    });

    // }}}
    // {{{ CLI.apply

    describe("CLI.apply", function() {

        var origin, o;

        beforeEach(function() {

            origin = {
                name: 'value',
                something: 'cool',
                items: [1,2,3],
                method: function() {
                    this.myMethodCalled = true;
                },
                toString: function() {
                    this.myToStringCalled = true;
                }
            };

        });

        it("should copy normal properties", function() {

            CLI.apply(origin, {
                name: 'newName',
                items: [4,5,6],
                otherThing: 'not cool',
                isCool: false
            });

            assert.equal(origin.name, 'newName');
            assert.deepEqual(origin.items, [4,5,6]);
            assert.equal(origin.something, 'cool');
            assert.equal(origin.otherThing, 'not cool');
            assert.equal(origin.isCool, false);
        });

        it("should copy functions", function() {

            CLI.apply(origin, {
                method: function() {
                    this.newMethodCalled = true;
                }
            });

            origin.method();

            assert.equal(origin.myMethodCalled, undefined);
            assert.equal(origin.newMethodCalled, true);
        });

        it("should copy non-enumerables", function() {

            CLI.apply(origin, {
                toString: function() {
                    this.newToStringCalled = true;
                }
            });

            origin.toString();

            assert.equal(origin.myToStringCalled, undefined);
            assert.equal(origin.newToStringCalled, true);
        });

        it("should apply properties and return an object", function() {

            o = CLI.apply({}, {
                foo: 1,
                bar: 2
            });

            assert.deepEqual(o, {
                foo: 1,
                bar: 2
            });

        });

        it("should change the reference of the object", function() {

            o = {};

            CLI.apply(o, {
                opt1: 'x',
                opt2: 'y'
            });

            assert.deepEqual(o, {
                opt1: 'x',
                opt2: 'y'
            });

        });

        it("should overwrite properties", function() {

            o = CLI.apply({
                foo: 1,
                baz: 4
            }, {
                foo: 2,
                bar: 3
            });

            assert.deepEqual(o, {
                foo: 2,
                bar: 3,
                baz: 4
            });

        });

        it("should use default", function() {

            o = {};

            CLI.apply(o, {
                foo: 'new',
                exist: true
            }, {
                foo: 'old',
                def: true
            });

            assert.deepEqual(o, {
                foo: 'new',
                def: true,
                exist: true
            });

        });

        it("should override all defaults", function() {

            o = CLI.apply({}, {
                foo: 'foo',
                bar: 'bar'
            }, {
                foo: 'oldFoo',
                bar: 'oldBar'
            });

            assert.deepEqual(o, {
                foo: 'foo',
                bar: 'bar'
            });

        });

        it("should return null if null is passed as first argument", function() {

            assert.equal(CLI.apply(null, {}), null);

        });

        it("should return the object if second argument is not defined", function() {

            o = {
                foo: 1
            };

            assert.equal(CLI.apply(o), o);

        });

        it("should override valueOf", function() {

            o = CLI.apply({}, {valueOf: 1});

            assert.equal(o.valueOf, 1);

        });

        it("should override toString", function() {

            o = CLI.apply({}, {toString: 3});

            assert.equal(o.toString, 3);

        });

    });

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
