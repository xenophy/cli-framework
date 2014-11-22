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

    before(function(){

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

            assert.equal(CLI.isFunction(function(){}), true);

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

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
