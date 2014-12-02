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
// {{{ CLI.Version

describe("CLI.util.Format", function() {

    var savedFormatLocale = {
            thousandSeparator: CLI.util.Format.thousandSeparator,
            decimalSeparator: CLI.util.Format.decimalSeparator,
            currencySign: CLI.util.Format.currencySign
        };

    // {{{ undef

    describe("undef", function() {

        it("should return the value itself if defined", function() {

            assert.equal(CLI.util.Format.undef("this is a defined value"), "this is a defined value");
            assert.equal(CLI.util.Format.undef(12345), 12345);
            assert.equal(CLI.util.Format.undef(12345.67), 12345.67);
            assert.equal(CLI.util.Format.undef(true), true);

        });

        it("should return an empty string if the value is undefined", function() {

            assert.equal(CLI.util.Format.undef(undefined), "");

        });

    });

    // }}}
    // {{{ defaultValue

    describe("defaultValue", function() {

        it("should return the value itself if defined", function () {

            assert.equal(CLI.util.Format.defaultValue("value", "default value"), "value");

        });

        it("should return the default value if the value is undefined", function() {

            assert.equal(CLI.util.Format.defaultValue(undefined, "default value"), "default value");

        });

        it("should return the default value if the value is empty", function() {

            assert.equal(CLI.util.Format.defaultValue("", "default value"), "default value");

        });

    });

    describe("substr", function() {

        it("should truncate the string from the start position", function() {

            assert.equal(CLI.util.Format.substr("abc", 0, 1), "a");
            assert.equal(CLI.util.Format.substr("abc", 1, 1), "b");
            assert.equal(CLI.util.Format.substr("abc", 2, 1), "c");

        });

        it("should truncate the string at the specified length", function() {

            assert.equal(CLI.util.Format.substr("abc", 0, 0), "");
            assert.equal(CLI.util.Format.substr("abc", 0, 1), "a");
            assert.equal(CLI.util.Format.substr("abc", 0, 2), "ab");
            assert.equal(CLI.util.Format.substr("abc", 0, 3), "abc");

        });

        it("should convert non-string values to its string representation and then truncate", function() {

            assert.equal(CLI.util.Format.substr(1234, 1, 2), "23");
            assert.equal(CLI.util.Format.substr(true, 1, 2), "ru");

        });

        it("should start at the end of the string if start value is negative", function() {

            assert.equal(CLI.util.Format.substr("abc", -1, 1), "c");
            assert.equal(CLI.util.Format.substr("abc", -2, 1), "b");
            assert.equal(CLI.util.Format.substr("abc", -3, 1), "a");
            assert.equal(CLI.util.Format.substr("abc", -4, 1), "a");
            assert.equal(CLI.util.Format.substr("abc", -5, 1), "a");

        });

        it("should return empty string if start position is out of bounds", function() {

            assert.equal(CLI.util.Format.substr("abc", 4, 1), "");
            assert.equal(CLI.util.Format.substr("abc", 5, 1), "");
            assert.equal(CLI.util.Format.substr("abc", 6, 1), "");

        });

        it("should return empty string if length is negative", function() {

            assert.equal(CLI.util.Format.substr("abc", 0, -1), "");
            assert.equal(CLI.util.Format.substr("abc", 0, -2), "");
            assert.equal(CLI.util.Format.substr("abc", 0, -3), "");

        });

        it("should return the whole string if specified length is greater than string length", function() {

            assert.equal(CLI.util.Format.substr("abc", 0, 4), "abc");
            assert.equal(CLI.util.Format.substr("abc", 0, 5), "abc");
            assert.equal(CLI.util.Format.substr("abc", 1, 3), "bc");
            assert.equal(CLI.util.Format.substr("abc", 2, 2), "c");

        });

    });

    // }}}
    // {{{ lowercase

    describe("lowercase", function() {

        it("should preserve lowercase strings", function() {

            assert.equal(CLI.util.Format.lowercase("lowercase string"), "lowercase string");

        });

        it("should convert uppercase strings to lowercase", function() {

            assert.equal(CLI.util.Format.lowercase("UPPERCASE STRING"), "uppercase string");

        });

        it("should convert mixed lowercase/uppercase strings to lowercase", function() {

            assert.equal(CLI.util.Format.lowercase("MIXED string"), "mixed string");
            assert.equal(CLI.util.Format.lowercase("mixed STRING"), "mixed string");
            assert.equal(CLI.util.Format.lowercase("MiXeD sTrIng"), "mixed string");

        });

        it("should be null/undefined safe", function() {

            assert.equal(CLI.util.Format.lowercase(undefined), "undefined");
            assert.equal(CLI.util.Format.lowercase(null), "null");

        });

        it("should cast non-string values before processing", function() {

            assert.equal(CLI.util.Format.lowercase(123), "123");
            assert.equal(CLI.util.Format.lowercase(true), "true");

        });

    });

    // }}}
    // {{{ uppercase

    describe("uppercase", function() {

        it("should preserve uppercase strings", function() {

            assert.equal(CLI.util.Format.uppercase("UPPERCASE STRING"), "UPPERCASE STRING");

        });

        it("should convert lowercase strings to uppercase", function() {

            assert.equal(CLI.util.Format.uppercase("lowercase string"), "LOWERCASE STRING");

        });

        it("should convert mixed lowercase/uppercase strings to uppercase", function() {

            assert.equal(CLI.util.Format.uppercase("MIXED string"), "MIXED STRING");
            assert.equal(CLI.util.Format.uppercase("mixed STRING"), "MIXED STRING");
            assert.equal(CLI.util.Format.uppercase("MiXeD sTrIng"), "MIXED STRING");

        });

        it("should be null/undefined safe", function() {

            assert.equal(CLI.util.Format.uppercase(undefined), "UNDEFINED");
            assert.equal(CLI.util.Format.uppercase(null), "NULL");

        });

        it("should cast non-string values before processing", function() {

            assert.equal(CLI.util.Format.uppercase(123), "123");
            assert.equal(CLI.util.Format.uppercase(true), "TRUE");

        });

    });

    // }}}
    // {{{ usMoney

    describe("usMoney", function(){

        it("should format with 2 decimals, prefixed by a dollar sign", function() {

            assert.equal(CLI.util.Format.usMoney(1234.567), "$1,234.57");

        });

        it("should format with 2 decimals, prefixed by a negative sign, and a dollar sign", function() {
            assert.equal(CLI.util.Format.usMoney(-1234.567), "-$1,234.57");
        });

        it("should format with a comma as a thousand separator", function() {
            assert.equal(CLI.util.Format.usMoney(1234567.89), "$1,234,567.89");
        });

    });

    // }}}
    // {{{ currency

    describe("currency", function() {

        it("should allow 0 for a decimal value", function(){

            assert.equal(CLI.util.Format.currency(100, '$', 0), "$100");

        });

        it("should position currency signal where specified", function() {

            assert.equal(CLI.util.Format.currency(123.45, '$', 2), "$123.45");
            assert.equal(CLI.util.Format.currency(123.45, '$', 2, false), "$123.45");
            assert.equal(CLI.util.Format.currency(123.45, '$', 2, true), "123.45$");

        });

        describe("currency in FR locale", function(){

            beforeEach(function() {
                CLI.apply(CLI.util.Format, {
                    thousandSeparator: '.',
                    decimalSeparator: ',',
                    currencySign: '\u20ac',
                    dateFormat: 'd/m/Y'
                });
            });

            afterEach(function() {
                CLI.apply(CLI.util.Format, savedFormatLocale);
            });

            it("should format with 2 decimals, prefixed by a euro sign", function() {

                assert.equal(CLI.util.Format.currency(1234.567), "\u20ac1.234,57");

            });

            it("should format with 2 decimals, prefixed by a negative sign, and a euro sign", function() {

                assert.equal(CLI.util.Format.currency(-1234.567), "-\u20ac1.234,57");

            });

        });

    });

    // }}}
    // {{{ number

    describe("number", function () {

        // {{{ number in default (US) locale

        describe("number in default (US) locale", function() {

            it("should format with no decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0"), "1");
            });

            it("should format with two decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0.00"), "1.00");
            });

            it("should format+round with two decimals, and no thousand separators", function() {
                assert.equal(CLI.util.Format.number(1234.567, "0.00"), "1234.57");
            });

            it("should format+round with two decimals, and ',' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0.00"), "1,234.57");
            });

            it("should format+round with no decimals, and ',' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0"), "1,235");
            });

        });

        // }}}
        // {{{ number using FR locale

        describe("number using FR locale", function() {

            var savedFormatLocale = {
                thousandSeparator: CLI.util.Format.thousandSeparator,
                decimalSeparator: CLI.util.Format.decimalSeparator,
                currencySign: CLI.util.Format.currencySign,
                dateFormat: CLI.util.Format.dateFormat
            };

            beforeEach(function() {
                CLI.apply(CLI.util.Format, {
                    thousandSeparator: '.',
                    decimalSeparator: ',',
                    currencySign: '\u20ac',
                    dateFormat: 'd/m/Y'
                });
            });

            afterEach(function() {
                CLI.apply(CLI.util.Format, savedFormatLocale);
            });

            it("should format with no decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0"), "1");
            });
            it("should format with two decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0.00"), "1,00");
            });
            it("should format+round with two decimals, and no thousand separators", function() {
                assert.equal(CLI.util.Format.number(1234.567, "0.00"), "1234,57");
            });
            it("should format+round with two decimals after a ',', and '.' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0.00"), "1.234,57");
            });
            it("should format+round with no decimals, and '.' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0"), "1.235");
            });

            it("should use custom separator with thousands specified where num < 1000", function(){
                assert.equal(CLI.util.Format.number(12.34, '0,000.00'), "12,34");
            });

        });

        // }}}
        // {{{ number using FR locale with /i

        // In Ext4, the "/i" suffix allows you to use locale-specific separators in the format string, as opposed
        // to US/UK conventions. Output however ALWAYS follows the local settings in the Format singleton which may
        // be overridden by locale files.
        describe("number using FR locale with /i", function() {

            var savedFormatLocale = {
                thousandSeparator: CLI.util.Format.thousandSeparator,
                decimalSeparator: CLI.util.Format.decimalSeparator,
                currencySign: CLI.util.Format.currencySign,
                dateFormat: CLI.util.Format.dateFormat
            };

            // set up the FR formatting locale
            beforeEach(function() {
                CLI.apply(CLI.util.Format, {
                    thousandSeparator: '.',
                    decimalSeparator: ',',
                    currencySign: '\u20ac',
                    dateFormat: 'd/m/Y'
                });
            });

            afterEach(function() {
                CLI.apply(CLI.util.Format, savedFormatLocale);
            });

            // Demonstrate "Incorrect" use with "/i". '.' means thousand separator and ',' means decimal in FR locale.
            // Read carefully. In the formatting strings below, '.' is taken to mean thousand separator, and
            // ',' is taken to mean decimal separator
            it("should format with no decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0.00/i"), "1");
            });

            it("should format+round with no decimals, and '.' as thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, "0.00/i"), "1.235");
            });

            it("should format+round with three decimals after a ',', and '.' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0.00/i"), "1.234,567");
            });

            it("should format+round with one decimal, and no thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ",0/i"), "1234,6");
            });

            // Correct usage
            it("should format with two decimals", function() {
                assert.equal(CLI.util.Format.number(1, "0,00/i"), "1,00");
            });

            it("should format+round with two decimals, and no thousand separators", function() {
                assert.equal(CLI.util.Format.number(1234.567, "0,00/i"), "1234,57");
            });

            it("should format+round with two decimals after a ',', and '.' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ".0,00/i"), "1.234,57");
            });

            it("should format+round with no decimals, and '.' as the thousand separator", function() {
                assert.equal(CLI.util.Format.number(1234.567, ".0/i"), "1.235");
            });

        });

        // }}}
        // {{{ using # for max decimal places

        describe("using # for max decimal places", function(){

            it("should limit the number of decimal places", function(){
                assert.equal(CLI.util.Format.number(1.23456, '0.##'), '1.23');
            });

            it("should should not pad decimals if less than the format", function(){
                assert.equal(CLI.util.Format.number(1.987, '0.#####'), '1.987');
            });

            it("should not add decimals if not required", function() {
                assert.equal(CLI.util.Format.number(17, '0.#####'), '17');
            });

            it("should apply decimals when using thousand sep", function(){
                assert.equal(CLI.util.Format.number(98765.432, '0,000.##'), '98,765.43');
            });

            // {{{ euro style separator

            describe("euro style separator", function(){
                var savedFormatLocale = {
                    thousandSeparator: CLI.util.Format.thousandSeparator,
                    decimalSeparator: CLI.util.Format.decimalSeparator,
                    currencySign: CLI.util.Format.currencySign,
                    dateFormat: CLI.util.Format.dateFormat
                };

                // set up the FR formatting locale
                beforeEach(function() {
                    CLI.apply(CLI.util.Format, {
                        thousandSeparator: '.',
                        decimalSeparator: ',',
                        currencySign: '\u20ac',
                        dateFormat: 'd/m/Y'
                    });
                });

                afterEach(function() {
                    CLI.apply(CLI.util.Format, savedFormatLocale);
                });

                it("should limit the number of decimal places", function(){
                    assert.equal(CLI.util.Format.number(1.23456, '0.##'), '1,23');
                });

                it("should should not pad decimals if less than the format", function(){
                    assert.equal(CLI.util.Format.number(1.987, '0.#####'), '1,987');
                });

                it("should not add decimals if not required", function() {
                    assert.equal(CLI.util.Format.number(17, '0.#####'), '17');
                });

                it("should apply decimals when using thousand sep", function(){
                    assert.equal(CLI.util.Format.number(98765.432, '0,000.##'), '98.765,43');
                });

            });

            // }}}

        });

        // }}}
        // {{{ using a mixture of 0 & # for decimals

        describe("using a mixture of 0 & # for decimals", function() {

            it("should pad to at least the amount specified", function() {
                assert.equal(CLI.util.Format.number(1.2, '0.00##'), '1.20');
            });

            it("should trim trailing numbers after the specified amount", function() {
                assert.equal(CLI.util.Format.number(1.23456, '0.00##'), '1.2346');
            });

            it("should not have trailing zeroes after the specified decimal", function() {
                assert.equal(CLI.util.Format.number(1.234, '0.00##'), '1.234');
            });

            it("should add decimals when using thousands", function() {
                assert.equal(CLI.util.Format.number(11000.234, '0,000.00##'), '11,000.234');
            });

            it("should apply decimals when using a negative number", function() {
                assert.equal(CLI.util.Format.number(-1.2, '0,000.00##'), '-1.20');
            });

            // {{{ euro style separator

            describe("euro style separator", function(){

                var savedFormatLocale = {
                    thousandSeparator: CLI.util.Format.thousandSeparator,
                    decimalSeparator: CLI.util.Format.decimalSeparator,
                    currencySign: CLI.util.Format.currencySign,
                    dateFormat: CLI.util.Format.dateFormat
                };

                // set up the FR formatting locale
                beforeEach(function() {
                    CLI.apply(CLI.util.Format, {
                        thousandSeparator: '.',
                        decimalSeparator: ',',
                        currencySign: '\u20ac',
                        dateFormat: 'd/m/Y'
                    });
                });
                afterEach(function() {
                    CLI.apply(CLI.util.Format, savedFormatLocale);
                });

                it("should pad to at least the amount specified", function() {
                    assert.equal(CLI.util.Format.number(1.2, '0.00##'), '1,20');
                });

                it("should trim trailing numbers after the specified amount", function() {
                    assert.equal(CLI.util.Format.number(1.23456, '0.00##'), '1,2346');
                });

                it("should not have trailing zeroes after the specified decimal", function() {
                    assert.equal(CLI.util.Format.number(1.234, '0.00##'), '1,234');
                });

                it("should add decimals when using thousands", function() {
                    assert.equal(CLI.util.Format.number(11000.234, '0,000.00##'), '11.000,234');
                });

                it("should apply decimals when using a negative number", function() {
                    assert.equal(CLI.util.Format.number(-1.2, '0,000.00##'), '-1,20');
                });

            });

            // }}}

        });

        // }}}
        // {{{ negative

        describe("negative", function() {

            it("should check for a 0 value before appending negative", function(){
                assert.equal(CLI.util.Format.number(-2.842170943040401e-14, "0,000.00"), '0.00');
            });

            it("should apply the thousandSep with a large negative number", function(){
                assert.equal(CLI.util.Format.number(-22002, '0,000'), '-22,002');
            });

        });

        // }}}

        it("should return the number itself if formatString is not specified", function() {
            assert.equal(CLI.util.Format.number(12345.67, undefined), 12345.67);
            assert.equal(CLI.util.Format.number(12345.67, null), 12345.67);
        });

        it("should return empty string if value is not a number", function() {
            assert.equal(CLI.util.Format.number("this is not a number", "0.00"), "");
        });

        it("should return empty string if the value is NaN", function() {
            assert.equal(CLI.util.Format.number(global.NaN, '0.00'), '');
        });

        it("should raise error if more than one decimal point is specified in the format string", function() {

            beginSilent();

            assert.throws(function() {
                CLI.util.Format.number("1234.67", "0.0.00");
            });

            endSilent();

        });

    });

    // }}}
    // {{{ date

    describe("date", function() {

        it("should return empty string for undefined values", function() {
            assert.equal(CLI.util.Format.date(undefined), '');
        });
        it("should return empty string for null values", function() {
            assert.equal(CLI.util.Format.date(null), '');
        });
        it("should parse string dates", function() {
            assert.equal(CLI.util.Format.date("10/15/81"), "10/15/1981");
        });
        it("should format according to CLI.Date.defaultFormat if no format was specified", function() {
            var date = new Date(1981, 9, 15, 15, 46, 30);
            assert.equal(CLI.util.Format.date(date), "10/15/1981");
        });
        it("should format according to specified format when specified", function() {
            var date = new Date(1981, 9, 15, 15, 46, 30);
            assert.equal(CLI.util.Format.date(date, "d/m/Y H:i:s"), "15/10/1981 15:46:30");
        });
    });

    // }}}
    // {{{ dateRenderer

    describe("dateRenderer", function() {

        it("should return a function that formats dates with the specified format", function() {

            var date = new Date(1981, 9, 15, 15, 46, 30);

            assert.equal(CLI.util.Format.dateRenderer("d/m/Y H:i:s").call(this, date), "15/10/1981 15:46:30");

        });

    });

    // }}}
    // {{{ hex

    describe('hex', function () {

        it('should not reduce length when digits is positive', function () {
            assert.equal(CLI.util.Format.hex(0x12e4, 2), '12e4');
        });

        it('should reduce length when digits is negative', function () {
            assert.equal(CLI.util.Format.hex(0x12e4, -2), 'e4');
        });

        it('should drop fractional digits', function () {
            assert.equal(CLI.util.Format.hex(0x12e4 + 0.123), '12e4');
        });

        it('should pad with 0 on the left to achieve length', function () {
            assert.equal(CLI.util.Format.hex(0x0e, 2), '0e');
        });

        it('should pad with 0 on the left if too short', function () {
            assert.equal(CLI.util.Format.hex(0x0e, -3), '00e');
        });

        it('should not pad when exact length', function () {
            assert.equal(CLI.util.Format.hex(0x1e, 2), '1e');
        });
    });

    // }}}
    // {{{ percent

    describe('percent', function () {

        it('should format 0.5 as 50%', function () {
            var s = CLI.util.Format.percent(0.5);
            assert.equal(s, '50%');
        });

        it('should format 0.314 as 31%', function () {
            var s = CLI.util.Format.percent(0.314);
            assert.equal(s, '31%');
        });

        it('should format 0.314 as 31.4% with 0.0 format', function () {
            var s = CLI.util.Format.percent(0.314, '0.0');
            assert.equal(s, '31.4%');
        });

    });

    // }}}
    // {{{ or

    describe('or', function () {

        it('should map truthy values properly', function () {
            var s = CLI.util.Format.or(1, 'F');
            assert.equal(s, 1);
        });

        it('should map 0 properly', function () {
            var s = CLI.util.Format.or(0, 'F');
            assert.equal(s, 'F');
        });

        it('should map false properly', function () {
            var s = CLI.util.Format.or(false, 'F');
            assert.equal(s, 'F');
        });

        it('should map "" properly', function () {
            var s = CLI.util.Format.or("", 'F');
            assert.equal(s, 'F');
        });

        it('should map NaN properly', function () {
            var s = CLI.util.Format.or(NaN, 'F');
            assert.equal(s, 'F');
        });

        it('should map null properly', function () {
            var s = CLI.util.Format.or(null, 'F');
            assert.equal(s, 'F');
        });

        it('should map undefined properly', function () {
            var s = CLI.util.Format.or(undefined, 'F');
            assert.equal(s, 'F');
        });

    });

    // }}}
    // {{{ pick

    describe('pick', function () {

        it('should map an object properly', function () {
            var s = CLI.util.Format.pick({}, 'F', 'T');
            assert.equal(s, 'T');
        });

        it('should map a string properly', function () {
            var s = CLI.util.Format.pick('foo', 'F', 'T');
            assert.equal(s, 'T');
        });

        it('should map 0 properly', function () {
            var s = CLI.util.Format.pick(0, 'F', 'T');
            assert.equal(s, 'F');
        });

        it('should map 1 properly', function () {
            var s = CLI.util.Format.pick(1, 'zero', 'one', 'two', 'three');
            assert.equal(s, 'one');
        });

        it('should map 3 properly', function () {
            var s = CLI.util.Format.pick(3, 'zero', 'one', 'two', 'three');
            assert.equal(s, 'three');
        });

        it('should map false properly', function () {
            var s = CLI.util.Format.pick(false, 'F', 'T');
            assert.equal(s, 'F');
        });

        it('should map "" properly', function () {
            var s = CLI.util.Format.pick("", 'F', 'T');
            assert.equal(s, 'F');
        });

        it('should map NaN properly', function () {
            var s = CLI.util.Format.pick(NaN, 'F', 'T');
            assert.equal(s, 'F');
        });

        it('should map null properly', function () {
            var s = CLI.util.Format.pick(null, 'F', 'T');
            assert.equal(s, 'F');
        });

        it('should map undefined properly', function () {
            var s = CLI.util.Format.pick(undefined, 'F', 'T');
            assert.equal(s, 'F');
        });

    });

    // }}}
    // {{{ stripTags

    describe("stripTags", function() {

        it("should return undefined if value is undefined", function() {
            assert.equal(CLI.util.Format.stripTags(undefined), undefined);
        });

        it("should return null if value is null", function() {
            assert.equal(CLI.util.Format.stripTags(null), null);
        });

        it("should return the exact original value if it doesn't contains any tags", function() {
            assert.equal(CLI.util.Format.stripTags("this string contains no tags"), "this string contains no tags");;
        });

        it("should strip tags when found", function() {
            assert.equal(CLI.util.Format.stripTags("<p>this string <b>contains</b> tags</p>"), "this string contains tags");;
        });

    });

    // }}}
    // {{{ stripScripts

    describe("stripScripts", function() {

        it("should return undefined if value is undefined", function() {
            assert.equal(CLI.util.Format.stripScripts(undefined), undefined);
        });

        it("should return null if value is null", function() {
            assert.equal(CLI.util.Format.stripScripts(null), null);
        });

        it("should return the exact original value if it doesn't contains any scripts", function() {
            assert.equal(CLI.util.Format.stripTags("this string contains no scripts"), "this string contains no scripts");;
        });

        it("should stript scripts when found", function() {
            assert.equal(CLI.util.Format.stripScripts("<script>alert('foo');</script>this string <b>contains</b> scripts"), "this string <b>contains</b> scripts");;
        });

    });

    // }}}
    // {{{ filesize

    describe("fileSize", function() {

        var fs = CLI.util.Format.fileSize;

        it("should return the size in bytes if size < 1024", function() {
            assert.equal(fs(-9999999999), "-9999999999 bytes");;
            assert.equal(fs(0), "0 bytes");;
            assert.equal(fs(1023), "1023 bytes");;
        });

        it("should return byte in the singular form if the value is 1", function(){
            assert.equal(fs(1), '1 byte');;
        });

        it("should return the size in kilobytes if 1024 <= size < 1MB", function() {
            assert.equal(fs(1024), "1 KB");;
            assert.equal(fs(1024 * 1024 - 1), "1024 KB");;
        });

        it("should return the size in megabytes if 1MB <= size < 1GB", function() {
            assert.equal(fs(1024 * 1024), "1 MB");;
            assert.equal(fs(1024 * 1024 * 100), "100 MB");;
            assert.equal(fs(1024 * 1024 * 1024 - 1), "1024 MB");;
        });

        it("should return the size in GB otherwise", function(){
            assert.equal(fs(1024 * 1024 * 1024), "1 GB");;
            assert.equal(fs(15 * 1024 * 1024 * 1024), "15 GB");;
        });
    });

    // }}}
    // {{{ math

    describe("math", function() {

        it("should return the first argument and the evaluation of the second argument", function() {

            assert.equal(CLI.util.Format.math(12, '+ 12'), 24);;
            assert.equal(CLI.util.Format.math(12, '* 12'), 144);;

        });

    });

    // }}}
    // {{{ round

    describe("round", function() {

        it("should round the original value if the precision is not specified", function() {
            assert.equal(CLI.util.Format.round(1234.56), 1235);;
        });

        it("should preserve the original value if precision is not a number", function() {
            assert.equal(CLI.util.Format.round(1234.56, "invalid precision"), 1234.56);;
        });

        it("should round the value to the specified precision", function() {

            assert.equal(CLI.util.Format.round(1234.50, 1), 1234.5);;
            assert.equal(CLI.util.Format.round(1234.54, 1), 1234.5);;
            assert.equal(CLI.util.Format.round(1234.55, 1), 1234.6);;
            assert.equal(CLI.util.Format.round(1234.59, 1), 1234.6);;

        });

    });

    // }}}
    // {{{ numberRenderer

    describe("numberRenderer", function() {

        it("should return a function that formats a number with the specified format", function() {
            assert.equal(CLI.util.Format.numberRenderer("0.00")(123.321), "123.32");;
        });

    });

    // }}}
    // {{{ plural

    describe("plural", function() {

        it("should return the singular form if count == 1", function() {
            assert.equal(CLI.util.Format.plural(1, "car"), "1 car");;
            assert.equal(CLI.util.Format.plural(1, "child", "children"), "1 child");;
        });

        it("should return the plural as singular+s by default if count <> 1", function() {
            assert.equal(CLI.util.Format.plural(0, "car"), "0 cars");;
            assert.equal(CLI.util.Format.plural(2, "car"), "2 cars");;
        });

        it("should return the specified plural if count <> 1", function() {
            assert.equal(CLI.util.Format.plural(0, "child", "children"), "0 children");;
            assert.equal(CLI.util.Format.plural(2, "child", "children"), "2 children");;
        });

    });

    // }}}
    // {{{ nl2br

    describe("nl2br", function() {

        it("should convert newline characters to <br/>", function() {
            assert.equal(CLI.util.Format.nl2br("first line\nsecond line"), "first line<br/>second line");;
        });

        it("should be null/undefined safe", function() {
            assert.equal(CLI.util.Format.nl2br(undefined), "");;
            assert.equal(CLI.util.Format.nl2br(null), "");;
        });

    });

    // }}}
    // {{{ capitalize

    describe("capitalize", function() {

        it("should be alias to CLI.String.capitalize", function() {
            assert.equal(CLI.util.Format.capitalize, CLI.String.capitalize);;
        });

    });

    // }}}
    // {{{ ellipsis

    describe("ellipsis", function() {

        it("should be alias to CLI.String.ellipsis", function() {
            assert.equal(CLI.util.Format.ellipsis, CLI.String.ellipsis);;
        });

    });

    // }}}
    // {{{ format

    describe("format", function() {

        it("should be alias to CLI.String.format", function() {
            assert.equal(CLI.util.Format.format, CLI.String.format);;
        });

    });

    // }}}
    // {{{ htmlDecode

    describe("htmlDecode", function() {

        it("should be alias to CLI.String.htmlDecode", function() {
            assert.equal(CLI.util.Format.htmlDecode, CLI.String.htmlDecode);;
        });

    });

    // }}}
    // {{{ htmlEncode

    describe("htmlEncode", function() {

        it("should be alias to CLI.String.htmlEncode", function() {
            assert.equal(CLI.util.Format.htmlEncode, CLI.String.htmlEncode);;
        });

    });

    // }}}
    // {{{ leftPad

    describe("leftPad", function() {

        it("should be alias to CLI.String.leftPad", function() {
            assert.equal(CLI.util.Format.leftPad, CLI.String.leftPad);;
        });

    });

    // }}}
    // {{{ trim

    describe("trim", function() {

        it("should be alias to CLI.String.trim", function() {
            assert.equal(CLI.util.Format.trim, CLI.String.trim);;
        });

    });

    // }}}
    // {{{ parseBox

    describe("parseBox", function() {

        it("should return a box when 4 margins are specified", function() {

            assert.deepEqual(CLI.util.Format.parseBox("1 2 3 4"), {
                top: 1,
                right: 2,
                bottom: 3,
                left: 4
            });

        });

        it("should return a box when 3 margins are specified", function() {

            assert.deepEqual(CLI.util.Format.parseBox("1 2 3"), {
                top: 1,
                right: 2,
                bottom: 3,
                left: 2
            });

        });

        it("should return a box when 2 margins are specified", function() {

            assert.deepEqual(CLI.util.Format.parseBox("1 2"), {
                top: 1,
                right: 2,
                bottom: 1,
                left: 2
            });

        });

        it("should return a box when 1 margin is specified", function() {

            assert.deepEqual(CLI.util.Format.parseBox("1"), {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            });

        });

        it("should return a box when 1 margin is specified as number", function() {

            assert.deepEqual(CLI.util.Format.parseBox(1), {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            });

        });

        it("should return a 0 margin box when no margin is specified", function() {

            var zeroMarginBox = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            assert.deepEqual(CLI.util.Format.parseBox(undefined), zeroMarginBox);;
            assert.deepEqual(CLI.util.Format.parseBox(null), zeroMarginBox);;
            assert.deepEqual(CLI.util.Format.parseBox(""), zeroMarginBox);;
            assert.deepEqual(CLI.util.Format.parseBox("    "), zeroMarginBox);;

        });
    });

    // }}}
    // {{{ escapeRegex

    describe("escapeRegex", function() {

        it("should escape regular expressions", function() {

            assert.equal(CLI.util.Format.escapeRegex("-.*+?^${}()|[]/\\abc0123"), "\\-\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\/\\\\abc0123");

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
