/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

(function() {

    "use strict";

    var objectPrototype = Object.prototype,
        toString        = objectPrototype.toString,
        iterableRe      = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/,
        MSDateRe        = /^\\?\/Date\(([-+])?(\d+)(?:[+-]\d{4})?\)\\?\/$/;


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

            /*

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
           */
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
        // {{{ isSimpleObject

        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
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

            if (!value || typeof value.length !== 'number' || typeof value === 'string' || Ext.isFunction(value)) {
                return false;
            }

            if (!value.propertyIsEnumerable) {
                return !!value.item;
            }

            if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
                return true;
            }

            return iterableRe.test(toString.call(value));
        },

        // }}}
        // {{{ now

        now: (Date.now || (Date.now = function() {
            return +new Date();
        })),

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
