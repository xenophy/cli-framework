/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI.Util

describe("CLI.Util", function() {

    // {{{ before

    before(function() {

        // require CLI
        require('../../index.js');

    });

    // }}}
    // {{{ CLI.applyIf

    describe("CLI.applyIf", function() {

        var o;

        it("should apply properties and return an object with an empty destination object", function() {

            o = CLI.applyIf({}, {
                foo: 'foo',
                bar: 'bar'
            });

            assert.deepEqual(o, {
                foo: 'foo',
                bar: 'bar'
            });

        });

        it("should not override default properties", function() {

            o = CLI.applyIf({
                foo: 'foo'
            }, {
                foo: 'oldFoo'
            });

            assert.deepEqual(o, {
                foo: 'foo'
            });

        });

        it("should not override default properties with mixing properties", function() {

            o = CLI.applyIf({
                foo: 1,
                bar: 2
            }, {
                bar: 3,
                baz: 4
            });

            assert.deepEqual(o, {
                foo: 1,
                bar: 2,
                baz: 4
            });

        });

        it("should change the reference of the object", function() {

            o = {};

            CLI.applyIf(o, {
                foo: 2
            }, {
                foo: 1
            });

            assert.deepEqual(o, {
                foo: 2
            });

        });

        it("should return null if null is passed as first argument", function() {

            assert.equal(CLI.applyIf(null, {}), null);

        });

        it("should return the object if second argument is no defined", function() {

            o = {
                foo: 1
            };

            assert.equal(CLI.applyIf(o), o);

        });

    });

    // }}}
    // {{{ CLI.isArray

    describe("CLI.isArray", function() {

        it("should return true with empty array", function() {

            assert.equal(CLI.isArray([]), true);

        });

        it("should return true with filled array", function() {

            assert.equal(CLI.isArray([1, 2, 3, 4]), true);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isArray(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isArray(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isArray("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isArray(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isArray(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isArray(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isArray(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isArray(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isArray({}), false);

        });

        /*
         // TODO: after implemented to enable.

        it("should return false with custom class that has a length property", function() {

            var C = CLI.extend(Object, {
                length: 1
            });

            assert.equal(CLI.isArray(new C()), false);

        });

       */

    });

    // }}}
    // {{{ CLI.isBoolean

    describe("CLI.isBoolean", function() {

        it("should return false with empty array", function() {

            assert.equal(CLI.isBoolean([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isBoolean([1, 2, 3, 4]), false);

        });

        it("should return true with boolean true", function() {

            assert.equal(CLI.isBoolean(true), true);

        });

        it("should return true with boolean false", function() {

            assert.equal(CLI.isBoolean(false), true);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isBoolean("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isBoolean(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isBoolean(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isBoolean(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isBoolean(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isBoolean(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isBoolean({}), false);

        });

    });

    // }}}
    // {{{ CLI.isDate

    describe("CLI.isDate", function() {

        it("should return false with empty array", function() {

            assert.equal(CLI.isDate([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isDate([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isDate(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isDate(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isDate("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isDate(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isDate(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isDate(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isDate(undefined), false);

        });

        it("should return true with date", function() {

            assert.equal(CLI.isDate(new Date()), true);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isDate({}), false);

        });

    });

    // }}}
    // {{{ CLI.isDefined

    describe("CLI.isDefined", function() {

        it("should return true with empty array", function() {

            assert.equal(CLI.isDefined([]), true);

        });

        it("should return true with filled array", function() {

            assert.equal(CLI.isDefined([1, 2, 3, 4]), true);

        });

        it("should return true with boolean true", function() {

            assert.equal(CLI.isDefined(true), true);

        });

        it("should return true with boolean false", function() {

            assert.equal(CLI.isDefined(false), true);

        });

        it("should return true with string", function() {

            assert.equal(CLI.isDefined("foo"), true);

        });

        it("should return true with empty string", function() {

            assert.equal(CLI.isDefined(""), true);

        });

        it("should return true with number", function() {

            assert.equal(CLI.isDefined(1), true);

        });

        it("should return true with null", function() {

            assert.equal(CLI.isDefined(null), true);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isDefined(undefined), false);

        });

        it("should return true with date", function() {

            assert.equal(CLI.isDefined(new Date()), true);

        });

        it("should return true with empty object", function() {

            assert.equal(CLI.isDefined({}), true);

        });

    });

    // }}}
    // {{{ CLI.isEmpty

    describe("CLI.isEmpty", function() {

        it("should return true with empty array", function() {

            assert.equal(CLI.isEmpty([]), true);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isEmpty([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isEmpty(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isEmpty(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isEmpty("foo"), false);

        });

        it("should return true with empty string", function() {

            assert.equal(CLI.isEmpty(""), true);

        });

        it("should return true with empty string with allowBlank", function() {

            assert.equal(CLI.isEmpty("", true), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isEmpty(1), false);

        });

        it("should return true with null", function() {

            assert.equal(CLI.isEmpty(null), true);

        });

        it("should return true with undefined", function() {

            assert.equal(CLI.isEmpty(undefined), true);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isEmpty(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isEmpty({}), false);

        });

    });

    // }}}
    // {{{ CLI.isFunction"

    describe("CLI.isFunction", function() {

        it("should return true with anonymous function", function() {

            assert.equal(CLI.isFunction(function() {}), true);

        });

        it("should return true with new Function syntax", function() {

            assert.equal(CLI.isFunction(CLI.functionFactory('return "";')), true);

        });

        it("should return true with static function", function() {

            assert.equal(CLI.isFunction(CLI.emptyFn), true);

        });

        it("should return true with instance function", function() {

            var stupidClass = function() {},
                testObject;

            stupidClass.prototype.testMe = function() {};
            testObject = new stupidClass();

            assert.equal(CLI.isFunction(testObject.testMe), true);

        });

        it("should return true with function on object", function() {

            var o = {
                fn: function() {
                }
            };

            assert.equal(CLI.isFunction(o.fn), true);

        });

        it("should return false with empty array", function() {

            assert.equal(CLI.isFunction([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isFunction([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isFunction(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isFunction(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isFunction("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isFunction(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isFunction(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isFunction(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isFunction(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isFunction(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isFunction({}), false);

        });

    });

    // }}}
    // {{{ CLI.isMSDate

    describe("CLI.isMSDate", function() {

        it("should return true with '/Date(1297246301973)/'", function() {

            assert.equal(CLI.isMSDate('/Date(1297246301973)/'), true);

        });

        it("should return false with zero", function() {

            assert.equal(CLI.isMSDate(0), false);

        });


    });

    // {{{ CLI.isNumber

    describe("CLI.isNumber", function() {

        it("should return true with zero", function() {

            assert.equal(CLI.isNumber(0), true);

        });

        it("should return true with non zero", function() {

            assert.equal(CLI.isNumber(4), true);

        });

        it("should return true with negative integer", function() {

            assert.equal(CLI.isNumber(-3), true);

        });

        it("should return true with float", function() {

            assert.equal(CLI.isNumber(1.75), true);

        });

        it("should return true with negative float", function() {

            assert.equal(CLI.isNumber(-4.75), true);

        });

        it("should return true with Number.MAX_VALUE", function() {

            assert.equal(CLI.isNumber(Number.MAX_VALUE), true);

        });

        it("should return true with Number.MIN_VALUE", function() {

            assert.equal(CLI.isNumber(Number.MIN_VALUE), true);

        });

        it("should return true with Math.PI", function() {

            assert.equal(CLI.isNumber(Math.PI), true);

        });

        it("should return true with Number() contructor", function() {

            assert.equal(CLI.isNumber(Number('3.1')), true);

        });

        it("should return false with NaN", function() {

            assert.equal(CLI.isNumber(Number.NaN), false);

        });

        it("should return false with Number.POSITIVE_INFINITY", function() {

            assert.equal(CLI.isNumber(Number.POSITIVE_INFINITY), false);

        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {

            assert.equal(CLI.isNumber(Number.NEGATIVE_INFINITY), false);

        });

        it("should return false with empty array", function() {

            assert.equal(CLI.isNumber([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isNumber([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isNumber(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isNumber(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isNumber("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isNumber(""), false);

        });

        it("should return false with string containing a number", function() {

            assert.equal(CLI.isNumber("1.0"), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isNumber(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isNumber(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isNumber({}), false);

        });

    });

    // }}}
    // {{{ CLI.isNumeric

    describe("CLI.isNumeric", function() {

        it("should return true with zero", function() {

            assert.equal(CLI.isNumeric(0), true);

        });

        it("should return true with non zero", function() {

            assert.equal(CLI.isNumeric(4), true);

        });

        it("should return true with negative integer", function() {

            assert.equal(CLI.isNumeric(-3), true);

        });

        it("should return true with float", function() {

            assert.equal(CLI.isNumeric(1.75), true);

        });

        it("should return true with negative float", function() {

            assert.equal(CLI.isNumeric(-4.75), true);

        });

        it("should return true with Number.MAX_VALUE", function() {

            assert.equal(CLI.isNumeric(Number.MAX_VALUE), true);

        });

        it("should return true with Number.MIN_VALUE", function() {

            assert.equal(CLI.isNumeric(Number.MIN_VALUE), true);

        });

        it("should return true with Math.PI", function() {

            assert.equal(CLI.isNumeric(Math.PI), true);

        });

        it("should return true with Number() contructor", function() {

            assert.equal(CLI.isNumeric(Number('3.1')), true);

        });

        it("should return false with NaN", function() {

            assert.equal(CLI.isNumeric(Number.NaN), false);

        });

        it("should return false with Number.POSITIVE_INFINITY", function() {

            assert.equal(CLI.isNumeric(Number.POSITIVE_INFINITY), false);

        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {

            assert.equal(CLI.isNumeric(Number.NEGATIVE_INFINITY), false);

        });

        it("should return false with empty array", function() {

            assert.equal(CLI.isNumeric([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isNumeric([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isNumeric(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isNumeric(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isNumeric("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isNumeric(""), false);

        });

        it("should return true with string containing a number", function() {

            assert.equal(CLI.isNumeric("1.0"), true);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isNumeric(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isNumeric(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isNumeric({}), false);

        });

    });

    // }}}
    // {{{ CLI.isObject

    describe("CLI.isObject", function() {

        it("should return false with empty array", function() {

            assert.equal(CLI.isObject([]), false);

        });

        it("should return false with filled array", function() {

            assert.equal(CLI.isObject([1, 2, 3, 4]), false);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isObject(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isObject(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isObject("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isObject(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isObject(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isObject(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isObject(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isObject(new Date()), false);

        });

        it("should return true with empty object", function() {

            assert.equal(CLI.isObject({}), true);

        });

        it("should return true with object with properties", function() {

            assert.equal(CLI.isObject({
                foo: 1
            }), true);

        });

        it("should return true with object instance", function() {

            var stupidClass = function() {};

            assert.equal(CLI.isObject(new stupidClass()), true);
        });

        it("should return true with new Object syntax", function() {
            assert.equal(CLI.isObject(new Object()), true);
        });

    });

    // }}}
    // {{{ CLI.isPrimitive

    describe("CLI.isPrimitive", function() {

        it("should return true with integer", function() {

            assert.equal(CLI.isPrimitive(1), true);

        });

        it("should return true with negative integer", function() {

            assert.equal(CLI.isPrimitive(-21), true);

        });

        it("should return true with float", function() {

            assert.equal(CLI.isPrimitive(2.1), true);

        });

        it("should return true with negative float", function() {

            assert.equal(CLI.isPrimitive(-12.1), true);

        });

        it("should return true with Number.MAX_VALUE", function() {

            assert.equal(CLI.isPrimitive(Number.MAX_VALUE), true);

        });

        it("should return true with Math.PI", function() {

            assert.equal(CLI.isPrimitive(Math.PI), true);

        });

        it("should return true with empty string", function() {

            assert.equal(CLI.isPrimitive(""), true);

        });

        it("should return true with non empty string", function() {

            assert.equal(CLI.isPrimitive("foo"), true);

        });

        it("should return true with boolean true", function() {

            assert.equal(CLI.isPrimitive(true), true);

        });

        it("should return true with boolean false", function() {

            assert.equal(CLI.isPrimitive(false), true);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isPrimitive(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isPrimitive(undefined), false);

        });

        it("should return false with object", function() {

            assert.equal(CLI.isPrimitive({}), false);

        });

        it("should return false with object instance", function() {

            var stupidClass = function() {};

            assert.equal(CLI.isPrimitive(new stupidClass()), false);

        });

        it("should return false with array", function() {

            assert.equal(CLI.isPrimitive([]), false);

        });

    });

    // }}}
    // {{{ CLI.isString

    describe("CLI.isString", function() {

        it("should return true with empty string", function() {

            assert.equal(CLI.isString(""), true);

        });

        it("should return true with non empty string", function() {

            assert.equal(CLI.isString("foo"), true);

        });

        it("should return true with String() syntax", function() {

            assert.equal(CLI.isString(String("")), true);

        });

        it("should return false with new String() syntax", function() {

            //should return an object that wraps the primitive
            assert.equal(CLI.isString(new String("")), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isString(1), false);

        });

        it("should return false with boolean", function() {

            assert.equal(CLI.isString(true), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isString(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isString(undefined), false);

        });

        it("should return false with array", function() {

            assert.equal(CLI.isString([]), false);

        });

        it("should return false with object", function() {

            assert.equal(CLI.isString({}), false);

        });

    });

    // }}}
    // {{{ CLI.isIterable

    describe("CLI.isIterable", function() {

        var LengthyClass = function() {},
            ClassWithItem = function() {},
            LengthyItemClass = function() {};

        LengthyClass.prototype.length = 1;
        ClassWithItem.prototype.item = function() {};
        LengthyItemClass.prototype.length = 1;
        LengthyItemClass.prototype.item = function() {};

        it("should return true with an arguments object", function() {

            assert.equal(CLI.isIterable(arguments), true);

        });

        it("should return true with empty array", function() {

            assert.equal(CLI.isIterable([]), true);

        });

        it("should return true with filled array", function() {

            assert.equal(CLI.isIterable([1, 2, 3, 4]), true);

        });

        it("should return false with boolean true", function() {

            assert.equal(CLI.isIterable(true), false);

        });

        it("should return false with boolean false", function() {

            assert.equal(CLI.isIterable(false), false);

        });

        it("should return false with string", function() {

            assert.equal(CLI.isIterable("foo"), false);

        });

        it("should return false with empty string", function() {

            assert.equal(CLI.isIterable(""), false);

        });

        it("should return false with number", function() {

            assert.equal(CLI.isIterable(1), false);

        });

        it("should return false with null", function() {

            assert.equal(CLI.isIterable(null), false);

        });

        it("should return false with undefined", function() {

            assert.equal(CLI.isIterable(undefined), false);

        });

        it("should return false with date", function() {

            assert.equal(CLI.isIterable(new Date()), false);

        });

        it("should return false with empty object", function() {

            assert.equal(CLI.isIterable({}), false);

        });

        it("should return false for a function", function() {

            assert.equal(CLI.isIterable(function() {}), false);

        });

        it('should return false for objects with a length property', function() {

            assert.equal(CLI.isIterable({length:1}), false);

        });

        it('should return false for objects with an item property', function() {

            assert.equal(CLI.isIterable({item: function() {}}), false);

        });

        it('should return false for objects with a length prototype property', function() {

            assert.equal(CLI.isIterable(new LengthyClass()), false);

        });

        it('should return false for objects with an item prototype property', function() {

            assert.equal(CLI.isIterable(new ClassWithItem()), false);

        });

        it('should return false for objects with item and length prototype properties', function() {

            assert.equal(CLI.isIterable(new LengthyItemClass()), false);

        });

        it('should return true for arguments object', function() {

            assert.equal(CLI.isIterable(arguments), true);

        });

    });

    // }}}
    // {{{ CLI.iterate

    describe("CLI.iterate", function() {

        var sinon = require('sinon');
        var itFn;

        beforeEach(function() {
            itFn = sinon.stub();
        });

        describe("iterate object", function() {

            var o;

            beforeEach(function() {
                o = {
                    n1: 11,
                    n2: 13,
                    n3: 18
                };
            });

            describe("if itFn does not return false", function() {

                beforeEach(function() {
                    CLI.iterate(o, itFn);
                });

                it("should call the iterate function 3 times", function () {

                    assert.equal(itFn.callCount, 3);

                });

                it("should call the iterate function with correct arguments", function () {

                    assert.deepEqual(itFn.args[0], ["n1", 11, o]);
                    assert.deepEqual(itFn.args[1], ["n2", 13, o]);
                    assert.deepEqual(itFn.args[2], ["n3", 18, o]);

                });
            });

            describe("if itFn return false", function() {

                beforeEach(function() {
                    itFn.onCall(0).returns(false);
                    CLI.iterate(o, itFn);
                });

                it("should stop iteration if function return false", function() {

                    itFn.onCall(0).returns(false);
                    assert.equal(itFn.args.length, 1);
                });

            });

        });

        describe("do nothing on an empty object", function() {

            var o;

            beforeEach(function() {

                o = {};
                CLI.iterate(o, itFn);

            });

            it("should not call the iterate function", function () {

                assert.equal(itFn.called, false);

            });

        });

        describe("iterate array", function() {

            var arr;

            beforeEach(function() {
                arr = [6, 7, 8, 9];
            });

            describe("if itFn does not return false", function() {

                beforeEach(function() {
                    CLI.iterate(arr, itFn);
                });

                it("should call the iterate function 4 times", function () {

                    assert.equal(itFn.callCount, 4);

                });

                it("should call the iterate function with correct arguments", function () {

                    assert.deepEqual(itFn.args[0], [6, 0, arr]);
                    assert.deepEqual(itFn.args[1], [7, 1, arr]);
                    assert.deepEqual(itFn.args[2], [8, 2, arr]);
                    assert.deepEqual(itFn.args[3], [9, 3, arr]);

                });

            });

            describe("if itFn return false", function() {

                beforeEach(function() {
                    itFn.onCall(0).returns(false);
                    CLI.iterate(arr, itFn);
                });

                it("should stop iteration if function return false", function() {

                    itFn.onCall(0).returns(false);

                    assert.equal(itFn.callCount, 1);

                });
            });

        });

        describe("do nothing on an empty array", function() {

            var arr;

            beforeEach(function() {
                arr = [];
                CLI.iterate(arr, itFn);
            });

            it("should not call the iterate function", function () {
                assert.equal(itFn.called, false);
            });

        });

    });

    // }}}
    // {{{ CLI.valueFrom

    describe("CLI.valueFrom", function() {

        var value, defaultValue;

        describe("with allowBlank", function() {

            describe("and an empty string", function() {

                it("should return the value", function() {

                    assert.equal(CLI.valueFrom('', 'aaa', true), '');

                });

            });

            describe("and a string", function() {

                it("should return the value", function() {

                    assert.equal(CLI.valueFrom('bbb', 'aaa', true), 'bbb')

                });

            });

            describe("and an undefined value", function() {

                it("should return the default value", function() {

                    assert.equal(CLI.valueFrom(undefined, 'aaa', true), 'aaa');

                });

            });

            describe("and a null value", function() {

                it("should return the default value", function() {

                    assert.equal(CLI.valueFrom(null, 'aaa', true), 'aaa');

                });

            });

            describe("and a 0 value", function() {

                it("should return the value", function() {

                    assert.equal(CLI.valueFrom(0, 'aaa', true), 0);

                });

            });

        });

        describe("without allowBlank", function() {

            describe("and an empty string", function() {

                it("should return the default value", function() {

                    assert.equal(CLI.valueFrom('', 'aaa'), 'aaa');

                });

            });

            describe("and a string", function() {

                it("should return the value", function() {

                    assert.equal(CLI.valueFrom('bbb', 'aaa'), 'bbb');

                });

            });

            describe("and an undefined value", function() {

                it("should return the default value", function() {

                    assert.equal(CLI.valueFrom(undefined, 'aaa'), 'aaa');

                });

            });

            describe("and a null value", function() {

                it("should return the default value", function() {

                    assert.equal(CLI.valueFrom(null, 'aaa'), 'aaa');

                });

            });

            describe("and a 0 value", function() {

                it("should return the value", function() {

                    assert.equal(CLI.valueFrom(0, 'aaa'), 0);

                });

            });

        });

    });

    // }}}
    // {{{ CLI.override

    describe("CLI.override", function() {

        var Dude,
            extApplySpy;

        beforeEach(function() {
            var sinon = require('sinon');
            Dude = function() {}; // avoid to directly override Object class
            extApplySpy = sinon.spy(CLI, "apply");
        });

        it("should apply override", function() {

            var override = {foo: true};

            CLI.override(Dude, override);

            assert.deepEqual(extApplySpy.withArgs(Dude.prototype).returnValues[0], override);
        });

    });

    // }}}
    // {{{ CLI.clone

    describe("CLI.clone", function() {

        var clone;

        afterEach(function() {
            clone = null;
        });

        it("should clone an array", function() {

            var array = [2,'5',[1,3,4]];

            clone = CLI.clone(array);

            assert.deepEqual(clone, array);
            assert.notEqual(clone, array);

        });

        it("should clone an object", function() {

            var object = {
                fn: function() {
                    return 1;
                },
                b: 2
            };

            clone = CLI.clone(object);

            assert.deepEqual(clone, object);
            assert.notEqual(clone, object);

        });

        it("should clone a date", function() {

            var date = new Date();

            clone = CLI.clone(date);

            assert.deepEqual(clone, date);
            assert.notEqual(clone, date);

        });

        it("should return null for null items", function() {

            assert.equal(CLI.clone(null), null);

        });

        it("should return undefined for undefined items", function() {

            assert.equal(CLI.clone(undefined), undefined);

        });

        it("should not copy CLI.enumerable properties onto cloned object", function() {

            assert.equal(CLI.clone({}).hasOwnProperty('toString'), false);

        });

    });

    // }}}
    // {{{ CLI.typeOf

    describe("CLI.typeOf", function() {

        it("should return null", function() {

            assert.equal(CLI.typeOf(null), 'null');

        });

        it("should return undefined", function() {

            assert.equal(CLI.typeOf(undefined), 'undefined');
            assert.equal(CLI.typeOf(global.someWeirdPropertyThatDoesntExist), 'undefined');

        });

        it("should return string", function() {

            assert.equal(CLI.typeOf(''), 'string');
            assert.equal(CLI.typeOf('something'), 'string');
            assert.equal(CLI.typeOf('1.2'), 'string');

        });

        it("should return number", function() {

            assert.equal(CLI.typeOf(1), 'number');
            assert.equal(CLI.typeOf(1.2), 'number');
            assert.equal(CLI.typeOf(new Number(1.2)), 'number');

        });

        it("should return boolean", function() {

            assert.equal(CLI.typeOf(true), 'boolean');
            assert.equal(CLI.typeOf(false), 'boolean');
            assert.equal(CLI.typeOf(new Boolean(true)), 'boolean');

        });

        it("should return array", function() {

            assert.equal(CLI.typeOf([1,2,3]), 'array');
            assert.equal(CLI.typeOf(new Array(1,2,3)), 'array');

        });

        it("should return function", function() {

            assert.equal(CLI.typeOf(function() {}), 'function');
            assert.equal(CLI.typeOf(new Function()), 'function');
            assert.equal(CLI.typeOf(Object), 'function');
            assert.equal(CLI.typeOf(Array), 'function');
            assert.equal(CLI.typeOf(Number), 'function');
            assert.equal(CLI.typeOf(Function), 'function');
            assert.equal(CLI.typeOf(Boolean), 'function');
            assert.equal(CLI.typeOf(String), 'function');
            assert.equal(CLI.typeOf(Date), 'function');
            assert.equal(CLI.typeOf(CLI.typeOf), 'function');

        });

        it("should return regexp", function() {

            assert.equal(CLI.typeOf(/test/), 'regexp');
            assert.equal(CLI.typeOf(new RegExp('test')), 'regexp');

        });

        it("should return date", function() {

            assert.equal(CLI.typeOf(new Date()), 'date');

        });

        it("should return object", function() {

            assert.equal(CLI.typeOf({some: 'stuff'}), 'object');
            assert.equal(CLI.typeOf(new Object()), 'object');
            assert.equal(CLI.typeOf(global), 'object');

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
