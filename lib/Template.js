/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

(function() {

    "use strict";

    /**
     * Represents an HTML fragment template. Templates may be {@link #compile precompiled} for greater performance.
     *
     * An instance of this class may be created by passing to the constructor either a single argument, or multiple
     * arguments:
     *
     * # Single argument: String/Array
     *
     * The single argument may be either a String or an Array:
     *
     * - String:
     *
     *       var t = new CLI.Template("<div>Hello {0}.</div>");
     *       t.{@link #append}('some-element', ['foo']);
     *
     * - Array:
     *
     *   An Array will be combined with `join('')`.
     *
     *       var t = new CLI.Template([
     *           '<div name="{id}">',
     *               '<span class="{cls}">{name:trim} {value:ellipsis(10)}</span>',
     *           '</div>',
     *       ]);
     *       t.{@link #compile}();
     *       t.{@link #append}('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
     *
     * # Multiple arguments: String, Object, Array, ...
     *
     * Multiple arguments will be combined with `join('')`.
     *
     *     var t = new CLI.Template(
     *         '<div name="{id}">',
     *             '<span class="{cls}">{name} {value}</span>',
     *         '</div>',
     *         // a configuration object:
     *         {
     *             compiled: true,      // {@link #compile} immediately
     *         }
     *     );
     *
     * # Notes
     *
     * - For a list of available format functions, see {@link CLI.util.Format}.
     * - `disableFormats` reduces `{@link #apply}` time when no formatting is required.
     */
    CLI.define('CLI.Template', {

        // {{{ requires

        requires: [
            'CLI.util.Format'
        ],

        // }}}
        // {{{ constructor

        /**
         * Creates new template.
         *
         * @param {String...} html List of strings to be concatenated into template.
         * Alternatively an array of strings can be given, but then no config object may be passed.
         * @param {Object} config (optional) Config object
         */
        constructor: function(html) {

            var me = this,
                args = arguments,
                buffer = [],
                i,
                length = args.length,
                value;

            me.initialConfig = {};

            // Allow an array to be passed here so we can
            // pass an array of strings and an object
            // at the end
            if (length === 1 && CLI.isArray(html)) {
                args = html;
                length = args.length;
            }

            if (length > 1) {

                for (i = 0; i < length; i++) {

                    value = args[i];

                    if (typeof value == 'object') {

                        CLI.apply(me.initialConfig, value);
                        CLI.apply(me, value);

                    } else {

                        buffer.push(value);

                    }

                }

            } else {

                buffer.push(html);

            }

            // @private
            me.html = buffer.join('');

        },

        // }}}
        // {{{ isTemplate

        /**
         * @property {Boolean} isTemplate
         * `true` in this class to identify an object as an instantiated Template, or subclass thereof.
         */
        isTemplate: true,

        // }}}
        // {{{ compiled

        /**
         * @cfg {Boolean} compiled
         * True to immediately compile the template. Defaults to false.
         */

        // }}}
        // {{{ disableFormats

        /**
         * @cfg {Boolean} disableFormats
         * True to disable format functions in the template. If the template doesn't contain
         * format functions, setting disableFormats to true will reduce apply time. Defaults to false.
         */
        disableFormats: false,

        // }}}
        // {{{ tokenRe

        /**
         * @property {RegExp} re
         * Regular expression used to extract tokens.
         *
         * Finds the following expressions within a format string
         *
         *                     {AND?}
         *                     /   \
         *                   /       \
         *                 /           \
         *               /               \
         *            OR                  AND?
         *           /  \                 / \
         *          /    \               /   \
         *         /      \             /     \
         *    (\d+)  ([a-z_][\w\-]*)   /       \
         *     index       name       /         \
         *                           /           \
         *                          /             \
         *                   \:([a-z_\.]*)   (?:\((.*?)?\))?
         *                      formatFn           args
         *
         * Numeric index or (name followed by optional formatting function and args)
         * @private
         */
        tokenRe: /\{(?:(?:(\d+)|([a-z_][\w\-]*))(?::([a-z_\.]+)(?:\(([^\)]*?)?\))?)?)\}/gi,

        // }}}
        // {{{ apply

        /**
         * Returns an HTML fragment of this template with the specified values applied.
         *
         * @param {Object/Array} values The template values. Can be an array if your params are numeric:
         *
         *     var tpl = new CLI.Template('Name: {0}, Age: {1}');
         *     tpl.apply(['John', 25]);
         *
         * or an object:
         *
         *     var tpl = new CLI.Template('Name: {name}, Age: {age}');
         *     tpl.apply({name: 'John', age: 25});
         *
         * @return {String} The HTML fragment
         */
        apply: function(values) {

            var me = this;

            if (me.compiled) {

                if (!me.fn) {

                    me.compile();

                }

                return me.fn(values).join('');

            }

            return me.evaluate(values);
        },

        // }}}
        // {{{ evaluate

        // Private
        // Do not create the substitution closure on every apply call
        evaluate: function(values) {

            var me = this,
                useFormat = !me.disableFormats,
                fm = CLI.util.Format,
                tpl = me;

            function fn(match, index, name, formatFn, args) {

                // Calculate the correct name extracted from the {}
                // Certain browser pass unmatched parameters as undefined, some as an empty string.
                if (name == null || name == '') {
                    name = index;
                }

                if (formatFn && useFormat) {

                    if (args) {

                        args = [values[name]].concat(CLI.functionFactory('return ['+ args +'];')());

                    } else {

                        args = [values[name]];

                    }

                    // Caller used '{0:this.bold}'. Create a call to tpl member function
                    if (formatFn.substr(0, 5) === "this.") {

                        return tpl[formatFn.substr(5)].apply(tpl, args);

                    }

                    // Caller used '{0:number("0.00")}'. Create a call to CLI.util.Format function
                    else if (fm[formatFn]) {

                        return fm[formatFn].apply(fm, args);

                    }

                    // Caller used '{0:someRandomText}'. We must return it unchanged
                    else {

                        return match;

                    }

                } else {

                    return values[name] !== undefined ? values[name] : "";

                }

            }

            return me.html.replace(me.tokenRe, fn);
        },

        // }}}
        // {{{ applyOut

        /**
         * Appends the result of this template to the provided output array.
         * @param {Object/Array} values The template values. See {@link #apply}.
         * @param {Array} out The array to which output is pushed.
         * @return {Array} The given out array.
         */
        applyOut: function(values, out) {
            var me = this;

            if (me.compiled) {
                if (!me.fn) {
                    me.compile();
                }
                out.push.apply(out, me.fn(values));
            } else {
                out.push(me.apply(values));
            }

            return out;
        },

        // }}}
        // {{{ applyTemplate

        /**
         * @method applyTemplate
         * @member CLI.Template
         * Alias for {@link #apply}.
         * @inheritdoc CLI.Template#apply
         */
        applyTemplate: function () {

            return this.apply.apply(this, arguments);

        },

        // }}}
        // {{{ set

        /**
         * Sets the HTML used as the template and optionally compiles it.
         * @param {String} html
         * @param {Boolean} compile (optional) True to compile the template.
         * @return {CLI.Template} this
         */
        set: function(html, compile) {

            var me = this;

            me.html = html;
            me.compiled = !!compile;
            me.fn = null;

            return me;
        },

        // }}}
        // {{{ compileARe

        compileARe: /\\/g,

        // }}}
        // {{{ compileBRe

        compileBRe: /(\r\n|\n)/g,

        // }}}
        // {{{ compileCRe

        compileCRe: /'/g,

        // }}}
        // {{{ compile

        /**
         * Compiles the template into an internal function, eliminating the RegEx overhead.
         * @return {CLI.Template} this
         */
        compile: function() {

            var me = this,
                code;

            code = me.html.replace(me.compileARe, '\\\\').replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.tokenRe, me.regexReplaceFn.bind(me));
            code = (this.disableFormats !== true ? 'var fm=CLI.util.Format;' : '') + 'return' + " function(v) {return ['" + code + "'];};";

            me.fn  = (new Function('CLI', code))(CLI);
            me.compiled = true;

            return me;
        },

        // }}}
        // {{{ regexReplaceFn

        regexReplaceFn: function (match, index, name, formatFn, args) {

            // Calculate the correct expression to use to index into the values object/array
            // index may be a numeric string, or a quoted alphanumeric string.
            // Certain browser pass unmatched parameters as undefined, some as an empty string.
            if (index == null || index == '') {
                index = '"' + name + '"';
            }

            // If we are being used as a formatter for CLI.String.format, we must skip the string itself in the argument list.
            // Doing this enables String.format to omit the Array slice call.
            else if (this.stringFormat) {
                index = parseInt(index) + 1;
            }

            if (formatFn && this.disableFormats !== true) {

                args = args ? ',' + args: "";

                // Caller used '{0:this.bold}'. Create a call to member function
                if (formatFn.substr(0, 5) === "this.") {
                    formatFn = formatFn + '(';
                }

                // Caller used '{0:number("0.00")}'. Create a call to CLI.util.Format function
                else if (CLI.util.Format[formatFn]) {
                    formatFn = "fm." + formatFn + '(';
                }

                // Caller used '{0:someRandomText}'. We must pass it through unchanged
                else {
                    return match;
                }

                return "'," + formatFn + "v[" + index + "]" + args + "),'";

            } else {

                return "',v[" + index + "] == undefined ? '' : v[" + index + "],'";

            }

        }

        // }}}

    }, function(Template) {

        var formatRe = /\{\d+\}/,
            generateFormatFn = function(format) {

                // Generate a function which substitutes value tokens
                if (formatRe.test(format)) {
                    format = new Template(format, formatTplConfig);
                    return function() {
                        return format.apply(arguments);
                    };
                }

                // No value tokens
                else {
                    return function() {
                        return format;
                    };
                }

            },
            // Flags for the template compile process.
            // stringFormat means that token 0 consumes argument 1 etc.
            // So that String.format does not have to slice the argument list.
            formatTplConfig = { useFormat: false, compiled: true, stringFormat: true },
            formatFns = {};

        /**
         * Alias for {@link CLI.String#format}.
         * @method format
         * @inheritdoc CLI.String#format
         * @member CLI.util.Format
         */

        /**
         * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
         * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
         *
         *     var cls = 'my-class',
         *         text = 'Some text';
         *     var s = CLI.String.format('<div class="{0}">{1}</div>', cls, text);
         *     // s now contains the string: '<div class="my-class">Some text</div>'
         *
         * @param {String} string The tokenized string to be formatted.
         * @param {Mixed...} values The values to replace tokens `{0}`, `{1}`, etc in order.
         * @return {String} The formatted string.
         * @member CLI.String
         */
        CLI.String.format = CLI.util.Format.format = function(format) {
            var formatFn = formatFns[format] || (formatFns[format] = generateFormatFn(format));
            return formatFn.apply(this, arguments);
        };

    });

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
