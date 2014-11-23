/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint supernew:true */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Array
 * @singleton
 */

(function() {

    "use strict";

    CLI.Array = new (function() {

        var arrayPrototype  = Array.prototype,
            slice           = arrayPrototype.slice,
            CLIArray;

        CLIArray = {

            // {{{ toArray

            toArray: function(iterable, start, end){

                if (!iterable || !iterable.length) {
                    return [];
                }

                if (typeof iterable === 'string') {
                    iterable = iterable.split('');
                }

                return slice.call(iterable, start || 0, end || iterable.length);
            },

            // }}}
            // {{{ from

            from: function(value, newReference) {

                if (value === undefined || value === null) {
                    return [];
                }

                if (CLI.isArray(value)) {
                    return (newReference) ? slice.call(value) : value;
                }

                var type = typeof value;

                if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {
                    return CLIArray.toArray(value);
                }

                return [value];
            },

            // }}}
            // {{{ each

            each: function(array, fn, scope, reverse) {

                array = CLIArray.from(array);

                var i, ln = array.length;

                if (reverse !== true) {

                    for (i = 0; i < ln; i++) {

                        if (fn.call(scope || array[i], array[i], i, array) === false) {
                            return i;
                        }

                    }

                } else {

                    for (i = ln - 1; i > -1; i--) {

                        if (fn.call(scope || array[i], array[i], i, array) === false) {

                            return i;

                        }

                    }

                }

                return true;
            }

            // }}}

        };

        return CLIArray;
    });

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
