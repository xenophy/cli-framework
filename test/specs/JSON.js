/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ helper

require('../helper.js');

// }}}
// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ require CLI

require('../../index.js');

// }}}
// {{{ CLI.JSON

describe("CLI.JSON", function() {

    beforeEach(function() {

    });

    afterEach(function() {
    });

    // {{{ encode

    describe("encode", function() {

        var encode = CLI.JSON.encode;

        // {{{ numbers encoding

        describe("numbers encoding", function() {

            it("should convert integer to string", function() {

                assert.equal(encode(15), "15");

            });

            it("should convert float to string", function() {

                assert.equal(encode(14.7), "14.7");

            });

            it("should convert Infinity to null string", function() {

                assert.equal(encode(Infinity), "null");

            });

            it("should convert NaN to null string", function() {

                assert.equal(encode(NaN), "null");

            });

        });

        // }}}
        // {{{ encoding of not defined values

        describe("encoding of not defined values", function() {

            it("should convert undefined to null string", function() {

                assert.equal(encode(undefined), undefined);

            });

            it("should convert null to null string", function() {

                assert.equal(encode(null), "null");

            });

        });

        // }}}
        // {{{ encoding function

        describe("encoding function", function() {

            it("should convert function to null string", function() {

                assert.equal(encode(CLI.emptyFn), undefined);

            });

        });

        // }}}
        // {{{ boolean encoding

        describe("boolean encoding", function() {

            it("should convert true to 'true'' string", function() {

                assert.equal(encode(true), "true");

            });

            it("should convert null to 'false' string", function() {

                assert.equal(encode(false), "false");

            });

        });

        // }}}
        // {{{ array encoding

        describe("array encoding", function() {

            it("should convert empty array", function() {

                assert.equal(encode([]), "[]");

            });

            it("should convert array of numbers to string", function() {

                assert.equal(encode([1, 2, 3]), "[1,2,3]");

            });

            it("should convert array of strings to string", function() {

                assert.equal(encode(["a", "b", "c"]), "[\"a\",\"b\",\"c\"]");

            });

            it("should encode array including function member to string", function() {

                assert.equal(encode([1, CLI.emptyFn, 3]), "[1,null,3]");

            });

            it("should convert array including undefined member to string", function() {

                assert.equal(encode([1, undefined, 3]), "[1,null,3]");

            });

            it("should convert array including null member to string", function() {

                assert.equal(encode([1, null, 3]), "[1,null,3]");

            });

        });

        // }}}
        // {{{ string encoding

        describe("string encoding", function() {

            it("should convert string", function() {

                assert.equal(encode("You're fired!"), "\"You're fired!\"");

            });

            it("should convert string with international character", function() {

                assert.equal(encode("You're fired!"), "\"You're fired!\"");

            });

            it("should convert string with tab character", function() {

                assert.equal(encode("a\tb"), "\"a\\tb\"");

            });

            it("should convert string with carriage return character", function() {

                assert.equal(encode("a\rb"), "\"a\\rb\"");

            });

            it("should convert string with form feed character", function() {

                assert.equal(encode("a\fb"), "\"a\\fb\"");

            });

            it("should convert string with new line character", function() {

                assert.equal(encode("a\nb"), "\"a\\nb\"");

            });

            it("should convert string with vertical tab character", function() {

                assert.equal(encode("a\x0bb"), "\"a\\u000bb\"");

            });

            it("should convert string with backslash character", function() {

                assert.equal(encode("a\\b"), "\"a\\\\b\"");

            });

        });

        // }}}
        // {{{ object encoding

        describe("object encoding", function() {

            it("should convert empty object", function() {

                assert.equal(encode({}), "{}");

            });

            it("should ignore undefined properties", function() {

                assert.equal(encode({
                    foo: "bar",
                    bar: undefined
                }), "{\"foo\":\"bar\"}");

            });

            it("should convert empty object with null property", function() {

                assert.equal(encode({
                    foo: "bar",
                    bar: null
                }), "{\"foo\":\"bar\",\"bar\":null}");

            });

            it("should ignore function properties", function() {

                assert.equal(encode({
                    foo: "bar",
                    bar: CLI.emptyFn
                }), "{\"foo\":\"bar\"}");

            });

        });

        // }}}
        // {{{ encodeDate

        xdescribe('encodeDate', function() {

            var date;

            it("should encode a date object", function() {

                date = new Date("October 13, 1983 04:04:00");

                assert.equal(encode(date), "\"1983-10-13T04:04:00\"");

            });

            it("should format integers to have at least two digits", function() {

                date = new Date("August 9, 1983 06:03:02");

                assert.equal(encode(date), "\"1983-08-09T06:03:02\"");

            });

        });

        // }}}
        // {{{ mix all possibilities

        describe("mix all possibilities", function() {

            it("should encode data", function() {

                assert.equal(encode({
                    arr: [1, CLI.emptyFn, undefined, 2, [1, 2, 3], {a: 1, b: null}],
                    foo: "bar",
                    woo: {
                        chu: "a\tb"
                    }
                }), "{\"arr\":[1,null,null,2,[1,2,3],{\"a\":1,\"b\":null}],\"foo\":\"bar\",\"woo\":{\"chu\":\"a\\tb\"}}");

            });

        });

        // }}}

    });

    // }}}
    // {{{ decode

    describe("decode", function() {

        it("should decode data", function() {

            assert.deepEqual(CLI.decode("{\"arr\":[1,null,null,2,[1,2,3],{\"a\":1,\"b\":null}],\"foo\":\"bar\",\"woo\":{\"chu\":\"a\\tb\"}}"), {
                arr: [1, null, null, 2, [1, 2, 3], {a: 1, b: null}],
                foo: "bar",
                woo: {
                    chu: "a\tb"
                }
            });

        });

        it("should raise an CLI.Error with invalid data", function() {

            beginSilent();

            assert.throws(function() {
                CLI.decode('{foo:"bar", x}');
            });

            endSilent();

        });

        // {{{ with safe param

        describe("with safe param", function() {

            it("should decode valid data", function() {

                assert.deepEqual(CLI.decode("{\"foo\":\"bar\"}", true), {
                    foo: "bar"
                });

            });

            it("should return null with invalid data", function() {

                assert.equal(CLI.decode('{foo+"bar"}', true), null);

            });

        });

        // }}}

    });

    it('should encode and decode an object', function() {

        var object = {
            a: [0, 1, 2],
            s: "It's-me-Jacky!!",
            ss: "!@#$%^&*()~=_-+][{};:?/.,<>'\"",
            u: '\x01',
            i: 1,
            f: 3.14,
            b: false,
            n: null,
            tree: {
                sub: {
                    subMore: {
                        subEvenMore: {
                            arr: [5,6,7, {
                                complex: true
                            }]
                        }
                    }
                }
            }
        };

        assert.deepEqual(CLI.JSON.decode(CLI.JSON.encode(object)), object);
    });

    // {{{ aliases

    describe("aliases", function() {

        it("should alias CLI.JSON.decode with CLI.decode", function() {
            assert.equal(CLI.decode, CLI.JSON.decode);
        });

        it("should alias CLI.JSON.encode with CLI.encode", function() {
            assert.equal(CLI.encode, CLI.JSON.encode);
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
