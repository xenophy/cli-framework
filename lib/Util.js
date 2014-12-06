/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint eqnull:true */

/*!
 * This file is part of CLI Framework
 */

(function() {

    "use strict";

    var objectPrototype = Object.prototype,
        toString        = objectPrototype.toString,
        iterableRe      = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/,
        MSDateRe        = /^\\?\/Date\(([-+])?(\d+)(?:[+-]\d{4})?\)\\?\/$/,
        callOverrideParent = function () {

            var method = callOverrideParent.caller.caller;

            return method.$owner.prototype[method.$name].apply(this, arguments);
        };

    CLI.apply(CLI, {

        // {{{ isWindows

        isWindows: (process.platform === 'win32'),

        // }}}
        // {{{ _namedScopes

        // shortcut for the special named scopes for listener scope resolution
        _namedScopes: {
            'this': { isThis: 1 },
            controller: { isController: 1 },
            // these two are private, used to indicate that listeners were declared on the
            // class body with either an unspecified scope, or scope:'controller'
            self: { isSelf: 1 },
            'self.controller': { isSelf: 1, isController: 1 }
        },

        // }}}
        // {{{ callback

        /**
         * @method callback
         * @member CLI
         * Execute a callback function in a particular scope. If `callback` argument is a
         * function reference, that is called. If it is a string, the string is assumed to
         * be the name of a method on the given `scope`. If no function is passed the call
         * is ignored.
         *
         * For example, these calls are equivalent:
         *
         *      var myFunc = this.myFunc;
         *
         *      CLI.callback('myFunc', this, [arg1, arg2]);
         *      CLI.callback(myFunc, this, [arg1, arg2]);
         *
         *      CLI.isFunction(myFunc) && this.myFunc(arg1, arg2);
         *
         * @param {Function/String} callback The callback function to execute or the name of
         * the callback method on the provided `scope`.
         * @param {Object} [scope] The scope in which `callback` should be invoked. If `callback`
         * is a string this object provides the method by that name. If this is `null` then
         * the `caller` is used to resolve the scope to a `ViewController` or the proper
         * `defaultListenerScope`.
         * @param {Array} [args] The arguments to pass to the function.
         * @param {Number} [delay] Pass a number to delay the call by a number of milliseconds.
         * @param {Object} [caller] The object calling the callback. This is used to resolve
         * named methods when no explicit `scope` is provided.
         * @param {Object} [defaultScope=caller] The default scope to return if none is found.
         * @return The value returned by the callback or `undefined` (if there is a `delay`
         * or if the `callback` is not a function).
         */
        callback: function (callback, scope, args, delay, caller, defaultScope) {

            if (!callback) {
                return;
            }

            var namedScope = (scope in CLI._namedScopes);

            if (callback.charAt) { // if (isString(fn))

                if ((!scope || namedScope) && caller) {
                    scope = caller.resolveListenerScope(namedScope ? scope : defaultScope);
                }
                //<debug>
                if (!scope || !CLI.isObject(scope)) {
                    CLI.Error.raise('Named method "' + callback + '" requires a scope object');
                }
                if (!CLI.isFunction(scope[callback])) {
                    CLI.Error.raise('No method named "' + callback + '" on ' +
                                    (scope.$className || 'scope object'));
                }
                //</debug>

                callback = scope[callback];

            } else if (namedScope) {

                scope = defaultScope || caller;

            } else if (!scope) {

                scope = caller;

            }

            var ret;

            if (callback && CLI.isFunction(callback)) {

                scope = scope || CLI.global;

                if (delay) {

                    CLI.defer(callback, delay, scope, args);

                } else if (args) {

                    ret = callback.apply(scope, args);

                } else {

                    ret = callback.call(scope);

                }

            }

            return ret;
        },

        // }}}
        // {{{ applyIf

        /**
         * @method applyIf
         * @member CLI
         * Copies all the properties of config to object if they don't already exist.
         * @param {Object} object The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf: function(object, config) {

            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        // }}}
        // {{{ iterate

        /**
         * @method iterate
         * @member CLI
         * Iterates either an array or an object. This method delegates to
         * {@link CLI.Array#each CLI.Array.each} if the given value is iterable, and {@link CLI.Object#each CLI.Object.each} otherwise.
         *
         * @param {Object/Array} object The object or array to be iterated.
         * @param {Function} fn The function to be called for each iteration. See and {@link CLI.Array#each CLI.Array.each} and
         * {@link CLI.Object#each CLI.Object.each} for detailed lists of arguments passed to this function depending on the given object
         * type that is being iterated.
         * @param {Object} [scope] The scope (`this` reference) in which the specified function is executed.
         * Defaults to the object being iterated itself.
         */
        iterate: function(object, fn, scope) {

            if (CLI.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (CLI.isIterable(object)) {
                CLI.Array.each.call(CLI.Array, object, fn, scope);
            }
            else {
                CLI.Object.each.call(CLI.Object, object, fn, scope);
            }

        },

        // }}}
        // {{{ isArray

        /**
         * @method isArray
         * @member CLI
         * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
         *
         * @param {Object} target The target to test.
         * @return {Boolean}
         * @method
         */
        isArray: Array.isArray,

        // }}}
        // {{{ isDate

        /**
         * @method isDate
         * @member CLI
         * Returns `true` if the passed value is a JavaScript Date object, `false` otherwise.
         * @param {Object} object The object to test.
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        // }}}
        // {{{ isEmpty

        /**
         * @method isEmpty
         * @member CLI
         * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
         *
         * @param {Object} value The value to test.
         * @param {Boolean} [allowEmptyString=false] `true` to allow empty strings.
         * @return {Boolean}
         */
        isEmpty: function(value, allowEmptyString) {
            return (value == null) || (!allowEmptyString ? value === '' : false) || (CLI.isArray(value) && value.length === 0);
        },

        // }}}
        // {{{ isMSDate

        /**
         * @method isMSDate
         * @member CLI
         * Returns 'true' if the passed value is a String that matches the MS Date JSON
         * encoding format.
         * @param {String} value The string to test.
         * @return {Boolean}
         */
        isMSDate: function(value) {

            if (!CLI.isString(value)) {
                return false;
            }

            return MSDateRe.test(value);
        },

        // }}}
        // {{{ isObject

        /**
         * @method isObject
         * @member CLI
         * Returns `true` if the passed value is a JavaScript Object, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isObject: function(value) {
            return toString.call(value) === '[object Object]';
        },

        // }}}
        // {{{ isPrimitive

        /**
         * @method isPrimitive
         * @member CLI
         * Returns `true` if the passed value is a JavaScript 'primitive', a string, number
         * or boolean.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isPrimitive: function(value) {

            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        // }}}
        // {{{ isFunction

        /**
         * @method isFunction
         * @member CLI
         * Returns `true` if the passed value is a JavaScript Function, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isFunction: function(value) {
            return !!value && typeof value === 'function';
        },

        // }}}
        // {{{ isNumber

        /**
         * @method isNumber
         * @member CLI
         * Returns `true` if the passed value is a number. Returns `false` for non-finite numbers.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        // }}}
        // {{{ isNumeric

        /**
         * @method isNumeric
         * @member CLI
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} True if numeric, false otherwise
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        // }}}
        // {{{ isString

        /**
         * @method isString
         * @member CLI
         * Returns `true `if the passed value is a string.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        // }}}
        // {{{ isBoolean

        /**
         * @method isBoolean
         * @member CLI
         * Returns `true` if the passed value is a boolean.
         *
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        // }}}
        // {{{ isDefined

        /**
         * @method isDefined
         * @member CLI
         * Returns `true` if the passed value is defined.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        // }}}
        // {{{ isIterable

        /**
         * @method isIterable
         * @member CLI
         * Returns `true` if the passed value is iterable, that is, if elements of it are addressable using array
         * notation with numeric indices, `false` otherwise.
         *
         * Arrays and function `arguments` objects are iterable. Also HTML collections such as `NodeList` and `HTMLCollection'
         * are iterable.
         *
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isIterable: function(value) {

            if (!value || typeof value.length !== 'number' || typeof value === 'string' || CLI.isFunction(value)) {
                return false;
            }

            if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
                return true;
            }

            return iterableRe.test(toString.call(value));
        },

        // }}}
        // {{{ now

        /**
         * @method now
         * @member CLI
         * Returns the current timestamp.
         * @return {Number} Milliseconds since UNIX epoch.
         * @method
         */
        now: Date.now,

        // }}}
        // {{{ functionFactory

        /**
         * @private
         */
        functionFactory: function() {

            var args = Array.prototype.slice.call(arguments),
                ln;

            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        // }}}
        // {{{ valueFrom

        /**
         * @method valueFrom
         * @member CLI
         * Returns the given value itself if it's not empty, as described in {@link CLI#isEmpty}; returns the default
         * value (second argument) otherwise.
         *
         * @param {Object} value The value to test.
         * @param {Object} defaultValue The value to return if the original value is empty.
         * @param {Boolean} [allowBlank=false] `true` to allow zero length strings to qualify as non-empty.
         * @return {Object} value, if non-empty, else defaultValue.
         */
        valueFrom: function(value, defaultValue, allowBlank){
            return CLI.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        // }}}
        // {{{ override

        /**
         * Overrides members of the specified `target` with the given values.
         *
         * If the `target` is a class declared using {@link CLI#define CLI.define}, the
         * `override` method of that class is called (see {@link CLI.Base#override}) given
         * the `overrides`.
         *
         * If the `target` is a function, it is assumed to be a constructor and the contents
         * of `overrides` are applied to its `prototype` using {@link CLI#apply CLI.apply}.
         *
         * If the `target` is an instance of a class declared using {@link CLI#define CLI.define},
         * the `overrides` are applied to only that instance. In this case, methods are
         * specially processed to allow them to use {@link CLI.Base#callParent}.
         *
         *      var panel = new CLI.Panel({ ... });
         *
         *      CLI.override(panel, {
         *          initComponent: function () {
         *              // extra processing...
         *
         *              this.callParent();
         *          }
         *      });
         *
         * If the `target` is none of these, the `overrides` are applied to the `target`
         * using {@link CLI#apply CLI.apply}.
         *
         * Please refer to {@link CLI#define CLI.define} and {@link CLI.Base#override} for
         * further details.
         *
         * @param {Object} target The target to override.
         * @param {Object} overrides The properties to add or replace on `target`.
         * @method override
         * @member CLI
         */
        override: function (target, overrides) {

            if (target.$isClass) {

                target.override(overrides);

            } else if (typeof target == 'function') {

                CLI.apply(target.prototype, overrides);

            } else {

                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) { // if (instance of CLI.define'd class)

                    for (name in overrides) {

                        if (overrides.hasOwnProperty(name)) {

                            value = overrides[name];

                            if (typeof value === 'function') {

                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name) ? target[name] : callOverrideParent;
                            }

                            target[name] = value;
                        }
                    }

                } else {

                    CLI.apply(target, overrides);

                }

            }

            return target;
        },

        // }}}
        // {{{ clone

        /**
         * @method clone
         * @member CLI
         * Clone simple variables including array, {}-like objects, DOM nodes and Date without keeping the old reference.
         * A reference for the object itself is returned if it's not a direct decendant of Object. For model cloning,
         * see {@link CLI.data.Model#copy Model.copy}.
         *
         * @param {Object} item The variable to clone
         * @return {Object} clone
         */
        clone: function(item) {

            if (item === null || item === undefined) {
                return item;
            }

            var type = toString.call(item),
                i, j, k, clone, key;

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = CLI.clone(item[i]);
                }
            }

            // Object
            else if (type === '[object Object]' && item.constructor === Object) {

                clone = {};

                for (key in item) {
                    clone[key] = CLI.clone(item[key]);
                }

            }

            return clone || item;
        },

        // }}}
        // {{{ resolvePath

        resolvePath: function(string) {

            var path = require('path');

            if (string.substr(0,1) === '~') {
                string = process.env[CLI.isWindows ? 'USERPROFILE' : 'HOME'] + string.substr(1)
            }

            return path.resolve(string)
        },

        // }}}
        // {{{ typeOf

        /**
         * @method typeOf
         * @member CLI
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         *
         * @param {Object} value
         * @return {String}
         */
        typeOf: (function () {

            var nonWhitespaceRe = /\S/,
                toString = Object.prototype.toString,
                typeofTypes = {
                    number: 1,
                    string: 1,
                    'boolean': 1,
                    'undefined': 1
                },
                toStringTypes = {
                    '[object Array]'  : 'array',
                    '[object Date]'   : 'date',
                    '[object Boolean]': 'boolean',
                    '[object Number]' : 'number',
                    '[object RegExp]' : 'regexp'
                };

            return function(value) {

                if (value === null) {
                    return 'null';
                }

                var type = typeof value,
                    ret, typeToString;

                if (typeofTypes[type]) {
                    return type;
                }

                ret = toStringTypes[typeToString = toString.call(value)];

                if (ret) {
                    return ret;
                }

                if (type === 'function') {
                    return 'function';
                }

                if (type === 'object') {
                    return 'object';
                }

                // TODO: implemented after, enable
                /*
                CLI.Error.raise({
                    sourceClass: 'CLI',
                    sourceMethod: 'typeOf',
                    msg: 'Failed to determine the type of "' + value + '".'
                });
               */

                return typeToString;
            };

        }()),

        // }}}
        // {{{ log

        /**
         * @method log
         * @member CLI
         * Logs a message. If a console is present it will be used. On Opera, the method
         * "opera.postError" is called. In other cases, the message is logged to an array
         * "CLI.log.out". An attached debugger can watch this array and view the log. The
         * log buffer is limited to a maximum of "CLI.log.max" entries (defaults to 250).
         *
         * If additional parameters are passed, they are joined and appended to the message.
         * A technique for tracing entry and exit of a function is this:
         *
         *     function foo () {
         *         CLI.log({ indent: 1 }, '>> foo');
         *
         *         // log statements in here or methods called from here will be indented
         *         // by one step
         *
         *         CLI.log({ outdent: 1 }, '<< foo');
         *     }
         *
         * This method does nothing in a release build.
         *
         * @param {String/Object} [options] The message to log or an options object with any
         * of the following properties:
         *
         *  - `msg`: The message to log (required).
         *  - `level`: One of: "error", "warn", "info" or "log" (the default is "log").
         *  - `dump`: An object to dump to the log as part of the message.
         *  - `stack`: True to include a stack trace in the log.
         *  - `indent`: Cause subsequent log statements to be indented one step.
         *  - `outdent`: Cause this and following statements to be one step less indented.
         *
         * @param {String...} [message] The message to log (required unless specified in
         * options object).
         */
        log:
            (function () {
            /*
             * Iterate through an object to dump its content into a string.
             * For example:
             *     {
             *         style: {
             *             lineWidth: 1
             *         },
             *         label: {},
             *         marker: {
             *             strokeStyle: "#555",
             *             radius: 3,
             *             size: 3
             *         },
             *         subStyle: {
             *             fillStyle: [
             *                 0: "#133987",
             *                 1: "#1c55ca",
             *                 2: "#4d7fe6"
             *             ]
             *         },
             *         markerSubStyle: {}
             *     } 
             *
             * @param {Object} object The object to iterate
             * @param {Number} [level] Current level of identation (and recursion). Default is 0.
             * @param {Number} [maxLevel] Maximum level of recursion. Default is 3.
             * @param {Boolean} [withFunctions] Include functions in the output.
             * @return {String} The string with the contents of the object
             */
            var primitiveRe = /string|number|boolean/;

            function dumpObject(object, level, maxLevel, withFunctions) {

                var member, type, value, name, prefix, suffix,
                    members = [];

                if (CLI.isArray(object)) {

                    prefix = '[';
                    suffix = ']';

                } else if (CLI.isObject(object)) {

                    prefix = '{';
                    suffix = '}';

                }

                if (!maxLevel) {
                    maxLevel = 3;
                }

                if (level > maxLevel) {
                    return prefix+'...'+suffix;
                }

                level = level || 1;

                var spacer = (new Array(level)).join('    ');

                // Cannot use CLI.encode since it can recurse endlessly
                for (name in object) {

                    if (object.hasOwnProperty(name)) {

                        value = object[name];

                        type = typeof value;

                        if (type == 'function') {

                            if (!withFunctions) {
                                continue;
                            }

                            member = type;

                        } else if (type == 'undefined') {

                            member = type;

                        } else if (value === null || primitiveRe.test(type) || CLI.isDate(value)) {

                            member = CLI.encode(value);

                        } else if (CLI.isArray(value)) {

                            member = this.dumpObject(value, level+1, maxLevel, withFunctions);

                        } else if (CLI.isObject(value)) {

                            member = this.dumpObject(value, level+1, maxLevel, withFunctions);

                        } else {

                            member = type;

                        }

                        members.push(spacer + name + ': ' + member);    // or CLI.encode(name)
                    }
                }

                if (members.length) {

                    return prefix + '\n    '+ members.join(',\n    ') + '\n'+spacer+suffix;

                }

                return prefix+suffix;

            }

            // {{{ log

            function log(message) {

                var options, dump,
                    con = CLI.global.console,
                    level = 'log',
                    indent = log.indent || 0,
                    stack,
                    out,
                    max;

                log.indent = indent;

                if (typeof message != 'string') {

                    options = message;
                    message = options.msg || '';
                    level = options.level || level;
                    dump = options.dump;
                    stack = options.stack;

                    if (options.indent) {

                        ++log.indent;

                    } else if (options.outdent) {

                        log.indent = indent = Math.max(indent - 1, 0);

                    }

                    if (dump && !(con && con.dir)) {

                        message += dumpObject(dump);
                        dump = null;

                    }

                }

                if (arguments.length > 1) {

                    message += Array.prototype.slice.call(arguments, 1).join('');

                }

                message = indent ? CLI.String.repeat(' ', log.indentSize * indent) + message : message;
                // w/o console, all messages are equal, so munge the level into the message:

                if (level != 'log') {
                    message = '[' + level.charAt(0).toUpperCase() + '] ' + message;
                }

                if (con[level]) {

                    if (con.suspended !== true) {
                        con[level](message);
                    }

                } else {

                    if (con.suspended !== true) {
                        con.log(message);
                    }

                }

                if (dump) {

                    if (con.suspended !== true) {
                        con.dir(dump);
                    }

                }

                if (stack && con.trace) {

                    if (con.suspended !== true) {

                        if (level != 'error') {
                            con.trace();
                        }

                    }
                }

                if (con.suspended !== true) {

                    // Mostly informational, but the CLI.Error notifier uses them:
                    ++log.count;
                    ++log.counters[level];

                }
            }

            // }}}
            // {{{ logx

            function logx(level, args) {

                if (typeof args[0] == 'string') {
                    args.unshift({});
                }

                args[0].level = level;
                log.apply(this, args);
            }

            // }}}

            log.error = function () {

                if (CLI.global.console.suspended !== true) {
                    logx('error', Array.prototype.slice.call(arguments));
                }

            };

            log.info = function () {

                if (CLI.global.console.suspended !== true) {
                    logx('info', Array.prototype.slice.call(arguments));
                }

            };

            log.warn = function () {

                if (CLI.global.console.suspended !== true) {
                    logx('warn', Array.prototype.slice.call(arguments));
                }

            };

            log.count = 0;
            log.counters = { error: 0, warn: 0, info: 0, log: 0 };
            log.indentSize = 2;
            log.out = [];
            log.max = 750;

            return log;

        }())

        // }}}

    });

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
