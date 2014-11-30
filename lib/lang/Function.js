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

    // {{{ CLI.Function

    CLI.Function = (function() {

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
                // {{{ bind

                /**
                 * Create a new function from the provided `fn`, change `this` to the provided scope,
                 * optionally overrides arguments for the call. Defaults to the arguments passed by
                 * the caller.
                 *
                 * {@link CLI#bind CLI.bind} is alias for {@link CLI.Function#bind CLI.Function.bind}
                 *
                 * **NOTE:** This method is deprecated. Use the standard `bind` method of JavaScript
                 * `Function` instead:
                 *
                 *      function foo () {
                 *          ...
                 *      }
                 *
                 *      var fn = foo.bind(this);
                 *
                 * This method is unavailable natively on IE8 and IE/Quirks but CLI Framework provides a
                 * "polyfill" to emulate the important features of the standard `bind` method. In
                 * particular, the polyfill only provides binding of "this" and optional arguments.
                 * 
                 * @param {Function} fn The function to delegate.
                 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
                 * **If omitted, defaults to the default global environment object (usually the browser window).**
                 * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
                 * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
                 * if a number the args are inserted at the specified position.
                 * @return {Function} The new function.
                 */
                bind: function(fn, scope, args, appendArgs) {

                    if (arguments.length === 2) {
                        return function() {
                            return fn.apply(scope, arguments);
                        };
                    }

                    var method = fn,
                        slice = Array.prototype.slice;

                    return function() {

                        var callArgs = args || arguments;

                        if (appendArgs === true) {

                            callArgs = slice.call(arguments, 0);
                            callArgs = callArgs.concat(args);

                        } else if (typeof appendArgs == 'number') {

                            callArgs = slice.call(arguments, 0); // copy arguments first
                            CLI.Array.insert(callArgs, appendArgs, args);

                        }

                        return method.apply(scope || CLI.global, callArgs);
                    };

                },

                // }}}
                // {{{ bindCallback

                /**
                 * Captures the given parameters for a later call to `CLI.callback`.
                 *
                 * The arguments match that of `CLI.callback` except for the `args` which, if provided
                 * to this method, are prepended to any arguments supplied by the eventual caller of
                 * the returned function.
                 *
                 * @return {Function} A function that, when called, uses `CLI.callback` to call the
                 * captured `callback`.
                 */
                bindCallback: function (callback, scope, args, delay, caller) {

                    return function () {

                        var a = CLI.Array.slice(arguments);

                        return CLI.callback(callback, scope, args ? args.concat(a) : a, delay, caller);

                    };

                },

                // }}}
                // {{{ pass

                /**
                 * Create a new function from the provided `fn`, the arguments of which are pre-set to `args`.
                 * New arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.
                 * This is especially useful when creating callbacks.
                 *
                 * For example:
                 *
                 *     var originalFunction = function(){
                 *         alert(CLI.Array.from(arguments).join(' '));
                 *     };
                 *
                 *     var callback = CLI.Function.pass(originalFunction, ['Hello', 'World']);
                 *
                 *     callback(); // alerts 'Hello World'
                 *     callback('by Me'); // alerts 'Hello World by Me'
                 *
                 * {@link CLI#pass CLI.pass} is alias for {@link CLI.Function#pass CLI.Function.pass}
                 *
                 * @param {Function} fn The original function.
                 * @param {Array} args The arguments to pass to new callback.
                 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
                 * @return {Function} The new callback function.
                 */
                pass: function(fn, args, scope) {

                    if (!CLI.isArray(args)) {

                        if (CLI.isIterable(args)) {

                            args = CLI.Array.clone(args);

                        } else {

                            args = args !== undefined ? [args] : [];

                        }
                    }

                    return function() {

                        var fnArgs = args.slice();

                        fnArgs.push.apply(fnArgs, arguments);

                        return fn.apply(scope || this, fnArgs);
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
                // {{{ clone

                /**
                 * Create a "clone" of the provided method. The returned method will call the given
                 * method passing along all arguments and the "this" pointer and return its result.
                 *
                 * @param {Function} method
                 * @return {Function} cloneFn
                 */
                clone: function(method) {
                    return function() {
                        return method.apply(this, arguments);
                    };
                },

                // }}}
                // {{{ createInterceptor

                /**
                 * Creates an interceptor function. The passed function is called before the original one. If it returns false,
                 * the original one is not called. The resulting function returns the results of the original function.
                 * The passed function is called with the parameters of the original function. Example usage:
                 *
                 *     var sayHi = function(name){
                 *         alert('Hi, ' + name);
                 *     };
                 *
                 *     sayHi('Fred'); // alerts "Hi, Fred"
                 *
                 *     // create a new function that validates input without
                 *     // directly modifying the original function:
                 *     var sayHiToFriend = CLI.Function.createInterceptor(sayHi, function(name){
                 *         return name === 'Brian';
                 *     });
                 *
                 *     sayHiToFriend('Fred');  // no alert
                 *     sayHiToFriend('Brian'); // alerts "Hi, Brian"
                 *
                 * @param {Function} origFn The original function.
                 * @param {Function} newFn The function to call before the original.
                 * @param {Object} [scope] The scope (`this` reference) in which the passed function is executed.
                 * **If omitted, defaults to the scope in which the original function is called or the browser window.**
                 * @param {Object} [returnValue=null] The value to return if the passed function return `false`.
                 * @return {Function} The new function.
                 */
                createInterceptor: function(origFn, newFn, scope, returnValue) {

                    if (!CLI.isFunction(newFn)) {

                        return origFn;

                    } else {

                        returnValue = CLI.isDefined(returnValue) ? returnValue : null;

                        return function() {

                            var me = this,
                                args = arguments;

                            newFn.target = me;
                            newFn.method = origFn;
                            return (newFn.apply(scope || me || CLI.global, args) !== false) ?  origFn.apply(me || CLI.global, args) : returnValue;
                        };

                    }

                },

                // }}}
                // {{{ createDelayed

                /**
                 * Creates a delegate (callback) which, when called, executes after a specific delay.
                 *
                 * @param {Function} fn The function which will be called on a delay when the returned function is called.
                 * Optionally, a replacement (or additional) argument list may be specified.
                 * @param {Number} delay The number of milliseconds to defer execution by whenever called.
                 * @param {Object} scope (optional) The scope (`this` reference) used by the function at execution time.
                 * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
                 * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
                 * if a number the args are inserted at the specified position.
                 * @return {Function} A function which, when called, executes the original function after the specified delay.
                 */
                createDelayed: function(fn, delay, scope, args, appendArgs) {

                    if (scope || args) {

                        fn = CLI.Function.bind(fn, scope, args, appendArgs);

                    }

                    return function() {

                        var me = this,
                            args = Array.prototype.slice.call(arguments);

                        setTimeout(function() {

                            fn.apply(me, args);

                        }, delay);
                    };

                },

                /**
                 * Calls this function after the number of milliseconds specified, optionally in a specific scope. Example usage:
                 *
                 *     var sayHi = function(name){
                 *         alert('Hi, ' + name);
                 *     }
                 *
                 *     // executes immediately:
                 *     sayHi('Fred');
                 *
                 *     // executes after 2 seconds:
                 *     CLI.Function.defer(sayHi, 2000, this, ['Fred']);
                 *
                 *     // this syntax is sometimes useful for deferring
                 *     // execution of an anonymous function:
                 *     CLI.Function.defer(function(){
                 *         alert('Anonymous');
                 *     }, 100);
                 *
                 * {@link CLI#defer CLI.defer} is alias for {@link CLI.Function#defer CLI.Function.defer}
                 *
                 * @param {Function} fn The function to defer.
                 * @param {Number} millis The number of milliseconds for the `setTimeout` call
                 * (if less than or equal to 0 the function is executed immediately).
                 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
                 * **If omitted, defaults to the browser window.**
                 * @param {Array} [args] Overrides arguments for the call. Defaults to the arguments passed by the caller.
                 * @param {Boolean/Number} [appendArgs=false] If `true` args are appended to call args instead of overriding,
                 * or, if a number, then the args are inserted at the specified position.
                 * @return {Number} The timeout id that can be used with `clearTimeout`.
                 */
                defer: function(fn, millis, scope, args, appendArgs) {

                    fn = CLI.Function.bind(fn, scope, args, appendArgs);

                    if (millis > 0) {

                        return setTimeout(function () {
                            fn();
                        }, millis);

                    }

                    fn();

                    return 0;

                },

                // }}}
                // {{{ interval

                /**
                 * Calls this function repeatedly at a given interval, optionally in a specific scope.
                 *
                 * {@link CLI#defer CLI.defer} is alias for {@link CLI.Function#defer CLI.Function.defer}
                 *
                 * @param {Function} fn The function to defer.
                 * @param {Number} millis The number of milliseconds for the `setInterval` call
                 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
                 * **If omitted, defaults to the browser window.**
                 * @param {Array} [args] Overrides arguments for the call. Defaults to the arguments passed by the caller.
                 * @param {Boolean/Number} [appendArgs=false] If `true` args are appended to call args instead of overriding,
                 * or, if a number, then the args are inserted at the specified position.
                 * @return {Number} The interval id that can be used with `clearInterval`.
                 */
                interval: function(fn, millis, scope, args, appendArgs) {

                    fn = CLI.Function.bind(fn, scope, args, appendArgs);

                    return setInterval(function () {
                        fn();
                    }, millis);

                },

                // }}}
                // {{{ createSequence

                /**
                 * Create a combined function call sequence of the original function + the passed function.
                 * The resulting function returns the results of the original function.
                 * The passed function is called with the parameters of the original function. Example usage:
                 *
                 *     var sayHi = function(name){
                 *         alert('Hi, ' + name);
                 *     };
                 *
                 *     sayHi('Fred'); // alerts "Hi, Fred"
                 *
                 *     var sayGoodbye = CLI.Function.createSequence(sayHi, function(name){
                 *         alert('Bye, ' + name);
                 *     });
                 *
                 *     sayGoodbye('Fred'); // both alerts show
                 *
                 * @param {Function} originalFn The original function.
                 * @param {Function} newFn The function to sequence.
                 * @param {Object} [scope] The scope (`this` reference) in which the passed function is executed.
                 * If omitted, defaults to the scope in which the original function is called or the
                 * default global environment object (usually the browser window).
                 * @return {Function} The new function.
                 */
                createSequence: function(originalFn, newFn, scope) {

                    if (!newFn) {

                        return originalFn;

                    } else {

                        return function() {

                            var result = originalFn.apply(this, arguments);

                            newFn.apply(scope || this, arguments);

                            return result;
                        };

                    }

                },

                // }}}
                // {{{ createBuffered

                /**
                 * Creates a delegate function, optionally with a bound scope which, when called, buffers
                 * the execution of the passed function for the configured number of milliseconds.
                 * If called again within that period, the impending invocation will be canceled, and the
                 * timeout period will begin again.
                 *
                 * @param {Function} fn The function to invoke on a buffered timer.
                 * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
                 * function.
                 * @param {Object} [scope] The scope (`this` reference) in which.
                 * the passed function is executed. If omitted, defaults to the scope specified by the caller.
                 * @param {Array} [args] Override arguments for the call. Defaults to the arguments
                 * passed by the caller.
                 * @return {Function} A function which invokes the passed function after buffering for the specified time.
                 */
                createBuffered: function(fn, buffer, scope, args) {

                    var timerId;

                    return function() {

                        var callArgs = args || Array.prototype.slice.call(arguments, 0),
                            me = scope || this;

                        if (timerId) {
                            clearTimeout(timerId);
                        }

                        timerId = setTimeout(function(){

                            fn.apply(me, callArgs);

                        }, buffer);

                    };

                },

                // }}}
                // {{{ createThrottled

                /**
                 * Creates a throttled version of the passed function which, when called repeatedly and
                 * rapidly, invokes the passed function only after a certain interval has elapsed since the
                 * previous invocation.
                 *
                 * This is useful for wrapping functions which may be called repeatedly, such as
                 * a handler of a mouse move event when the processing is expensive.
                 *
                 * @param {Function} fn The function to execute at a regular time interval.
                 * @param {Number} interval The interval in milliseconds on which the passed function is executed.
                 * @param {Object} [scope] The scope (`this` reference) in which
                 * the passed function is executed. If omitted, defaults to the scope specified by the caller.
                 * @returns {Function} A function which invokes the passed function at the specified interval.
                 */
                createThrottled: function(fn, interval, scope) {

                    var lastCallTime = 0,
                        elapsed,
                        lastArgs,
                        timer,
                        execute = function() {

                            fn.apply(scope, lastArgs);

                            lastCallTime = CLI.now();
                            timer = null;

                        };

                    return function() {

                        // Use scope of last call unless the creator specified a scope
                        if (!scope) {
                            scope = this;
                        }

                        elapsed = CLI.now() - lastCallTime;
                        lastArgs = arguments;

                        // If this is the first invocation, or the throttle interval has been reached, clear any
                        // pending invocation, and call the target function now.
                        if (elapsed >= interval) {
                            clearTimeout(timer);
                            execute();
                        }
                        // Throttle interval has not yet been reached. Only set the timer to fire if not already set.
                        else if (!timer) {
                            timer = CLI.defer(execute, interval - elapsed);
                        }
                    };

                },

                // }}}
                // {{{ createBarrier

                /**
                 * Wraps the passed function in a barrier function which will call the passed function after the passed number of invocations.
                 * @param {Number} count The number of invocations which will result in the calling of the passed function.
                 * @param {Function} fn The function to call after the required number of invocations.
                 * @param {Object} scope The scope (`this` reference) in which the function will be called.
                 */
                createBarrier: function(count, fn, scope) {

                    return function() {

                        if (!--count) {
                            fn.apply(scope, arguments);
                        }

                    };

                },

                // }}}
                // {{{ interceptBefore

                /**
                 * Adds behavior to an existing method that is executed before the
                 * original behavior of the function.  For example:
                 *
                 *     var soup = {
                 *         contents: [],
                 *         add: function(ingredient) {
                 *             this.contents.push(ingredient);
                 *         }
                 *     };
                 *     CLI.Function.interceptBefore(soup, "add", function(ingredient){
                 *         if (!this.contents.length && ingredient !== "water") {
                 *             // Always add water to start with
                 *             this.contents.push("water");
                 *         }
                 *     });
                 *     soup.add("onions");
                 *     soup.add("salt");
                 *     soup.contents; // will contain: water, onions, salt
                 *
                 * @param {Object} object The target object
                 * @param {String} methodName Name of the method to override
                 * @param {Function} fn Function with the new behavior.  It will
                 * be called with the same arguments as the original method.  The
                 * return value of this function will be the return value of the
                 * new method.
                 * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
                 * @return {Function} The new function just created.
                 */
                interceptBefore: function(object, methodName, fn, scope) {

                    var method = object[methodName] || CLI.emptyFn;

                    return (object[methodName] = function() {

                        var ret = fn.apply(scope || this, arguments);

                        method.apply(this, arguments);

                        return ret;
                    });

                },

                // }}}
                // {{{ interceptAfter

                /**
                 * Adds behavior to an existing method that is executed after the
                 * original behavior of the function.  For example:
                 *
                 *     var soup = {
                 *         contents: [],
                 *         add: function(ingredient) {
                 *             this.contents.push(ingredient);
                 *         }
                 *     };
                 *     CLI.Function.interceptAfter(soup, "add", function(ingredient){
                 *         // Always add a bit of extra salt
                 *         this.contents.push("salt");
                 *     });
                 *     soup.add("water");
                 *     soup.add("onions");
                 *     soup.contents; // will contain: water, salt, onions, salt
                 *
                 * @param {Object} object The target object
                 * @param {String} methodName Name of the method to override
                 * @param {Function} fn Function with the new behavior.  It will
                 * be called with the same arguments as the original method.  The
                 * return value of this function will be the return value of the
                 * new method.
                 * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
                 * @return {Function} The new function just created.
                 */
                interceptAfter: function(object, methodName, fn, scope) {

                    var method = object[methodName] || CLI.emptyFn;

                    return (object[methodName] = function() {
                        method.apply(this, arguments);
                        return fn.apply(scope || this, arguments);
                    });
                },

                // }}}
                // {{{ makeCallback

                makeCallback: function (callback, scope) {

                    if (!scope[callback]) {

                        if (scope.$className) {
                            CLI.Error.raise('No method "' + callback + '" on ' + scope.$className);
                        }

                        CLI.Error.raise('No method "' + callback + '"');
                    }

                    return function () {

                        return scope[callback].apply(scope, arguments);

                    };

                }

                // }}}

            };

        // CLI.defer

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Function#defer
         */
        CLI.defer = CLIFunction.defer;

        // }}}
        // {{{ CLI.interval

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Function#interval
         */
        CLI.interval = CLIFunction.interval;

        // }}}
        // {{{ CLI.pass

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Function#pass
         */
        CLI.pass = CLIFunction.pass;

        // }}}
        // {{{ CLI.bind

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Function#bind
         */
        CLI.bind = CLIFunction.bind;

        // }}}

        return CLIFunction;

    })();

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
