/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Assert
 *
 * This class provides help value testing methods useful for diagnostics. These are often
 * used in `debugHooks`:
 *
 *      CLI.define('Foo.bar.Class', {
 *
 *          debugHooks: {
 *              method: function (a) {
 *                  CLI.AsserisNotDefinedPropt.truthy(a, 'Expected "a" to be truthy");
 *              },
 *
 *              foo: function (object) {
 *                  CLI.Assert.isFunctionProp(object, 'doSomething');
 *              }
 *          }
 *      });
 *
 * **NOTE:** This class is entirely removed in production builds so all uses of it should
 * be either in `debug` conditional comments or `debugHooks`.
 *
 * The following type detection methods from the `CLI` object are wrapped as assertions
 * by this class:
 *
 *  * `isEmpty`
 *  * `isArray`
 *  * `isDate`
 *  * `isObject`
 *  * `isSimpleObject`
 *  * `isPrimitive`
 *  * `isFunction`
 *  * `isNumber`
 *  * `isNumeric`
 *  * `isString`
 *  * `isBoolean`
 *  * `isElement`
 *  * `isTextNode`
 *  * `isDefined`
 *  * `isIterable`
 *
 * These appear both their exact name and with a "Prop" suffix for checking a property on
 * an object. For example, these are almost identical:
 *
 *      CLI.Assert.isFunction(object.foo);
 *
 *      CLI.Assert.isFunctionProp(object, 'foo');
 *
 * The difference is the default error message generated is better in the second use case
 * than the first.
 *
 * The above list are also expanded for "Not" flavors (and "Not...Prop"):
 *
 *  * `isNotEmpty`
 *  * `isNotArray`
 *  * `isNotDate`
 *  * `isNotObject`
 *  * `isNotSimpleObject`
 *  * `isNotPrimitive`
 *  * `isNotFunction`
 *  * `isNotNumber`
 *  * `isNotNumeric`
 *  * `isNotString`
 *  * `isNotBoolean`
 *  * `isNotElement`
 *  * `isNotTextNode`
 *  * `isNotDefined`
 *  * `isNotIterable`
 *
 * @singleton
 */

(function() {

    "use strict";

    // {{{ CLI.Assert

    CLI.Assert = {

        // {{{ falsey

        /**
         * Checks that the first argument is falsey and throws an `Error` if it is not.
         */
        falsey: function (b, msg) {

            if (b) {
                CLI.Error.raise(msg || ('Expected a falsey value but was ' + b));
            }

        },

        // }}}
        // {{{ falseyProp

        /**
         * Checks that the first argument is falsey and throws an `Error` if it is not.
         */
        falseyProp: function (object, property) {

            CLI.Assert.truthy(object);

            var b = object[property];

            if (b) {

                if (object.$className) {
                    property = object.$className + '#' + property;
                }

                CLI.Error.raise('Expected a falsey value for ' + property + ' but was ' + b);
            }

        },

        // }}}
        // {{{ truthy

        /**
         * Checks that the first argument is truthy and throws an `Error` if it is not.
         */
        truthy: function (b, msg) {

            if (!b) {
                CLI.Error.raise(msg || ('Expected a truthy value but was ' + typeof b));
            }

        },

        // }}}
        // {{{ truthyProp

        /**
         * Checks that the first argument is truthy and throws an `Error` if it is not.
         */
        truthyProp: function (object, property) {

            CLI.Assert.truthy(object);

            var b = object[property];

            if (!b) {

                if (object.$className) {
                    property = object.$className + '#' + property;
                }

                CLI.Error.raise('Expected a truthy value for ' + property + ' but was ' + typeof b);
            }

        }

        // }}}

    };

    // }}}
    // {{{ functions

    (function () {

        // {{{ makeAssert

        function makeAssert(name, kind) {

            var testFn = CLI[name],
                def;

            return function (value, msg) {
                if (!testFn(value)) {
                    CLI.Error.raise(msg || def || (def = 'Expected value to be ' + kind));
                }
            };

        }

        // }}}
        // {{{ makeAssertProp

        function makeAssertProp(name, kind) {

            var testFn = CLI[name],
                def;

            return function (object, prop) {

                CLI.Assert.truthy(object);

                if (!testFn(object[prop])) {
                    CLI.Error.raise(def || (def = 'Expected ' + (object.$className ? object.$className + '#' : '') + prop + ' to be ' + kind));
                }

            };

        }

        // }}}
        // {{{ makeNotAssert

        function makeNotAssert (name, kind) {

            var testFn = CLI[name],
                def;

            return function (value, msg) {
                if (testFn(value)) {
                    CLI.Error.raise(msg || def || (def = 'Expected value to NOT be ' + kind));
                }
            };

        }

        // }}}
        // {{{ makeNotAssertProp

        function makeNotAssertProp (name, kind) {

            var testFn = CLI[name],
                def;

            return function (object, prop) {
                CLI.Assert.truthy(object);
                if (testFn(object[prop])) {
                    CLI.Error.raise(def || (def = 'Expected ' + (object.$className ? object.$className + '#' : '') + prop + ' to NOT be ' + kind));
                }
            };

        }

        // }}}
        // {{{ set CLI.isXXX's assert

        for (var name in CLI) {

            if (name.substring(0,2) == "is" && CLI.isFunction(CLI[name])) {

                var kind = name.substring(2);

                CLI.Assert[name] = makeAssert(name, kind);
                CLI.Assert[name + 'Prop'] = makeAssertProp(name, kind);
                CLI.Assert['isNot' + kind] = makeNotAssert(name, kind);
                CLI.Assert['isNot' + kind + 'Prop'] = makeNotAssertProp(name, kind);
            }

        }

        // }}}

    }());

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
