/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint eqnull:true */

/**
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

        // {{{ applyIf

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

        isArray: Array.isArray,

        // }}}
        // {{{ isDate

        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        // }}}
        // {{{ isEmpty

        isEmpty: function(value, allowEmptyString) {
            return (value == null) || (!allowEmptyString ? value === '' : false) || (CLI.isArray(value) && value.length === 0);
        },

        // }}}
        // {{{ isMSDate

        isMSDate: function(value) {

            if (!CLI.isString(value)) {
                return false;
            }

            return MSDateRe.test(value);
        },

        // }}}
        // {{{ isObject

        isObject: function(value) {
            return toString.call(value) === '[object Object]';
        },

        // }}}
        // {{{ isPrimitive

        isPrimitive: function(value) {

            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        // }}}
        // {{{ isFunction

        isFunction: function(value) {
            return !!value && typeof value === 'function';
        },

        // }}}
        // {{{ isNumber

        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        // }}}
        // {{{ isNumeric

        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        // }}}
        // {{{ isString

        isString: function(value) {
            return typeof value === 'string';
        },

        // }}}
        // {{{ isBoolean

        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        // }}}
        // {{{ isDefined

        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        // }}}
        // {{{ isIterable

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

        now: Date.now,

        // }}}
        // {{{ functionFactory

        functionFactory: function() {

            var args = Array.prototype.slice.call(arguments),
                ln;

            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        // }}}

        /*

        valueFrom: function(value, defaultValue, allowBlank){
            return CLI.isEmpty(value, allowBlank) ? defaultValue : value;
        },

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
                                //<debug>
                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }
                                //</debug>

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name] // already hooked, so call previous hook
                                    : callOverrideParent; // calls by name on prototype
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


        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            // TODO proxy this to CLI.Element.clone to handle automatic id attribute changing
            // recursively
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
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

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        if (item.hasOwnProperty(k)) {
                            clone[k] = item[k];
                        }
                    }
                }
            }

            return clone || item;
        },

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
                    if (value.nodeType !== undefined) {
                        if (value.nodeType === 3) {
                            return nonWhitespaceRe.test(value.nodeValue) ? 'textnode' : 'whitespace';
                        }
                        else {
                            return 'element';
                        }
                    }

                    return 'object';
                }

                //<debug>
                CLI.Error.raise({
                    sourceClass: 'Ext',
                    sourceMethod: 'typeOf',
                    msg: 'Failed to determine the type of "' + value + '".'
                });
                //</debug>

                return typeToString;
            };
        }()),

       */

    });

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
