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

        /*

    describe("undef", function() {
        it("should return the value itself if defined", function() {
            expect(CLI.util.Format.undef("this is a defined value")).toBe("this is a defined value");
            expect(CLI.util.Format.undef(12345)).toBe(12345);
            expect(CLI.util.Format.undef(12345.67)).toBe(12345.67);
            expect(CLI.util.Format.undef(true)).toBe(true);
        });
        it("should return an empty string if the value is undefined", function() {
            expect(CLI.util.Format.undef(undefined)).toBe("");
        });
    });

    describe("defaultValue", function() {
        it("should return the value itself if defined", function () {
            expect(CLI.util.Format.defaultValue("value", "default value")).toBe("value");
        });
        it("should return the default value if the value is undefined", function() {
            expect(CLI.util.Format.defaultValue(undefined, "default value")).toBe("default value");
        });
        it("should return the default value if the value is empty", function() {
            expect(CLI.util.Format.defaultValue("", "default value")).toBe("default value");
        });
    });

    describe("substr", function() {
        it("should truncate the string from the start position", function() {
            expect(CLI.util.Format.substr("abc", 0, 1)).toBe("a");
            expect(CLI.util.Format.substr("abc", 1, 1)).toBe("b");
            expect(CLI.util.Format.substr("abc", 2, 1)).toBe("c");
        });
        it("should truncate the string at the specified length", function() {
            expect(CLI.util.Format.substr("abc", 0, 0)).toBe("");
            expect(CLI.util.Format.substr("abc", 0, 1)).toBe("a");
            expect(CLI.util.Format.substr("abc", 0, 2)).toBe("ab");
            expect(CLI.util.Format.substr("abc", 0, 3)).toBe("abc");
        });
        it("should convert non-string values to its string representation and then truncate", function() {
            expect(CLI.util.Format.substr(1234, 1, 2)).toBe("23");
            expect(CLI.util.Format.substr(true, 1, 2)).toBe("ru");
        });
        it("should start at the end of the string if start value is negative", function() {
            expect(CLI.util.Format.substr("abc", -1, 1)).toBe("c");
            expect(CLI.util.Format.substr("abc", -2, 1)).toBe("b");
            expect(CLI.util.Format.substr("abc", -3, 1)).toBe("a");
            expect(CLI.util.Format.substr("abc", -4, 1)).toBe("a");
            expect(CLI.util.Format.substr("abc", -5, 1)).toBe("a");
        });
        it("should return empty string if start position is out of bounds", function() {
            expect(CLI.util.Format.substr("abc", 4, 1)).toBe("");
            expect(CLI.util.Format.substr("abc", 5, 1)).toBe("");
            expect(CLI.util.Format.substr("abc", 6, 1)).toBe("");
        });
        it("should return empty string if length is negative", function() {
            expect(CLI.util.Format.substr("abc", 0, -1)).toBe("");
            expect(CLI.util.Format.substr("abc", 0, -2)).toBe("");
            expect(CLI.util.Format.substr("abc", 0, -3)).toBe("");
        });
        it("should return the whole string if specified length is greater than string length", function() {
            expect(CLI.util.Format.substr("abc", 0, 4)).toBe("abc");
            expect(CLI.util.Format.substr("abc", 0, 5)).toBe("abc");
            expect(CLI.util.Format.substr("abc", 1, 3)).toBe("bc");
            expect(CLI.util.Format.substr("abc", 2, 2)).toBe("c");
        });
    });

    describe("lowercase", function() {
        it("should preserve lowercase strings", function() {
            expect(CLI.util.Format.lowercase("lowercase string")).toBe("lowercase string");
        });
        it("should convert uppercase strings to lowercase", function() {
            expect(CLI.util.Format.lowercase("UPPERCASE STRING")).toBe("uppercase string");
        });
        it("should convert mixed lowercase/uppercase strings to lowercase", function() {
            expect(CLI.util.Format.lowercase("MIXED string")).toBe("mixed string");
            expect(CLI.util.Format.lowercase("mixed STRING")).toBe("mixed string");
            expect(CLI.util.Format.lowercase("MiXeD sTrIng")).toBe("mixed string");
        });
        it("should be null/undefined safe", function() {
            expect(CLI.util.Format.lowercase(undefined)).toBe("undefined");
            expect(CLI.util.Format.lowercase(null)).toBe("null");
        });
        it("should cast non-string values before processing", function() {
            expect(CLI.util.Format.lowercase(123)).toBe("123");
            expect(CLI.util.Format.lowercase(true)).toBe("true");
        });
    });

    describe("uppercase", function() {
        it("should preserve uppercase strings", function() {
            expect(CLI.util.Format.uppercase("UPPERCASE STRING")).toBe("UPPERCASE STRING");
        });
        it("should convert lowercase strings to uppercase", function() {
            expect(CLI.util.Format.uppercase("lowercase string")).toBe("LOWERCASE STRING");
        });
        it("should convert mixed lowercase/uppercase strings to uppercase", function() {
            expect(CLI.util.Format.uppercase("MIXED string")).toBe("MIXED STRING");
            expect(CLI.util.Format.uppercase("mixed STRING")).toBe("MIXED STRING");
            expect(CLI.util.Format.uppercase("MiXeD sTrIng")).toBe("MIXED STRING");
        });
        it("should be null/undefined safe", function() {
            expect(CLI.util.Format.uppercase(undefined)).toBe("UNDEFINED");
            expect(CLI.util.Format.uppercase(null)).toBe("NULL");
        });
        it("should cast non-string values before processing", function() {
            expect(CLI.util.Format.uppercase(123)).toBe("123");
            expect(CLI.util.Format.uppercase(true)).toBe("TRUE");
        });
    });

    describe("usMoney", function(){
        it("should format with 2 decimals, prefixed by a dollar sign", function() {
            expect(CLI.util.Format.usMoney(1234.567)).toEqual("$1,234.57");
        });
        it("should format with 2 decimals, prefixed by a negative sign, and a dollar sign", function() {
            expect(CLI.util.Format.usMoney(-1234.567)).toEqual("-$1,234.57");
        });
        it("should format with a comma as a thousand separator", function() {
            expect(CLI.util.Format.usMoney(1234567.89)).toEqual("$1,234,567.89");
        });
    });


    describe("currency", function() {
        it("should allow 0 for a decimal value", function(){
            expect(CLI.util.Format.currency(100, '$', 0)).toBe('$100');
        });
        it("should position currency signal where specified", function() {
          expect(CLI.util.Format.currency(123.45, '$', 2)).toBe("$123.45");
          expect(CLI.util.Format.currency(123.45, '$', 2, false)).toBe("$123.45");
          expect(CLI.util.Format.currency(123.45, '$', 2, true)).toBe("123.45$");
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
                expect(CLI.util.Format.currency(1234.567)).toEqual("\u20ac1.234,57");
            });
            it("should format with 2 decimals, prefixed by a negative sign, and a euro sign", function() {
                expect(CLI.util.Format.currency(-1234.567)).toEqual("-\u20ac1.234,57");
            });
        });
    });
    
    describe("number", function () {

        describe("number in default (US) locale", function() {
            it("should format with no decimals", function() {
                expect(CLI.util.Format.number(1, "0")).toEqual("1");
            });
            it("should format with two decimals", function() {
                expect(CLI.util.Format.number(1, "0.00")).toEqual("1.00");
            });
            it("should format+round with two decimals, and no thousand separators", function() {
                expect(CLI.util.Format.number(1234.567, "0.00")).toEqual("1234.57");
            });
            it("should format+round with two decimals, and ',' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0.00")).toEqual("1,234.57");
            });
            it("should format+round with no decimals, and ',' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0")).toEqual("1,235");
            });
        });

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
                expect(CLI.util.Format.number(1, "0")).toEqual("1");
            });
            it("should format with two decimals", function() {
                expect(CLI.util.Format.number(1, "0.00")).toEqual("1,00");
            });
            it("should format+round with two decimals, and no thousand separators", function() {
                expect(CLI.util.Format.number(1234.567, "0.00")).toEqual("1234,57");
            });
            it("should format+round with two decimals after a ',', and '.' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0.00")).toEqual("1.234,57");
            });
            it("should format+round with no decimals, and '.' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0")).toEqual("1.235");
            });
            
            it("should use custom separator with thousands specified where num < 1000", function(){
                expect(CLI.util.Format.number(12.34, '0,000.00')).toBe("12,34");    
            });
        });

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
                expect(CLI.util.Format.number(1, "0.00/i")).toEqual("1");
            });
            it("should format+round with no decimals, and '.' as thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, "0.00/i")).toEqual("1.235");
            });
            it("should format+round with three decimals after a ',', and '.' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0.00/i")).toEqual("1.234,567");
            });
            it("should format+round with one decimal, and no thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ",0/i")).toEqual("1234,6");
            });
    
            // Correct usage
            it("should format with two decimals", function() {
                expect(CLI.util.Format.number(1, "0,00/i")).toEqual("1,00");
            });
            it("should format+round with two decimals, and no thousand separators", function() {
                expect(CLI.util.Format.number(1234.567, "0,00/i")).toEqual("1234,57");
            });
            it("should format+round with two decimals after a ',', and '.' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ".0,00/i")).toEqual("1.234,57");
            });
            it("should format+round with no decimals, and '.' as the thousand separator", function() {
                expect(CLI.util.Format.number(1234.567, ".0/i")).toEqual("1.235");
            });
    
        });
        
        describe("using # for max decimal places", function(){
            
            it("should limit the number of decimal places", function(){
                expect(CLI.util.Format.number(1.23456, '0.##')).toBe('1.23');
            });
            
            it("should should not pad decimals if less than the format", function(){
                expect(CLI.util.Format.number(1.987, '0.#####')).toBe('1.987');
            });
            
            it("should not add decimals if not required", function() {
                expect(CLI.util.Format.number(17, '0.#####')).toBe('17');    
            });
            
            it("should apply decimals when using thousand sep", function(){
                expect(CLI.util.Format.number(98765.432, '0,000.##')).toBe('98,765.43');  
            });
            
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
                    expect(CLI.util.Format.number(1.23456, '0.##')).toBe('1,23');
                });
            
                it("should should not pad decimals if less than the format", function(){
                    expect(CLI.util.Format.number(1.987, '0.#####')).toBe('1,987');
                });
            
                it("should not add decimals if not required", function() {
                    expect(CLI.util.Format.number(17, '0.#####')).toBe('17');    
                });
            
                it("should apply decimals when using thousand sep", function(){
                    expect(CLI.util.Format.number(98765.432, '0,000.##')).toBe('98.765,43');  
                });
            });
            
        });
        
        describe("using a mixture of 0 & # for decimals", function() {
            it("should pad to at least the amount specified", function() {
                expect(CLI.util.Format.number(1.2, '0.00##')).toBe('1.20');    
            });  
            
            it("should trim trailing numbers after the specified amount", function() {
                expect(CLI.util.Format.number(1.23456, '0.00##')).toBe('1.2346'); 
            });
            
            it("should not have trailing zeroes after the specified decimal", function() {
                expect(CLI.util.Format.number(1.234, '0.00##')).toBe('1.234');
            });
            
            it("should add decimals when using thousands", function() {
                expect(CLI.util.Format.number(11000.234, '0,000.00##')).toBe('11,000.234');     
            });
            
            it("should apply decimals when using a negative number", function() {
                expect(CLI.util.Format.number(-1.2, '0,000.00##')).toBe('-1.20');     
            });
            
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
                    expect(CLI.util.Format.number(1.2, '0.00##')).toBe('1,20');    
                });  
            
                it("should trim trailing numbers after the specified amount", function() {
                    expect(CLI.util.Format.number(1.23456, '0.00##')).toBe('1,2346'); 
                });
            
                it("should not have trailing zeroes after the specified decimal", function() {
                    expect(CLI.util.Format.number(1.234, '0.00##')).toBe('1,234');
                });
            
                it("should add decimals when using thousands", function() {
                    expect(CLI.util.Format.number(11000.234, '0,000.00##')).toBe('11.000,234');     
                });
            
                it("should apply decimals when using a negative number", function() {
                    expect(CLI.util.Format.number(-1.2, '0,000.00##')).toBe('-1,20');     
                });
            });
        });

        describe("negative", function() {
            it("should check for a 0 value before appending negative", function(){
                expect(CLI.util.Format.number(-2.842170943040401e-14, "0,000.00")).toEqual('0.00');
            });
            
            it("should apply the thousandSep with a large negative number", function(){
                expect(CLI.util.Format.number(-22002, '0,000')).toBe('-22,002');
            });
        });

        it("should return the number itself if formatString is not specified", function() {
            expect(CLI.util.Format.number(12345.67, undefined)).toBe(12345.67);
            expect(CLI.util.Format.number(12345.67, null)).toBe(12345.67);
        });
        it("should return empty string if value is not a number", function() {
            expect(CLI.util.Format.number("this is not a number", "0.00")).toBe("");
        });
        
        it("should return empty string if the value is NaN", function() {
            expect(CLI.util.Format.number(window.NaN, '0.00')).toBe('');
        });

        it("should raise error if more than one decimal point is specified in the format string", function() {
            expect(function() { 
                CLI.util.Format.number("1234.67", "0.0.00"); 
            }).toThrow();
        });
    });

    describe("date", function() {
        it("should return empty string for undefined values", function() {
            expect(CLI.util.Format.date(undefined)).toBe('');
        });
        it("should return empty string for null values", function() {
            expect(CLI.util.Format.date(null)).toBe('');
        });
        it("should parse string dates", function() {
            expect(CLI.util.Format.date("10/15/81")).toBe("10/15/1981");
        });
        it("should format according to CLI.Date.defaultFormat if no format was specified", function() {
            var date = new Date(1981, 9, 15, 15, 46, 30);
            expect(CLI.util.Format.date(date)).toBe("10/15/1981");
        });
        it("should format according to specified format when specified", function() {
            var date = new Date(1981, 9, 15, 15, 46, 30);
            expect(CLI.util.Format.date(date, "d/m/Y H:i:s")).toBe("15/10/1981 15:46:30");
        });
    });

    describe("dateRenderer", function() {
        it("should return a function that formats dates with the specified format", function() {
            var date = new Date(1981, 9, 15, 15, 46, 30);
            expect(CLI.util.Format.dateRenderer("d/m/Y H:i:s").call(this, date)).toBe("15/10/1981 15:46:30");
        });
    });

    describe('hex', function () {
        it('should not reduce length when digits is positive', function () {
            expect(CLI.util.Format.hex(0x12e4, 2)).toBe('12e4');
        });

        it('should reduce length when digits is negative', function () {
            expect(CLI.util.Format.hex(0x12e4, -2)).toBe('e4');
        });

        it('should drop fractional digits', function () {
            expect(CLI.util.Format.hex(0x12e4 + 0.123)).toBe('12e4');
        });

        it('should pad with 0 on the left to achieve length', function () {
            expect(CLI.util.Format.hex(0x0e, 2)).toBe('0e');
        });

        it('should pad with 0 on the left if too short', function () {
            expect(CLI.util.Format.hex(0x0e, -3)).toBe('00e');
        });

        it('should not pad when exact length', function () {
            expect(CLI.util.Format.hex(0x1e, 2)).toBe('1e');
        });
    });

    describe('percent', function () {
        it('should format 0.5 as 50%', function () {
            var s = CLI.util.Format.percent(0.5);
            expect(s).toBe('50%');
        });

        it('should format 0.314 as 31%', function () {
            var s = CLI.util.Format.percent(0.314);
            expect(s).toBe('31%');
        });

        it('should format 0.314 as 31.4% with 0.0 format', function () {
            var s = CLI.util.Format.percent(0.314, '0.0');
            expect(s).toBe('31.4%');
        });
    });

    describe('or', function () {
        it('should map truthy values properly', function () {
            var s = CLI.util.Format.or(1, 'F');
            expect(s).toBe(1);
        });

        it('should map 0 properly', function () {
            var s = CLI.util.Format.or(0, 'F');
            expect(s).toBe('F');
        });

        it('should map false properly', function () {
            var s = CLI.util.Format.or(false, 'F');
            expect(s).toBe('F');
        });

        it('should map "" properly', function () {
            var s = CLI.util.Format.or("", 'F');
            expect(s).toBe('F');
        });

        it('should map NaN properly', function () {
            var s = CLI.util.Format.or(NaN, 'F');
            expect(s).toBe('F');
        });

        it('should map null properly', function () {
            var s = CLI.util.Format.or(null, 'F');
            expect(s).toBe('F');
        });

        it('should map undefined properly', function () {
            var s = CLI.util.Format.or(undefined, 'F');
            expect(s).toBe('F');
        });
    });

    describe('pick', function () {
        it('should map an object properly', function () {
            var s = CLI.util.Format.pick({}, 'F', 'T');
            expect(s).toBe('T');
        });

        it('should map a string properly', function () {
            var s = CLI.util.Format.pick('foo', 'F', 'T');
            expect(s).toBe('T');
        });

        it('should map 0 properly', function () {
            var s = CLI.util.Format.pick(0, 'F', 'T');
            expect(s).toBe('F');
        });

        it('should map 1 properly', function () {
            var s = CLI.util.Format.pick(1, 'zero', 'one', 'two', 'three');
            expect(s).toBe('one');
        });

        it('should map 3 properly', function () {
            var s = CLI.util.Format.pick(3, 'zero', 'one', 'two', 'three');
            expect(s).toBe('three');
        });

        it('should map false properly', function () {
            var s = CLI.util.Format.pick(false, 'F', 'T');
            expect(s).toBe('F');
        });

        it('should map "" properly', function () {
            var s = CLI.util.Format.pick("", 'F', 'T');
            expect(s).toBe('F');
        });

        it('should map NaN properly', function () {
            var s = CLI.util.Format.pick(NaN, 'F', 'T');
            expect(s).toBe('F');
        });

        it('should map null properly', function () {
            var s = CLI.util.Format.pick(null, 'F', 'T');
            expect(s).toBe('F');
        });

        it('should map undefined properly', function () {
            var s = CLI.util.Format.pick(undefined, 'F', 'T');
            expect(s).toBe('F');
        });
    });

    describe("stripTags", function() {
        it("should return undefined if value is undefined", function() {
            expect(CLI.util.Format.stripTags(undefined)).toBeUndefined();
        });
        it("should return null if value is null", function() {
            expect(CLI.util.Format.stripTags(null)).toBeNull();
        });
        it("should return the exact original value if it doesn't contains any tags", function() {
            expect(CLI.util.Format.stripTags("this string contains no tags")).toBe("this string contains no tags");
        });
        it("should strip tags when found", function() {
            expect(CLI.util.Format.stripTags("<p>this string <b>contains</b> tags</p>")).toBe("this string contains tags");
        });
    });

    describe("stripScripts", function() {
        it("should return undefined if value is undefined", function() {
            expect(CLI.util.Format.stripScripts(undefined)).toBeUndefined();
        });
        it("should return null if value is null", function() {
            expect(CLI.util.Format.stripScripts(null)).toBeNull();
        });
        it("should return the exact original value if it doesn't contains any scripts", function() {
            expect(CLI.util.Format.stripTags("this string contains no scripts")).toBe("this string contains no scripts");
        });
        it("should stript scripts when found", function() {
            expect(CLI.util.Format.stripScripts("<script>alert('foo');</script>this string <b>contains</b> scripts")).toBe("this string <b>contains</b> scripts");
        });
    });

    describe("fileSize", function() {
        var fs = CLI.util.Format.fileSize;
        
        it("should return the size in bytes if size < 1024", function() {
            expect(fs(-9999999999)).toBe("-9999999999 bytes");
            expect(fs(0)).toBe("0 bytes");
            expect(fs(1023)).toBe("1023 bytes");
        });
        
        it("should return byte in the singular form if the value is 1", function(){
            expect(fs(1)).toBe('1 byte');
        });
        
        it("should return the size in kilobytes if 1024 <= size < 1MB", function() {
            expect(fs(1024)).toBe("1 KB");
            expect(fs(1024 * 1024 - 1)).toBe("1024 KB");
        });
        
        it("should return the size in megabytes if 1MB <= size < 1GB", function() {
            expect(fs(1024 * 1024)).toBe("1 MB");
            expect(fs(1024 * 1024 * 100)).toBe("100 MB");
            expect(fs(1024 * 1024 * 1024 - 1)).toBe("1024 MB");
        });
        
        it("should return the size in GB otherwise", function(){
            expect(fs(1024 * 1024 * 1024)).toBe("1 GB");
            expect(fs(15 * 1024 * 1024 * 1024)).toBe("15 GB");
        });
    });

    describe("math", function() {
        it("should return the first argument and the evaluation of the second argument", function() {
            expect(CLI.util.Format.math(12, '+ 12')).toBe(24);
            expect(CLI.util.Format.math(12, '* 12')).toBe(144);
        });
    });

    describe("round", function() {
        it("should round the original value if the precision is not specified", function() {
            expect(CLI.util.Format.round(1234.56)).toBe(1235);
        });
        it("should preserve the original value if precision is not a number", function() {
            expect(CLI.util.Format.round(1234.56, "invalid precision")).toBe(1234.56);
        });
        it("should round the value to the specified precision", function() {
            expect(CLI.util.Format.round(1234.50, 1)).toBe(1234.5);
            expect(CLI.util.Format.round(1234.54, 1)).toBe(1234.5);
            expect(CLI.util.Format.round(1234.55, 1)).toBe(1234.6);
            expect(CLI.util.Format.round(1234.59, 1)).toBe(1234.6);
        });
    });

    describe("numberRenderer", function() {
        it("should return a function that formats a number with the specified format", function() {
            expect(CLI.util.Format.numberRenderer("0.00")(123.321)).toBe("123.32");
        });
    });

    describe("plural", function() {
        it("should return the singular form if count == 1", function() {
            expect(CLI.util.Format.plural(1, "car")).toBe("1 car");
            expect(CLI.util.Format.plural(1, "child", "children")).toBe("1 child");
        });
        it("should return the plural as singular+s by default if count <> 1", function() {
            expect(CLI.util.Format.plural(0, "car")).toBe("0 cars");
            expect(CLI.util.Format.plural(2, "car")).toBe("2 cars");
        });
        it("should return the specified plural if count <> 1", function() {
            expect(CLI.util.Format.plural(0, "child", "children")).toBe("0 children");
            expect(CLI.util.Format.plural(2, "child", "children")).toBe("2 children");
        });
    });

    describe("nl2br", function() {
        it("should convert newline characters to <br/>", function() {
            expect(CLI.util.Format.nl2br("first line\nsecond line")).toBe("first line<br/>second line");
        });
        it("should be null/undefined safe", function() {
            expect(CLI.util.Format.nl2br(undefined)).toBe("");
            expect(CLI.util.Format.nl2br(null)).toBe("");
        });
    });

    describe("capitalize", function() {
        it("should be alias to CLI.String.capitalize", function() {
            expect(CLI.util.Format.capitalize).toBe(CLI.String.capitalize);
        });
    });

    describe("ellipsis", function() {
        it("should be alias to CLI.String.ellipsis", function() {
            expect(CLI.util.Format.ellipsis).toBe(CLI.String.ellipsis);
        });
    });

    describe("format", function() {
        it("should be alias to CLI.String.format", function() {
            expect(CLI.util.Format.format).toBe(CLI.String.format);
        });
    });

    describe("htmlDecode", function() {
        it("should be alias to CLI.String.htmlDecode", function() {
            expect(CLI.util.Format.htmlDecode).toBe(CLI.String.htmlDecode);
        });
    });

    describe("htmlEncode", function() {
        it("should be alias to CLI.String.htmlEncode", function() {
            expect(CLI.util.Format.htmlEncode).toBe(CLI.String.htmlEncode);
        });
    });

    describe("leftPad", function() {
        it("should be alias to CLI.String.leftPad", function() {
            expect(CLI.util.Format.leftPad).toBe(CLI.String.leftPad);
        });
    });

    describe("trim", function() {
        it("should be alias to CLI.String.trim", function() {
            expect(CLI.util.Format.trim).toBe(CLI.String.trim);
        });
    });

    describe("parseBox", function() {
        it("should return a box when 4 margins are specified", function() {
            expect(CLI.util.Format.parseBox("1 2 3 4")).toEqual({
                top: 1,
                right: 2,
                bottom: 3,
                left: 4
        });
      });
      it("should return a box when 3 margins are specified", function() {
          expect(CLI.util.Format.parseBox("1 2 3")).toEqual({
              top: 1,
              right: 2,
              bottom: 3,
              left: 2
          });
      });
      it("should return a box when 2 margins are specified", function() {
          expect(CLI.util.Format.parseBox("1 2")).toEqual({
              top: 1,
              right: 2,
              bottom: 1,
              left: 2
          });
      });
      it("should return a box when 1 margin is specified", function() {
          expect(CLI.util.Format.parseBox("1")).toEqual({
              top: 1,
              right: 1,
              bottom: 1,
              left: 1
          });
      });
      it("should return a box when 1 margin is specified as number", function() {
          expect(CLI.util.Format.parseBox(1)).toEqual({
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
          expect(CLI.util.Format.parseBox(undefined)).toEqual(zeroMarginBox);
          expect(CLI.util.Format.parseBox(null)).toEqual(zeroMarginBox);
          expect(CLI.util.Format.parseBox("")).toEqual(zeroMarginBox);
          expect(CLI.util.Format.parseBox("    ")).toEqual(zeroMarginBox);
      });
    });

    describe("escapeRegex", function() {
        it("should escape regular expressions", function() {
            expect(CLI.util.Format.escapeRegex("-.*+?^${}()|[]/\\abc0123")).toBe("\\-\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\/\\\\abc0123");
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
