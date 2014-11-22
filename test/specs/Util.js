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

    /*
    describe("CLI.isNumber", function() {
        it("should return true with zero", function() {
            expect(CLI.isNumber(0)).toBe(true);
        });

        it("should return true with non zero", function() {
            expect(CLI.isNumber(4)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(CLI.isNumber(-3)).toBe(true);
        });

        it("should return true with float", function() {
            expect(CLI.isNumber(1.75)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(CLI.isNumber(-4.75)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(CLI.isNumber(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Number.MIN_VALUE", function() {
            expect(CLI.isNumber(Number.MIN_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(CLI.isNumber(Math.PI)).toBe(true);
        });

        it("should return true with Number() contructor", function() {
            expect(CLI.isNumber(Number('3.1'))).toBe(true);
        });

        it("should return false with NaN", function() {
            expect(CLI.isNumber(Number.NaN)).toBe(false);
        });

        it("should return false with Number.POSITIVE_INFINITY", function() {
            expect(CLI.isNumber(Number.POSITIVE_INFINITY)).toBe(false);
        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {
            expect(CLI.isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
        });

        it("should return false with empty array", function() {
            expect(CLI.isNumber([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(CLI.isNumber([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(CLI.isNumber(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(CLI.isNumber(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(CLI.isNumber("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(CLI.isNumber("")).toBe(false);
        });

        it("should return false with string containing a number", function() {
            expect(CLI.isNumber("1.0")).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(CLI.isNumber(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(CLI.isNumber(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(CLI.isNumber({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(CLI.isNumber(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("CLI.isNumeric", function() {
        it("should return true with zero", function() {
            expect(CLI.isNumeric(0)).toBe(true);
        });

        it("should return true with non zero", function() {
            expect(CLI.isNumeric(4)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(CLI.isNumeric(-3)).toBe(true);
        });

        it("should return true with float", function() {
            expect(CLI.isNumeric(1.75)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(CLI.isNumeric(-4.75)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(CLI.isNumeric(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Number.MIN_VALUE", function() {
            expect(CLI.isNumeric(Number.MIN_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(CLI.isNumeric(Math.PI)).toBe(true);
        });

        it("should return true with Number() contructor", function() {
            expect(CLI.isNumeric(Number('3.1'))).toBe(true);
        });

        it("should return false with NaN", function() {
            expect(CLI.isNumeric(Number.NaN)).toBe(false);
        });

        it("should return false with Number.POSITIVE_INFINITY", function() {
            expect(CLI.isNumeric(Number.POSITIVE_INFINITY)).toBe(false);
        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {
            expect(CLI.isNumeric(Number.NEGATIVE_INFINITY)).toBe(false);
        });

        it("should return false with empty array", function() {
            expect(CLI.isNumeric([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(CLI.isNumeric([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(CLI.isNumeric(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(CLI.isNumeric(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(CLI.isNumeric("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(CLI.isNumeric("")).toBe(false);
        });

        it("should return true with string containing a number", function() {
            expect(CLI.isNumeric("1.0")).toBe(true);
        });

        it("should return false with undefined", function() {
            expect(CLI.isNumeric(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(CLI.isNumeric(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(CLI.isNumeric({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(CLI.isNumeric(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("CLI.isObject", function() {
        it("should return false with empty array", function() {
            expect(CLI.isObject([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(CLI.isObject([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(CLI.isObject(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(CLI.isObject(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(CLI.isObject("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(CLI.isObject("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(CLI.isObject(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(CLI.isObject(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(CLI.isObject(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(CLI.isObject(new Date())).toBe(false);
        });

        it("should return true with empty object", function() {
            expect(CLI.isObject({})).toBe(true);
        });

        it("should return false with a DOM node", function() {
            expect(CLI.isObject(document.body)).toBe(false);
        });

        it("should return false with a Text node", function() {
            expect(CLI.isObject(document.createTextNode('test'))).toBe(false);
        });

        it("should return true with object with properties", function() {
            expect(CLI.isObject({
                foo: 1
            })).toBe(true);
        });

        it("should return true with object instance", function() {
            var stupidClass = function() {};

            expect(CLI.isObject(new stupidClass())).toBe(true);
        });

        it("should return true with new Object syntax", function() {
            expect(CLI.isObject(new Object())).toBe(true);
        });

        it("should return false with dom element", function() {
            expect(CLI.isObject(document.body)).toBe(false);
        });
    });

    describe("CLI.isPrimitive", function() {
        it("should return true with integer", function() {
            expect(CLI.isPrimitive(1)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(CLI.isPrimitive(-21)).toBe(true);
        });

        it("should return true with float", function() {
            expect(CLI.isPrimitive(2.1)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(CLI.isPrimitive(-12.1)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(CLI.isPrimitive(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(CLI.isPrimitive(Math.PI)).toBe(true);
        });

        it("should return true with empty string", function() {
            expect(CLI.isPrimitive("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(CLI.isPrimitive("foo")).toBe(true);
        });

        it("should return true with boolean true", function() {
            expect(CLI.isPrimitive(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(CLI.isPrimitive(false)).toBe(true);
        });

        it("should return false with null", function() {
            expect(CLI.isPrimitive(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(CLI.isPrimitive(undefined)).toBe(false);
        });

        it("should return false with object", function() {
            expect(CLI.isPrimitive({})).toBe(false);
        });

        it("should return false with object instance", function() {
            var stupidClass = function() {};
            expect(CLI.isPrimitive(new stupidClass())).toBe(false);
        });

        it("should return false with array", function() {
            expect(CLI.isPrimitive([])).toBe(false);
        });
    });

    describe("CLI.isString", function() {
        it("should return true with empty string", function() {
            expect(CLI.isString("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(CLI.isString("foo")).toBe(true);
        });

        it("should return true with String() syntax", function() {
            expect(CLI.isString(String(""))).toBe(true);
        });

        it("should return false with new String() syntax", function() { //should return an object that wraps the primitive
            expect(CLI.isString(new String(""))).toBe(false);
        });

        it("should return false with number", function() {
            expect(CLI.isString(1)).toBe(false);
        });

        it("should return false with boolean", function() {
            expect(CLI.isString(true)).toBe(false);
        });

        it("should return false with null", function() {
            expect(CLI.isString(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(CLI.isString(undefined)).toBe(false);
        });

        it("should return false with array", function() {
            expect(CLI.isString([])).toBe(false);
        });

        it("should return false with object", function() {
            expect(CLI.isString({})).toBe(false);
        });
    });

   */

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
