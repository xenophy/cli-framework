/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Function
 *
 * A collection of useful static methods to deal with function callbacks.
 * @singleton
 */

(function() {

    "use strict";

    CLI.Function = (function() {

        // @define CLI.lang.Function
        // @define CLI.Function
        // @require CLI
        // @require CLI.lang.Array

        var CLIFunction = {

            // {{{ flexSetter

            /**
             * A very commonly used method throughout the framework. It acts as a wrapper around another method
             * which originally accepts 2 arguments for `name` and `value`.
             * The wrapped function then allows "flexible" value setting of either:
             *
             * - `name` and `value` as 2 arguments
             * - one single object argument with multiple key - value pairs
             *
             * For example:
             *
             *     var setValue = CLI.Function.flexSetter(function(name, value) {
             *         this[name] = value;
             *     });
             *
             *     // Afterwards
             *     // Setting a single name - value
             *     setValue('name1', 'value1');
             *
             *     // Settings multiple name - value pairs
             *     setValue({
             *         name1: 'value1',
             *         name2: 'value2',
             *         name3: 'value3'
             *     });
             *
             * @param {Function} setter The single value setter method.
             * @param {String} setter.name The name of the value being set.
             * @param {Object} setter.value The value being set.
             * @return {Function}
             */
            flexSetter: function(setter) {

                return function(name, value) {

                    var k, i;

                    if (name !== null) {

                        if (typeof name !== 'string') {

                            for (k in name) {

                                if (name.hasOwnProperty(k)) {
                                    setter.call(this, k, name[k]);
                                }

                            }

                        } else {

                            setter.call(this, name, value);

                        }
                    }

                    return this;
                };

            },

            // }}}
            // {{{ alias

            /**
             * Create an alias to the provided method property with name `methodName` of `object`.
             * Note that the execution scope will still be bound to the provided `object` itself.
             *
             * @param {Object/Function} object
             * @param {String} methodName
             * @return {Function} aliasFn
             */
            alias: function(object, methodName) {
                return function() {
                    return object[methodName].apply(object, arguments);
                };
            },

            // }}}

        };

        return CLIFunction;

    })();

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
