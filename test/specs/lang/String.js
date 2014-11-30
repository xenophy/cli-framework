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
// {{{ CLI.String

describe("CLI.String", function() {

    var S = CLI.String;

    // {{{ ellipsis

    describe("ellipsis", function() {

        var shortString = "A short string",
            longString  = "A somewhat longer string";

        it("should keep short strings intact", function() {

            assert.equal(S.ellipsis(shortString, 100), shortString);

        });

        it("should truncate a longer string", function() {

            assert.equal(S.ellipsis(longString, 10), "A somew...");

        });

        // {{{ word break

        describe("word break", function() {

            var longStringWithDot  = "www.xenophy.com",
                longStringWithExclamationMark = "Yeah!Yeah!Yeah!",
                longStringWithQuestionMark = "Who?When?What?";

            it("should find a word break on ' '", function() {

                assert.equal(S.ellipsis(longString, 10, true), "A...");

            });

            it("should be able to break on '.'", function() {

                assert.equal(S.ellipsis(longStringWithDot, 9, true), "www...");

            });

            it("should be able to break on '!'", function() {

                assert.equal(S.ellipsis(longStringWithExclamationMark, 9, true), "Yeah...");

            });

            it("should be able to break on '?'", function() {

                assert.equal(S.ellipsis(longStringWithQuestionMark, 8, true), "Who...");

            });

        });

        // }}}

    });

    // }}}
    // {{{ escapeRegex

    describe("escapeRegex", function() {

        var str;

        it("should escape minus", function() {

            str = "12 - 175";

            assert.equal(S.escapeRegex(str), "12 \\- 175");

        });

        it("should escape dot", function() {

            str = "Brian is in the kitchen.";

            assert.equal(S.escapeRegex(str), "Brian is in the kitchen\\.");

        });

        it("should escape asterisk", function() {

            str = "12 * 175";

            assert.equal(S.escapeRegex(str), "12 \\* 175");

        });

        it("should escape plus", function() {

            str = "12 + 175";

            assert.equal(S.escapeRegex(str), "12 \\+ 175");

        });

        it("should escape question mark", function() {

            str = "What else ?";

            assert.equal(S.escapeRegex(str), "What else \\?");

        });

        it("should escape caret", function() {

            str = "^^";

            assert.equal(S.escapeRegex(str), "\\^\\^");

        });

        it("should escape dollar", function() {

            str = "500$";

            assert.equal(S.escapeRegex(str), "500\\$");

        });

        it("should escape open brace", function() {

            str = "something{stupid";

            assert.equal(S.escapeRegex(str), "something\\{stupid");

        });

        it("should escape close brace", function() {

            str = "something}stupid";

            assert.equal(S.escapeRegex(str), "something\\}stupid");

        });

        it("should escape open bracket", function() {

            str = "something[stupid";

            assert.equal(S.escapeRegex(str), "something\\[stupid");

        });

        it("should escape close bracket", function() {

            str = "something]stupid";

            assert.equal(S.escapeRegex(str), "something\\]stupid");

        });

        it("should escape open parenthesis", function() {

            str = "something(stupid";

            assert.equal(S.escapeRegex(str), "something\\(stupid");

        });

        it("should escape close parenthesis", function() {

            str = "something)stupid";

            assert.equal(S.escapeRegex(str), "something\\)stupid");

        });

        it("should escape vertival bar", function() {

            str = "something|stupid";

            assert.equal(S.escapeRegex(str), "something\\|stupid");

        });

        it("should escape forward slash", function() {

            str = "something/stupid";

            assert.equal(S.escapeRegex(str), "something\\/stupid");

        });

        it("should escape backslash", function() {

            str = "something\\stupid";

            assert.equal(S.escapeRegex(str), "something\\\\stupid");

        });

    });

    // }}}
    // {{{ htmlEncode

    describe("htmlEncode", function() {

        var str;

        it("should replace ampersands", function() {

            str = "Fish & Chips";

            assert.equal(S.htmlEncode(str), "Fish &amp; Chips");

        });

        it("should replace less than", function() {

            str = "Fish > Chips";

            assert.equal(S.htmlEncode(str), "Fish &gt; Chips");

        });

        it("should replace greater than", function() {

            str = "Fish < Chips";

            assert.equal(S.htmlEncode(str), "Fish &lt; Chips");

        });

        it("should replace double quote", function() {

            str = 'Fish " Chips';

            assert.equal(S.htmlEncode(str), "Fish &quot; Chips");

        });

        it("should replace apostraphes", function() {

            str = "Fish ' Chips";

            assert.equal(S.htmlEncode(str), "Fish &#39; Chips");

        });

        // {{{ adding character entities

        describe("adding character entities", function() {

            var src = "A string with entities: \u00e9\u00dc\u00e7\u00f1\u00b6",
                encoded = "A string with entities: &egrave;&Uuml;&ccedil;&ntilde;&para;";

            beforeEach(function() {
                S.addCharacterEntities({
                    "&Uuml;"  : "\u00dc",
                    "&ccedil;": "\u00e7",
                    "&ntilde;": "\u00f1",
                    "&egrave;": "\u00e9",
                    "&para;"  : "\u00b6"
                });
            });

            afterEach(function() {
                S.resetCharacterEntities();
            });

            it("should allow extending the character entity set", function() {

                assert.equal(S.htmlEncode(src), encoded);

            });

        });

        // }}}

    });

    // }}}
    // {{{ htmlDecode

    describe("htmlDecode", function() {

        var str;

        it("should replace ampersands", function() {

            str = "Fish &amp; Chips";

            assert.equal(S.htmlDecode(str), "Fish & Chips");

        });

        it("should replace less than", function() {

            str = "Fish &gt; Chips";

            assert.equal(S.htmlDecode(str), "Fish > Chips");

        });

        it("should replace greater than", function() {

            str = "Fish &lt; Chips";

            assert.equal(S.htmlDecode(str), "Fish < Chips");

        });

        it("should replace double quote", function() {

            str = 'Fish &quot; Chips';

            assert.equal(S.htmlDecode(str), 'Fish " Chips');

        });

        it("should replace apostraphes", function() {

            str = "Fish &#39; Chips";

            assert.equal(S.htmlDecode(str), "Fish ' Chips");

        });

        // {{{ adding character entities

        describe("adding character entities", function() {

            var src = "A string with entities: \u00e9\u00dc\u00e7\u00f1\u00b6",
                encoded = "A string with entities: &egrave;&Uuml;&ccedil;&ntilde;&para;";

            beforeEach(function() {
                S.addCharacterEntities({
                    "&Uuml;"  : "\u00dc",
                    "&ccedil;": "\u00e7",
                    "&ntilde;": "\u00f1",
                    "&egrave;": "\u00e9",
                    "&para;"  : "\u00b6"
                });
            });

            afterEach(function() {
                S.resetCharacterEntities();
            });

            it("should allow extending the character entity set", function() {

                assert.equal(S.htmlDecode(encoded), src);

            });

        });

        // }}}

    });

    // }}}
    // {{{ escaping

    describe("escaping", function() {

        it("should leave an empty string alone", function() {

            assert.equal(S.escape(''), '');

        });

        it("should leave a non-empty string without escapable characters alone", function() {

            assert.equal(S.escape('Ed'), 'Ed');

        });

        it("should correctly escape a double backslash", function() {

            assert.equal(S.escape("\\"), "\\\\");

        });

        it("should correctly escape a single backslash", function() {

            assert.equal(S.escape('\''), '\\\'');

        });

        it("should correctly escape a mixture of escape and non-escape characters", function() {

            assert.equal(S.escape('\'foo\\'), '\\\'foo\\\\');

        });

    });

    // }}}
    // {{{ formatting

    describe("formatting", function() {

        it("should leave a string without format parameters alone", function() {

            assert.equal(S.format('Ed'), 'Ed');

        });

        it("should ignore arguments that don't map to format params", function() {

            assert.equal(S.format("{0} person", 1, 123), "1 person");

        });

        it("should accept several format parameters", function() {

            assert.equal(S.format("{0} person {1}", 1, 'came'), '1 person came');

        });

        it("should ignore nonexistent format functions", function() {

            assert.equal(S.format("{0:foo} {0} person {1}", 1, 'came'), '{0:foo} 1 person came');

        });

        it("should ignore alphabetic format tokens which end with numerals", function() {

            assert.equal(S.format("{foo:0} {0} person {1}", 1, 'came'), '{foo:0} 1 person came');

        });

    });

    // }}}
    // {{{ leftPad

    describe("leftPad", function() {

        it("should pad the left side of an empty string", function() {

            assert.equal(S.leftPad("", 5), "     ");

        });

        it("should pad the left side of a non-empty string", function() {

            assert.equal(S.leftPad("Ed", 5), "   Ed");

        });

        it("should not pad a string where the character count already exceeds the pad count", function() {

            assert.equal(S.leftPad("Abraham", 5), "Abraham");

        });

        it("should allow a custom padding character", function() {

            assert.equal(S.leftPad("Ed", 5, "0"), "000Ed");

        });

    });

    // }}}
    // {{{ when toggling between two values

    describe("when toggling between two values", function() {

        it("should use the first toggle value if the string is not already one of the toggle values", function() {

            assert.equal(S.toggle("Aaron", "Ed", "Abe"), "Ed");

        });

        it("should toggle to the second toggle value if the string is currently the first", function() {

            assert.equal(S.toggle("Ed", "Ed", "Abe"), "Abe");

        });

        it("should toggle to the first toggle value if the string is currently the second", function() {

            assert.equal(S.toggle("Abe", "Ed", "Abe"), "Ed");

        });

    });

    // }}}
    // {{{ trimming

    describe("trimming", function() {

        it("should not modify an empty string", function() {

            assert.equal(S.trim(""), "");

        });

        it("should not modify a string with no whitespace", function() {

            assert.equal(S.trim("Abe"), "Abe");

        });

        it("should trim a whitespace-only string", function() {

            assert.equal(S.trim("     "), "");

        });

        it("should trim leading whitespace", function() {

            assert.equal(S.trim("  Ed"), "Ed");

        });

        it("should trim trailing whitespace", function() {

            assert.equal(S.trim("Ed   "), "Ed");

        });

        it("should trim leading and trailing whitespace", function() {

            assert.equal(S.trim("   Ed  "), "Ed");

        });

        it("should not trim whitespace between words", function() {

            assert.equal(S.trim("Fish and chips"), "Fish and chips");
            assert.equal(S.trim("   Fish and chips  "), "Fish and chips");

        });

        it("should trim tabs", function() {

            assert.equal(S.trim("\tEd"), "Ed");

        });

        it("should trim a mixture of tabs and whitespace", function() {

            assert.equal(S.trim("\tEd   "), "Ed");

        });

    });

    // }}}
    // {{{ urlAppend

    describe("urlAppend", function() {

        it("should leave the string untouched if the second argument is empty", function() {

            assert.equal(S.urlAppend('xenophy.com'), 'xenophy.com');

        });

        it("should append a ? if one doesn't exist", function() {

            assert.equal(S.urlAppend('xenophy.com', 'foo=bar'), 'xenophy.com?foo=bar');

        });

        it("should append any new values with & if a ? exists", function() {

            assert.equal(S.urlAppend('xenophy.com?x=y', 'foo=bar'), 'xenophy.com?x=y&foo=bar');

        });

    });

    // }}}
    // {{{ capitalize

    describe("capitalize", function() {

        it("should handle an empty string", function() {

            assert.equal(S.capitalize(''), '');

        });

        it("should capitalize the first letter of the string", function() {

            assert.equal(S.capitalize('open'), 'Open');

        });

        it("should leave the first letter capitalized if it is already capitalized", function() {

            assert.equal(S.capitalize('Closed'), 'Closed');

        });

        it("should capitalize a single letter", function() {

            assert.equal(S.capitalize('a'), 'A');

        });

        it("should capitalize even when spaces are included", function() {

            assert.equal(S.capitalize('this is a sentence'), 'This is a sentence');

        });
    });

    // }}}
    // {{{ uncapitalize

    describe("uncapitalize", function() {

        it("should handle an empty string", function() {

            assert.equal(S.uncapitalize(''), '');

        });

        it("should uncapitalize the first letter of the string", function() {

            assert.equal(S.uncapitalize('Foo'), 'foo');

        });

        it("should ignore case in the rest of the string", function() {

            assert.equal(S.uncapitalize('FooBar'), 'fooBar');

        });

        it("should leave the first letter uncapitalized if it is already uncapitalized", function() {

            assert.equal(S.uncapitalize('fooBar'), 'fooBar');

        });

        it("should uncapitalize a single letter", function() {

            assert.equal(S.uncapitalize('F'), 'f');

        });

        it("should uncapitalize even when spaces are included", function() {

            assert.equal(S.uncapitalize('This is a sentence'), 'this is a sentence');

        });

    });

    // }}}
    // {{{ repeat

    describe("repeat", function() {

        it("should return an empty string if count == 0", function() {

            assert.equal(S.repeat('an ordinary string', 0), '');

        });

        it("should return an empty string if the count is < 0", function() {

            assert.equal(S.repeat('an ordinary string', -1), '');

        });

        it("should repeat the pattern as many times as required using the specified separator", function() {

            assert.equal(S.repeat('an ordinary string', 1, '/'), 'an ordinary string');
            assert.equal(S.repeat('an ordinary string', 2, '&'), 'an ordinary string&an ordinary string');
            assert.equal(S.repeat('an ordinary string', 3, '%'), 'an ordinary string%an ordinary string%an ordinary string');

        });

        it("should concatenate the repetitions if no separator is specified", function() {

            assert.equal(S.repeat('foo', 3), 'foofoofoo');
            assert.equal(S.repeat('bar baz', 3), 'bar bazbar bazbar baz');

        });

    });

    // }}}
    // {{{ splitWords

    describe("splitWords", function () {

        it("should handle no args", function () {

            var words = S.splitWords();

            assert.equal(CLI.encode(words), '[]');

        });

        it("should handle null", function () {

            var words = S.splitWords(null);

            assert.equal(CLI.encode(words), '[]');

        });

        it("should handle an empty string", function () {

            var words = S.splitWords('');

            assert.equal(CLI.encode(words), '[]');

        });

        it("should handle one trimmed word", function () {

            var words = S.splitWords('foo');

            assert.equal(CLI.encode(words), '["foo"]');

        });

        it("should handle one word with spaces around it", function () {

            var words = S.splitWords(' foo ');

            assert.equal(CLI.encode(words), '["foo"]');

        });

        it("should handle two trimmed words", function () {

            var words = S.splitWords('foo bar');

            assert.equal(CLI.encode(words), '["foo","bar"]');

        });

        it("should handle two untrimmed words", function () {

            var words = S.splitWords('  foo  bar  ');

            assert.equal(CLI.encode(words), '["foo","bar"]');

        });

        it("should handle five trimmed words", function () {

            var words = S.splitWords('foo bar bif boo foobar');

            assert.equal(CLI.encode(words), '["foo","bar","bif","boo","foobar"]');

        });


        it("should handle five untrimmed words", function () {

            var words = S.splitWords(' foo   bar   bif   boo  foobar    \t');

            assert.equal(CLI.encode(words), '["foo","bar","bif","boo","foobar"]');

        });

    });

    // }}}
    // {{{ insert

    describe("insert", function() {

        // {{{ undefined/null/empty values

        describe("undefined/null/empty values", function() {

            it("should handle an undefined original string", function() {

                assert.equal(S.insert(undefined, 'foo', 0), 'foo');

            });

            it("should handle a null original string", function() {

                assert.equal(S.insert(null, 'foo', 0), 'foo');

            });

            it("should handle an empty original string", function() {

                assert.equal(S.insert('', 'foo', 0), 'foo');

            });

            it("should handle an undefined substring", function() {

                assert.equal(S.insert('foo', undefined), 'foo');

            });

            it("should handle a null substring", function() {

                assert.equal(S.insert('foo', null), 'foo');

            });

            it("should handle an empty substring", function() {

                assert.equal(S.insert('foo', ''), 'foo');

            });

        });

        // }}}
        // {{{ index

        describe("index", function() {

            // {{{ invalid indexes

            describe("invalid indexes", function() {

                it("should default the index to the end of the string", function() {

                    assert.equal(S.insert('foo', 'bar'), 'foobar');

                });

                it("should put any negative index greater than the length at the start", function() {

                    assert.equal(S.insert('foo', 'bar', -100), 'barfoo');

                });

                it("should put any index greater than the string length at the end", function() {

                    assert.equal(S.insert('foo', 'bar', 100), 'foobar');

                });

            });

            // }}}
            // {{{ valid index

            describe("valid index", function() {

                it("should insert at the start with 0 index", function() {

                    assert.equal(S.insert('foo', 'bar', 0), 'barfoo');

                });

                it("should insert at the end with index = len", function() {

                    assert.equal(S.insert('foo', 'bar', 3), 'foobar');

                });

                it("should insert at the start with index = -len", function() {

                    assert.equal(S.insert('foo', 'bar', -3), 'barfoo');

                });

                it("should insert at the before the last character", function() {

                    assert.equal(S.insert('foo', 'bar', 2), 'fobaro');

                });

                it("should insert after the first character", function() {

                    assert.equal(S.insert('foo', 'bar', 1), 'fbaroo');

                });

                it("should insert before the last character (negative index)", function() {

                    assert.equal(S.insert('foo', 'bar', -1), 'fobaro');

                });

                it("should insert after the first character (negative index)", function() {

                    assert.equal(S.insert('foo', 'bar', -2), 'fbaroo');

                });

            });

            // }}}

        });

        // }}}

    });

    // }}}
    // {{{ startsWith

    describe("startsWith", function() {

        // {{{ invalid params:w

        describe("invalid params", function() {

            it("should return false when the original string is null", function() {

                assert.equal(S.startsWith(null, ''), false);

            });

            it("should return false when the original string is undefined", function() {

                assert.equal(S.startsWith(undefined, ''), false);

            });

            it("should return false when the substring is null", function() {

                assert.equal(S.startsWith('', null), false);

            });

            it("should return false when the substring is longer than the string", function() {

                assert.equal(S.startsWith('a', 'foo'), false);

            });

        });

        // }}}
        // {{{ mixed strings

        describe("mixed strings", function() {

            it("should return true when both strings are empty", function() {

                assert.equal(S.startsWith('', ''), true);

            });

            it("should return true when the substring is empty", function() {

                assert.equal(S.endsWith('foo', ''), true);

            });

            it("should return true when both strings are the same", function() {

                assert.equal(S.startsWith('foo', 'foo'), true);

            });

            it("should return true when the substring is at the start of the string", function() {

                assert.equal(S.startsWith('foobar', 'foo'), true);

            });

            it("should return true when the substring is at the start and in other places", function() {

                assert.equal(S.startsWith('foobarfoo', 'foo'), true);

            });

            it("should return false when the substring appears in the middle of the string", function() {

                assert.equal(S.startsWith('foobarbaz', 'bar'), false);

            });

            it("should return false when the substring appears at the end of the string", function() {

                assert.equal(S.startsWith('foobarbaz', 'baz'), false);

            });

        });

        // }}}
        // {{{ ignoreCase

        describe("ignoreCase", function() {

            it("should match when both are lower case", function() {

                assert.equal(S.startsWith('foobarbaz', 'foo', true), true);

            });

            it("should match when both are upper case", function() {

                assert.equal(S.startsWith('FOOBARBAZ', 'FOO', true), true);

            });

            it("should match when the original is upper, substring is lower", function() {

                assert.equal(S.startsWith('FOOBARBAZ', 'foo', true), true);

            });

            it("should match when the original is lower, substring is upper", function() {

                assert.equal(S.startsWith('foobarbaz', 'FOO', true), true);

            });

            it("should match with mixed case", function() {

                assert.equal(S.startsWith('fOobarbaz', 'FoO', true), true);

            });

        });

        // }}}

    });

    // }}}
    // {{{ endsWith

    describe("endsWith", function() {

        // {{{ invalid params

        describe("invalid params", function() {

            it("should return false when the original string is null", function() {

                assert.equal(S.endsWith(null, ''), false);

            });

            it("should return false when the original string is undefined", function() {

                assert.equal(S.endsWith(undefined, ''), false);

            });

            it("should return false when the substring is null", function() {

                assert.equal(S.endsWith('', null), false);

            });

            it("should return false when the substring is longer than the string", function() {

                assert.equal(S.endsWith('a', 'foo'), false);

            });

        });

        // }}}
        // {{{ mixed strings

        describe("mixed strings", function() {

            it("should return true when both strings are empty", function() {

                assert.equal(S.endsWith('', ''), true);

            });

            it("should return true when the substring is empty", function() {

                assert.equal(S.endsWith('foo', ''), true);

            });

            it("should return true when both strings are the same", function() {

                assert.equal(S.endsWith('foo', 'foo'), true);

            });

            it("should return true when the substring is at the end of the string", function() {

                assert.equal(S.endsWith('foobar', 'bar'), true);

            });

            it("should return true when the substring is at the end and in other places", function() {

                assert.equal(S.endsWith('foobarfoo', 'foo'), true);

            });

            it("should return false when the substring appears in the middle of the string", function() {

                assert.equal(S.endsWith('foobarbaz', 'bar'), false);

            });

            it("should return false when the substring appears at the start of the string", function() {

                assert.equal(S.endsWith('foobarbaz', 'foo'), false);

            });

        });

        // }}}
        // {{{ ignoreCase

        describe("ignoreCase", function() {

            it("should match when both are lower case", function() {

                assert.equal(S.endsWith('foobarbaz', 'baz', true), true);

            });

            it("should match when both are upper case", function() {

                assert.equal(S.endsWith('FOOBARBAZ', 'BAZ', true), true);

            });

            it("should match when the original is upper, substring is lower", function() {

                assert.equal(S.endsWith('FOOBARBAZ', 'baz', true), true);

            });

            it("should match when the original is lower, substring is upper", function() {

                assert.equal(S.endsWith('foobarbaz', 'BAZ', true), true);

            });

            it("should match with mixed case", function() {

                assert.equal(S.endsWith('foobarbAz', 'BaZ', true), true);

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
