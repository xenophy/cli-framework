/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.String
 *
 * A collection of useful static methods to deal with strings.
 * @singleton
 */

(function() {

    "use strict";

    CLI.String = (function() {
        var trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe      = /('|\\)/g,
        escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
        basicTrimRe   = /^\s+|\s+$/g,
        whitespaceRe  = /\s+/,
        varReplace    = /(^[^a-z]*|[^\w])/gi,
        charToEntity,
        entityToChar,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        },
        htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        },
        boundsCheck = function(s, other){
            if (s === null || s === undefined || other === null || other === undefined) {
                return false;
            }

            return other.length <= s.length; 
        },

        CLIString;

        return CLIString = {

            /**
             * Inserts a substring into a string.
             * @param {String} s The original string.
             * @param {String} value The substring to insert.
             * @param {Number} index The index to insert the substring. Negative indexes will insert from the end of
             * the string. Example: 
             *
             *     CLI.String.insert("abcdefg", "h", -1); // abcdefhg
             *
             * @return {String} The value with the inserted substring
             */
            insert: function(s, value, index) {
                if (!s) {
                    return value;
                }

                if (!value) {
                    return s;
                }

                var len = s.length;

                if (!index && index !== 0) {
                    index = len;
                }

                if (index < 0) {
                    index *= -1;
                    if (index >= len) {
                        // negative overflow, insert at start
                        index = 0;
                    } else {
                        index = len - index;
                    }
                }

                if (index === 0) {
                    s = value + s;
                } else if (index >= s.length) {
                    s += value;
                } else {
                    s = s.substr(0, index) + value + s.substr(index);
                }
                return s;
            },

            /**
             * Checks if a string starts with a substring
             * @param {String} s The original string
             * @param {String} start The substring to check
             * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
             */
            startsWith: function(s, start, ignoreCase){
                var result = boundsCheck(s, start);

                if (result) {
                    if (ignoreCase) {
                        s = s.toLowerCase();
                        start = start.toLowerCase();
                    }
                    result = s.lastIndexOf(start, 0) === 0;
                }
                return result;
            },

            /**
             * Checks if a string ends with a substring
             * @param {String} s The original string
             * @param {String} end The substring to check
             * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
             */
            endsWith: function(s, end, ignoreCase){
                var result = boundsCheck(s, end);

                if (result) {
                    if (ignoreCase) {
                        s = s.toLowerCase();
                        end = end.toLowerCase();
                    }
                    result = s.indexOf(end, s.length - end.length) !== -1;
                }
                return result;
            },

            /**
             * Converts a string of characters into a legal, parse-able JavaScript `var` name as long as the passed
             * string contains at least one alphabetic character. Non alphanumeric characters, and *leading* non alphabetic
             * characters will be removed.
             * @param {String} s A string to be converted into a `var` name.
             * @return {String} A legal JavaScript `var` name.
             */
            createVarName: function(s) {
                return s.replace(varReplace, '');
            },

            /**
             * Convert certain characters (&, <, >, ', and ") to their HTML character equivalents for literal display in web pages.
             * @param {String} value The string to encode.
             * @return {String} The encoded text.
             * @method
             */
            htmlEncode: function(value) {
                return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
            },

            /**
             * Convert certain characters (&, <, >, ', and ") from their HTML character equivalents.
             * @param {String} value The string to decode.
             * @return {String} The decoded text.
             * @method
             */
            htmlDecode: function(value) {
                return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
            },

            /**
             * Checks if a string has values needing to be html encoded.
             * @private
             * @param {String} s The string to test
             * @return {Boolean} `true` if the string contains HTML characters
             */
            hasHtmlCharacters: function(s) {
                return charToEntityRegex.test(s);
            },

            /**
             * Adds a set of character entity definitions to the set used by
             * {@link CLI.String#htmlEncode} and {@link CLI.String#htmlDecode}.
             *
             * This object should be keyed by the entity name sequence,
             * with the value being the textual representation of the entity.
             *
             *      CLI.String.addCharacterEntities({
             *          '&amp;Uuml;':'Ü',
             *          '&amp;ccedil;':'ç',
             *          '&amp;ntilde;':'ñ',
             *          '&amp;egrave;':'è'
             *      });
             *      var s = CLI.String.htmlEncode("A string with entities: èÜçñ");
             *
             * __Note:__ the values of the character entities defined on this object are expected
             * to be single character values.  As such, the actual values represented by the
             * characters are sensitive to the character encoding of the JavaScript source
             * file when defined in string literal form. Script tags referencing server
             * resources with character entities must ensure that the 'charset' attribute
             * of the script node is consistent with the actual character encoding of the
             * server resource.
             *
             * The set of character entities may be reset back to the default state by using
             * the {@link CLI.String#resetCharacterEntities} method
             *
             * @param {Object} newEntities The set of character entities to add to the current
             * definitions.
             */
            addCharacterEntities: function(newEntities) {
                var charKeys = [],
                entityKeys = [],
                key, echar;
                for (key in newEntities) {
                    echar = newEntities[key];
                    entityToChar[key] = echar;
                    charToEntity[echar] = key;
                    charKeys.push(echar);
                    entityKeys.push(key);
                }
                charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
                entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
            },

            /**
             * Resets the set of character entity definitions used by
             * {@link CLI.String#htmlEncode} and {@link CLI.String#htmlDecode} back to the
             * default state.
             */
            resetCharacterEntities: function() {
                charToEntity = {};
                entityToChar = {};
                // add the default set
                this.addCharacterEntities({
                    '&amp;'     :   '&',
                    '&gt;'      :   '>',
                    '&lt;'      :   '<',
                    '&quot;'    :   '"',
                    '&#39;'     :   "'"
                });
            },

            /**
             * Appends content to the query string of a URL, handling logic for whether to place
             * a question mark or ampersand.
             * @param {String} url The URL to append to.
             * @param {String} string The content to append to the URL.
             * @return {String} The resulting URL
             */
            urlAppend : function(url, string) {
                if (!CLI.isEmpty(string)) {
                    return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
                }

                return url;
            },

            /**
             * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
             *
             *     var s = '  foo bar  ';
             *     alert('-' + s + '-');                   //alerts "- foo bar -"
             *     alert('-' + CLI.String.trim(s) + '-');  //alerts "-foo bar-"
             *
             * @param {String} string The string to trim.
             * @return {String} The trimmed string.
             */
            trim: function(string) {
                if (string) {
                    string = string.replace(trimRegex, "");
                }
                return string || '';
            },

            /**
             * Capitalize the first letter of the given string.
             * @param {String} string
             * @return {String}
             */
            capitalize: function(string) {
                if (string) {
                    string = string.charAt(0).toUpperCase() + string.substr(1);
                }
                return string || '';
            },

            /**
             * Uncapitalize the first letter of a given string.
             * @param {String} string
             * @return {String}
             */
            uncapitalize: function(string) {
                if (string) {
                    string = string.charAt(0).toLowerCase() + string.substr(1);
                }
                return string || '';
            },

            /**
             * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length.
             * @param {String} value The string to truncate.
             * @param {Number} length The maximum length to allow before truncating.
             * @param {Boolean} [word=false] `true` to try to find a common word break.
             * @return {String} The converted text.
             */
            ellipsis: function(value, length, word) {
                if (value && value.length > length) {
                    if (word) {
                        var vs = value.substr(0, length - 2),
                        index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                        if (index !== -1 && index >= (length - 15)) {
                            return vs.substr(0, index) + "...";
                        }
                    }
                    return value.substr(0, length - 3) + "...";
                }
                return value;
            },

            /**
             * Escapes the passed string for use in a regular expression.
             * @param {String} string The string to escape.
             * @return {String} The escaped string.
             */
            escapeRegex: function(string) {
                return string.replace(escapeRegexRe, "\\$1");
            },

            /**
             * Creates a `RegExp` given a string `value` and optional flags. For example, the
             * following two regular expressions are equivalent.
             *
             *      var regex1 = CLI.String.createRegex('hello');
             *
             *      var regex2 = /^hello$/i;
             *
             * The following two regular expressions are also equivalent:
             *
             *      var regex1 = CLI.String.createRegex('world', false, false, false);
             *
             *      var regex2 = /world/;
             *
             * @param {String/RegExp} value The String to convert to a `RegExp`.
             * @param {Boolean} [startsWith=true] Pass `false` to allow a match start anywhere
             * in the string. By default the `value` will match only at the start of the string.
             * @param {Boolean} [endsWith=true] Pass `false` to allow the match to end before
             * the end of the string. By default the `value` will match only at the end of the
             * string.
             * @param {Boolean} [ignoreCase=true] Pass `false` to make the `RegExp` case
             * sensitive (removes the 'i' flag).
             * @since 5.0.0
             * @return {RegExp}
             */
            createRegex: function (value, startsWith, endsWith, ignoreCase) {
                var ret = value;

                if (value != null && !value.exec) { // not a regex
                    ret = CLIString.escapeRegex(String(value));

                    if (startsWith !== false) {
                        ret = '^' + ret;
                    }
                    if (endsWith !== false) {
                        ret += '$';
                    }

                    ret = new RegExp(ret, (ignoreCase !== false) ? 'i' : '');
                }

                return ret;
            },

            /**
             * Escapes the passed string for ' and \.
             * @param {String} string The string to escape.
             * @return {String} The escaped string.
             */
            escape: function(string) {
                return string.replace(escapeRe, "\\$1");
            },

            /**
             * Utility function that allows you to easily switch a string between two alternating values.  The passed value
             * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
             * they are already different, the first value passed in is returned.  Note that this method returns the new value
             * but does not change the current string.
             *
             *     // alternate sort directions
             *     sort = CLI.String.toggle(sort, 'ASC', 'DESC');
             *
             *     // instead of conditional logic:
             *     sort = (sort === 'ASC' ? 'DESC' : 'ASC');
             *
             * @param {String} string The current string.
             * @param {String} value The value to compare to the current string.
             * @param {String} other The new value to use if the string already equals the first value passed in.
             * @return {String} The new value.
             */
            toggle: function(string, value, other) {
                return string === value ? other : value;
            },

            /**
             * Pads the left side of a string with a specified character.  This is especially useful
             * for normalizing number and date strings.  Example usage:
             *
             *     var s = CLI.String.leftPad('123', 5, '0');
             *     // s now contains the string: '00123'
             *
             * @param {String} string The original string.
             * @param {Number} size The total length of the output string.
             * @param {String} [character=' '] (optional) The character with which to pad the original string.
             * @return {String} The padded string.
             */
            leftPad: function(string, size, character) {
                var result = String(string);
                character = character || " ";
                while (result.length < size) {
                    result = character + result;
                }
                return result;
            },

            /**
             * Returns a string with a specified number of repetitions a given string pattern.
             * The pattern be separated by a different string.
             *
             *      var s = CLI.String.repeat('---', 4); // = '------------'
             *      var t = CLI.String.repeat('--', 3, '/'); // = '--/--/--'
             *
             * @param {String} pattern The pattern to repeat.
             * @param {Number} count The number of times to repeat the pattern (may be 0).
             * @param {String} sep An option string to separate each pattern.
             */
            repeat: function(pattern, count, sep) {
                if (count < 1) {
                    count = 0;
                }
                for (var buf = [], i = count; i--; ) {
                    buf.push(pattern);
                }
                return buf.join(sep || '');
            },

            /**
             * Splits a string of space separated words into an array, trimming as needed. If the
             * words are already an array, it is returned.
             *
             * @param {String/Array} words
             */
            splitWords: function (words) {
                if (words && typeof words == 'string') {
                    return words.replace(basicTrimRe, '').split(whitespaceRe);
                }
                return words || [];
            }
        };
    }());

    // initialize the default encode / decode entities
    CLI.String.resetCharacterEntities();

    /**
     * Old alias to {@link CLI.String#htmlEncode}
     * @deprecated Use {@link CLI.String#htmlEncode} instead
     * @method
     * @member CLI
     * @inheritdoc CLI.String#htmlEncode
     */
    CLI.htmlEncode = CLI.String.htmlEncode;


    /**
     * Old alias to {@link CLI.String#htmlDecode}
     * @deprecated Use {@link CLI.String#htmlDecode} instead
     * @method
     * @member CLI
     * @inheritdoc CLI.String#htmlDecode
     */
    CLI.htmlDecode = CLI.String.htmlDecode;

    /**
     * Old alias to {@link CLI.String#urlAppend}
     * @deprecated Use {@link CLI.String#urlAppend} instead
     * @method
     * @member CLI
     * @inheritdoc CLI.String#urlAppend
     */
    CLI.urlAppend = CLI.String.urlAppend;


})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */