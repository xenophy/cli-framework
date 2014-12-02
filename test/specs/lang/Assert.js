/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ helper

require('../../helper.js');

// }}}
// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ require CLI

require('../../../index.js');

// }}}
// {{{ sinon

var sinon = require('sinon');

// }}}
// {{{ CLI.Assert

describe("CLI.Assert", function() {

    // {{{ falsey

    describe("falsey", function() {

        it("should throw when specified true", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.falsey(true, 'should throw when specified true');
            });

            endSilent();

        });

        it("dose not throw when specified false", function() {

            beginSilent();

            assert.doesNotThrow(function() {
                CLI.Assert.falsey(false, 'should throw when specified false');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ falseyProp

    describe("falseyProp", function() {

        it("dose not throw when specified true object", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.falseyProp({
                    myProp: true
                }, 'myProp');
            });

            endSilent();

        });

        it("dose not throw when specified true class prop", function() {

            beginSilent();

            var cls = CLI.define('dose not throw when specified true class prop', {
                myProp: true
            });

            assert.throws(function() {
                CLI.Assert.falseyProp(new cls(), 'myProp');
            });

            endSilent();

        });

        it("should throw when specified false object", function() {

            beginSilent();

            assert.doesNotThrow(function() {
                CLI.Assert.falseyProp({
                    myProp: false
                }, 'myProp');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ truthy

    describe("truthy", function() {

        it("dose not throw when specified true", function() {

            beginSilent();

            assert.doesNotThrow(function() {
                CLI.Assert.truthy(true, 'should throw when specified true');
            });

            endSilent();

        });

        it("should throw when specified false", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.truthy(false, 'should throw when specified false');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ truthyProp

    describe("truthyProp", function() {

        it("dose not throw when specified true object", function() {

            beginSilent();

            assert.doesNotThrow(function() {
                CLI.Assert.truthyProp({
                    myProp: true
                }, 'myProp');
            });

            endSilent();

        });

        it("should throw when specified false object", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.truthyProp({
                    myProp: false
                }, 'myProp');
            });

            endSilent();

        });

        it("should throw when specified false class prop", function() {

            beginSilent();

            var cls = CLI.define('should throw when specified false class prop', {
                myProp: false
            });

            assert.throws(function() {
                CLI.Assert.truthyProp(new cls(), 'myProp');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ isNotString

    describe("isNotString", function() {

        it("should throw when specified srting prop", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.isNotString("hoge");
            });

            endSilent();

        });

    });

    // }}}
    // {{{ isStringProp

    describe("isStringProp", function() {

        it("should throw when specified not srting prop", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.isStringProp({
                    myProp: false
                }, 'myProp');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ isNotStringProp

    describe("isNotStringProp", function() {

        it("should throw when specified srting prop", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Assert.isNotStringProp({
                    myProp: "hoge"
                }, 'myProp');
            });

            endSilent();

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
