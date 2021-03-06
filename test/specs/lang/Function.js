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
// {{{ sinon

var sinon = require('sinon');

// }}}
// {{{ CLI.Function

describe("CLI.Function", function() {

    var _setTimeout,
        _clearTimeout,
        timeouts,
        timeoutIds,
        clearedTimeoutIds,
        runAfterInvocation = function(spyedFunction, callback, invocationCount) {

            invocationCount = invocationCount || 1;

            var timer = setInterval(function() {

                if (spyedFunction.callCount == invocationCount) {

                    clearInterval(timer);

                    callback();
                }

            }, 1);

        },
        mockTimeout = function() {

            timeouts = [];
            timeoutIds = [];
            clearedTimeoutIds = [];

            _setTimeout = global.setTimeout;

            global.setTimeout = function(fn, timeout) {

                timeouts.push(timeout);
                var timeoutId = _setTimeout.apply(this, arguments);
                timeoutIds.push(timeoutId);
                return timeoutId;
            };

            _clearTimeout = global.clearTimeout;

            global.clearTimeout = function(timeoutId) {
                clearedTimeoutIds.push(timeoutId);
                _clearTimeout.apply(this, arguments);
            };

        },
        unmockTimeout = function() {

            timeouts = undefined;
            timeoutIds = undefined;
            clearedTimeoutIds = undefined;
            global.setTimeout = _setTimeout;
            global.clearTimeout = _clearTimeout;

        };

    // {{{ flexSetter

    describe("flexSetter", function() {

        it("should return function if a function is passed object values can set", function() {

            var cnt = 1;
            var f = CLI.Function.flexSetter(function(key, v) {
                assert.equal(key, 'key' + cnt);
                assert.equal(v, 'v' + cnt);
                cnt++;
            });

            var o = {key1: 'v1', key2: 'v2'};

            f(o);

        });

        it('should set null', function() {

            var ret = false;
            var f = CLI.Function.flexSetter(function(key, v) {
                ret = true;
            });

            f(null);

            assert.equal(ret, false);
        });

        it('should set primitive values', function() {

            var ret = '';
            var f = CLI.Function.flexSetter(function(key, v) {
                ret = key + ':' + v;
            });

            f('hoge', 'foo');

            assert.equal(ret, 'hoge:foo');
        });

    });

    // }}}
    // {{{ bind

    describe("bind", function() {

        var fn,
            bind;

        beforeEach(function() {
            fn = sinon.spy();
        });

        it("should return a function if a function is passed as first argument", function() {

            bind = CLI.Function.bind(fn, this);

            assert.equal(typeof bind === "function", true);
        });

        it("should use the correct scope", function() {

            bind = CLI.Function.bind(fn, fakeScope);

            bind();

            assert.equal(fn.lastCall.thisValue, fakeScope);

        });

        it("should call the first function when it is executed", function() {

            bind = CLI.Function.bind(fn, this);

            bind();

            assert.equal(fn.called, true);
        });

        // {{{ argument passing

        describe("argument passing", function() {

            it("should use default args if none are passed", function() {

                bind = CLI.Function.bind(fn, this, ['a', 'b']);

                bind();

                assert.deepEqual(fn.lastCall.args, ['a', 'b']);

            });

            it("should use passed args if they are present", function() {

                bind = CLI.Function.bind(fn, this);

                bind('c', 'd');

                assert.deepEqual(fn.lastCall.args, ['c', 'd']);
            });

            it("should append args", function() {
                bind = CLI.Function.bind(fn, this, ['a', 'b'], true);

                bind('c', 'd');

                assert.deepEqual(fn.lastCall.args, ['c', 'd', 'a', 'b']);
            });

            it("should append args at the given index", function() {

                bind = CLI.Function.bind(fn, this, ['a', 'b'], 0);

                bind('c', 'd');

                assert.deepEqual(fn.lastCall.args, ['a', 'b', 'c', 'd']);

            });

        });

        // }}}

    });

    // }}}
    // {{{ bindCallback

    describe("bindCallback", function() {

        var scope = {
            myFunc: function(arg1, arg2) {
                return [arg1, arg2];
            }
        };

        var myFunc = scope.myFunc;
        var bindCb = CLI.Function.bindCallback('myFunc', scope, ['foo', 'bar']);

        assert.equal(CLI.isFunction(scope.myFunc), true);
        assert.deepEqual(bindCb(), {
            0: 'foo',
            1: 'bar'
        });
        assert.notEqual(scope.myFunc, bindCb);
    });

    // }}}
    // {{{ pass

    describe("pass", function() {

        it("should pass the specified array of arguments as the first arguments to the given function", function() {
            var fn = sinon.spy(),
                args = [0, 1, 2],
                callback = CLI.Function.pass(fn, args);

            callback(3, 4, 5);

            assert.deepEqual(fn.lastCall.args, [0, 1, 2, 3, 4, 5]);

        });

        it("should pass the specified string argument as the first argument to the given function", function() {
            var fn = sinon.spy(),
                args = 'a',
                callback = CLI.Function.pass(fn, args);

            callback('b', 'c');

            assert.deepEqual(fn.lastCall.args, ['a', 'b', 'c']);

        });

        it("should pass the specified numeric argument as the first argument to the given function", function() {
            var fn = sinon.spy(),
                args = 0,
                callback = CLI.Function.pass(fn, args);

            callback(1);

            assert.deepEqual(fn.lastCall.args, [0, 1]);

        });

        it("should pass the specified 'arguments' argument as the first argument to the given funciton", function() {
            var testFunction = function () {

                var fn = sinon.spy(),
                    args = arguments,
                    callback = CLI.Function.pass(fn, args);

                callback(3, 4, 5);
                assert.deepEqual(fn.lastCall.args, [0, 1, 2, 3, 4, 5]);
            };

            testFunction(0, 1, 2);
        });

        it("should discard the argument if it's undefined", function() {

            var fn = sinon.spy(),
                args = undefined,
                callback = CLI.Function.pass(fn, args);

            callback(1);

            assert.deepEqual(fn.lastCall.args, [1]);
        });

        it("should use 'this' as default scope", function() {

           var foo = 'a',
               fn = sinon.spy({
                   hoge: function() {
                       foo = this.foo;
                   }
               }, 'hoge'),
               callback = CLI.Function.pass(fn, 'c');

           callback('d');

           assert.deepEqual(fn.lastCall.args, ['c', 'd']);
           assert.equal(foo, undefined);

        });

        it("should override 'this' with the specified scope", function() {

            var foo = 'a',
                scope = { foo: 'b' },
                fn = sinon.spy({
                    hoge: function() {
                        foo = this.foo;
                    }
                }, 'hoge'),
                callback = CLI.Function.pass(fn, 'c', scope);

            callback('d');

            assert.deepEqual(fn.lastCall.args, ['c', 'd']);
            assert.equal(foo, 'b');

        });

    });

    // }}}
    // {{{ clone

    describe("clone", function() {

        it("should clone the given function", function() {

            var fn = sinon.spy({
                    hoge: function(arg) {
                        return 'bar';
                    }
                }, 'hoge'),
                clonedFn = CLI.Function.clone(fn),
                result = clonedFn('foo');

            assert.equal(result, 'bar');
            assert.deepEqual(fn.lastCall.args, ['foo']);
        });

    });

    // }}}
    // {{{ createInterceptor

    describe("createInterceptor", function() {

        var interceptor,
            interceptorFn,
            interceptedFn,
            interceptorIsRunFirst,
            interceptedIsRunAfter;

        beforeEach(function() {

            interceptorIsRunFirst = false;
            interceptedIsRunAfter = false;

            interceptorFn = sinon.spy({
                fake: function() {
                    interceptorIsRunFirst = true;
                }
            }, 'fake');

            interceptedFn = sinon.spy({
                fake: function() {
                    interceptedIsRunAfter = interceptorIsRunFirst;
                }
            }, 'fake');

        });

        // {{{ if no function is passed

        describe("if no function is passed", function() {

            it("should return the same function", function() {

                assert.equal(CLI.Function.createInterceptor(interceptedFn), interceptedFn);

            });

        });

        // }}}
        // {{{ if a function is passed

        describe("if a function is passed", function() {

            beforeEach(function() {
                interceptor = CLI.Function.createInterceptor(interceptedFn, interceptorFn, fakeScope);
                interceptor();
            });

            it("should return a new function", function() {

                assert.equal(typeof interceptor === "function", true);
                assert.notEqual(interceptor, interceptedFn);

            });

            it("should set the correct scope for the interceptor function", function() {

                assert.equal(interceptorFn.lastCall.thisValue, fakeScope);

            });

            it("should call the interceptor function first", function() {

                assert.equal(interceptedIsRunAfter, true);

            });

        });

        // }}}
        // {{{ if the interceptor function returns false

        describe("if the interceptor function returns false", function() {

            it("should not execute the original function", function() {

                interceptor = CLI.Function.createInterceptor(interceptedFn, function() {
                    return false;
                });

                interceptor();

                assert.equal(interceptedFn.called, false);

            });

        });

        // }}}
        // {{{ returnValue

        describe("returnValue", function() {

            beforeEach(function() {

                interceptedFn = function() {
                    return 'Original';
                };

                interceptorFn = function() {
                    return false;
                };

            });

            // {{{ when interceptorFn returns false

            describe("when interceptorFn returns false", function() {

                it("should return null as a default", function() {

                    interceptor = CLI.Function.createInterceptor(interceptedFn, interceptorFn);

                    assert.equal(interceptor(), null);

                });

                it("should accept a custom returnValue", function() {

                    interceptor = CLI.Function.createInterceptor(interceptedFn, interceptorFn, null, 'Custom');
                    assert.equal(interceptor(), 'Custom');

                });

                it("should accept a falsy returnValue", function() {

                    interceptor = CLI.Function.createInterceptor(interceptedFn, interceptorFn, null, false);

                    assert.equal(interceptor(), false);

                });

            });

            // }}}

            it("should return the value of the original function if false is not returned", function() {

                interceptorFn = function() {
                    return;
                };

                interceptor = CLI.Function.createInterceptor(interceptedFn, interceptorFn);

                assert.equal(interceptor(), 'Original');

            });

        });

    });

    // }}}
    // {{{ createDelayed

    describe("createDelayed", function() {

        it("should create bind to the given function to be called after x milliseconds", function(done) {

            mockTimeout();

            var fn = sinon.spy(),
                delayedFn = CLI.Function.createDelayed(fn, 2);

            delayedFn('foo');

            assert.equal(timeouts.shift(), 2);
            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.deepEqual(fn.lastCall.args, ['foo']);
                unmockTimeout();
                done();
            });

        });

        it("should use the specified scope as 'this'", function(done) {

            var scope = { x: 'foo' },
                fn = sinon.spy({
                    fake: function() {
                        this.x = 'bar';
                    }
                }, 'fake'),
                delayedFn = CLI.Function.createDelayed(fn, 2, scope);

            delayedFn();

            assert.equal(fn.called, false);
            assert.equal(scope.x, 'foo');

            runAfterInvocation(fn, function() {
                assert.equal(scope.x, 'bar');
                done();
            });

        });

        it("should override the call arguments with the specified arguments", function(done) {

            var scope = {},
                args = [0, 1, 2],
                fn = sinon.spy(),
                delayedFn = CLI.Function.createDelayed(fn, 2, scope, args);
                delayedFn(3, 4, 5);

            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.deepEqual(fn.lastCall.args, [0, 1, 2]);
                done();
            });

        });

        it("should append the specified arguments to the call arguments when appendArgs is true", function(done) {
            var scope = {},
                args = [0, 1, 2],
                fn = sinon.spy(),
                delayedFn = CLI.Function.createDelayed(fn, 2, scope, args, true);

            delayedFn(3, 4, 5);

            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.deepEqual(fn.lastCall.args, [3, 4, 5, 0, 1, 2]);
                done();
            });

        });

        it("should insert the specified arguments into the call arguments at the position specified by appendArgs", function(done) {

            var scope = {},
                args = [0, 1, 2],
                fn = sinon.spy(),
                delayedFn = CLI.Function.createDelayed(fn, 2, scope, args, 2);
                delayedFn(3, 4, 5);

            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.deepEqual(fn.lastCall.args, [3, 4, 0, 1, 2, 5]);
                done();
            });

        });

    });

    // }}}
    // {{{ defer

    describe("defer", function() {

        var fn;

        beforeEach(function() {
            fn = sinon.spy();
        });

        it("should execute the function after the specified number of milliseconds", function(done) {

            CLI.defer(fn, 10);

            waitsFor(function() {

                return fn.callCount === 1;

            }, function() {

                assert.equal(fn.called, true);
                done();

            });

        });

        it("should execute the function directly if the specified number of milliseconds is <= 0", function() {
            CLI.defer(fn, 0);

            assert.equal(fn.called, true);
        });

        it("should set the correct scope", function(done) {

            CLI.defer(fn, 10, fakeScope);

            waitsFor(function() {

                return fn.callCount === 1;

            }, function() {

                assert.equal(fn.lastCall.thisValue, fakeScope);
                done();

            });

        });

        it("should pass the correct arguments", function(done) {

            CLI.defer(fn, 10, this, [1, 2, 3]);

            waitsFor(function() {

                return fn.callCount === 1;

            }, function() {

                assert.deepEqual(fn.lastCall.args, [1, 2, 3]);

                done();

            });

        });

        it("should return a timeout number", function() {
            assert.equal(typeof CLI.defer(function() {}, 10) === 'object', true);
        });

    });

    // }}}
    // {{{ interval

    describe("interval", function() {

        // function(fn, millis, scope, args, appendArgs) {

        it("should execute as interval function", function(done) {

            var fn = sinon.spy();
            var timer = CLI.Function.interval(fn, 10, fakeScope, ['hoge', 'foo', 'piyo']);

            var start = CLI.now();

            runAfterInvocation(fn, function() {

                assert.equal(fn.callCount, 5);
                assert.equal((CLI.now() - start) >= 50,  true);

                done();

            }, 5);

        });

    });

    // }}}
    // {{{ createSequence

    describe("createSequence", function() {

        var sequence,
            newFn,
            origFn,
            origFnIsRunFirst,
            newFnIsRunAfter;

        beforeEach(function() {

            origFnIsRunFirst = false;
            newFnIsRunAfter = false;

            origFn = sinon.spy({
                fake: function() {
                    origFnIsRunFirst = true;
                }
            }, 'fake');

            newFn = sinon.spy({
                fake: function() {
                    newFnIsRunAfter = origFnIsRunFirst;
                }
            }, 'fake');

        });

        // {{{ if no function is passed

        describe("if no function is passed", function() {
            it("should return the same function", function() {
                assert.equal(CLI.Function.createSequence(origFn), origFn);
            });
        });

        // }}}
        // {{{ if a function is passed

        describe("if a function is passed", function() {
            beforeEach(function() {
                sequence = CLI.Function.createSequence(origFn, newFn, fakeScope);
                sequence();
            });

            it("should return a new function", function() {
                assert.equal(typeof sequence === "function", true);
                assert.notEqual(sequence, origFn);
            });

            it("should set the correct scope for the sequence function", function() {
                assert.equal(newFn.firstCall.thisValue, fakeScope);
            });

            it("should call the sequence function first", function() {
                assert.equal(newFnIsRunAfter, true);
            });

        });

        // }}}

    });

    // }}}
    // {{{ createBuffered

    describe("createBuffered", function() {

        it("should prevent the execution of multiple calls of the buffered function within the timeout period", function(done) {

            mockTimeout();

            var fn = sinon.spy(),
                bufferedFn = CLI.Function.createBuffered(fn, 2);

            bufferedFn();

            assert.equal(timeouts.shift(), 2);

            bufferedFn();

            assert.equal(clearedTimeoutIds.shift(), timeoutIds.shift());
            assert.equal(timeouts.shift(), 2);

            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.equal(fn.callCount, 1);
                unmockTimeout();
                done();
            });

        });

        it("should use the specified scope as 'this'", function(done) {

            var scope = { x: 1 },
                fn = sinon.spy({
                    fake: function() {
                        this.x++;
                    }
                }, 'fake'),
                bufferedFn = CLI.Function.createBuffered(fn, 20, scope);

            bufferedFn();

            assert.equal(scope.x, 1);

            bufferedFn();

            runAfterInvocation(fn, function() {
                assert.equal(scope.x, 2);
                done();
            });

        });

        it("should override the call arguments with the specified ones", function(done) {

            var scope = {},
                args = ['bar1', 'bar2'],
                fn = sinon.spy(),
                bufferedFn = CLI.Function.createBuffered(fn, 20, scope, args);

            bufferedFn('foo1', 'foo2');

            assert.equal(fn.called, false);

            runAfterInvocation(fn, function() {
                assert.deepEqual(fn.lastCall.args, ['bar1', 'bar2']);
                done();
            });
        });

    });

    // }}}
    // {{{ createThrottled

    describe("createThrottled", function() {

        it("should execute only once per each specified time interval", function(done) {

            mockTimeout();

            var fn = sinon.spy(),
                throttledFn = CLI.Function.createThrottled(fn, 10);

            assert.equal(fn.called, false);

            throttledFn();

            assert.equal(clearedTimeoutIds.shift(), undefined);
            assert.equal(fn.callCount, 1);

            throttledFn();

            assert.equal(timeouts.shift() <= 10, true);
            assert.equal(clearedTimeoutIds.shift(), undefined);

            throttledFn();

            assert.equal(fn.callCount, 1);

            runAfterInvocation(fn, function() {

                assert.equal(fn.callCount, 2);
                throttledFn(); // elapsed may have been exceeded here, so this call may execute immediately

                assert.equal(fn.callCount <= 2, true);
                assert.equal(fn.callCount >= 3, false);

                unmockTimeout();
                done();

            }, 2);

        });

        it("should use the specified scope as 'this'", function() {

            var scope = {},
                fn = sinon.spy({
                    fake: function(value) {
                        this.x = value;
                    }
                }, 'fake'),
                throttledFn = CLI.Function.createThrottled(fn, 10, scope);

            throttledFn('foo');
            throttledFn('bar');
            throttledFn('baz');
            throttledFn('qux');

            assert.deepEqual(fn.lastCall.args, ['foo']);
            assert.equal(scope.x, 'foo');
            assert.equal(fn.callCount, 1);
        });

    });

    // }}}
    // {{{ createBarrier

    describe("createBarrier", function() {

        it("should execute only therd call", function() {

            var fn = sinon.spy(),
                barrierFn = CLI.Function.createBarrier(3, fn, fakeScope);

            barrierFn();

            assert.equal(fn.callCount, 0);

            barrierFn();

            assert.equal(fn.callCount, 0);

            barrierFn();

            assert.equal(fn.callCount, 1);
            assert.equal(fn.lastCall.thisValue, fakeScope);

            barrierFn();

            assert.equal(fn.callCount, 1);
            assert.equal(fn.lastCall.thisValue, fakeScope);

            barrierFn();

            assert.equal(fn.callCount, 1);
            assert.equal(fn.lastCall.thisValue, fakeScope);

        });

    });

    // }}}
    // {{{ interceptBefore

    describe("interceptBefore", function() {

        it("should execute interceptor before each method call", function() {

            var soup = {
                contents: [],
                add: function(ingredient) {
                    this.contents.push(ingredient);
                }
            };

            CLI.Function.interceptBefore(soup, "add", function(ingredient) {
                if (!this.contents.length && ingredient !== "water") {
                    this.contents.push("water");
                }
            });

            soup.add("onions");
            soup.add("salt");

            assert.deepEqual(soup.contents, ['water', 'onions', 'salt']);

        });

    });

    // }}}
    // {{{ interceptAfter

    describe("interceptAfter", function() {

        it("should execute interceptor after each method call", function() {

            var monologue = {
                    phrases: [],
                    addPhrase: function(phrase) {
                        this.phrases.push(phrase)
                    }
                },
                addMeToo = sinon.spy({
                    fake: function(phrase) {
                        this.phrases.push(phrase + ' too');
                    }
                }, 'fake');

            CLI.Function.interceptAfter(monologue, 'addPhrase', addMeToo);

            monologue.addPhrase('I like you');
            monologue.addPhrase('I love you');

            assert.deepEqual(monologue.phrases, ['I like you', 'I like you too', 'I love you', 'I love you too']);
            assert.deepEqual(addMeToo.firstCall.args, ['I like you']);
            assert.deepEqual(addMeToo.secondCall.args, ['I love you']);
        });

        it("should execute interceptor after each method call with the specified scope as 'this'", function() {

            var monologue = {
                    phrases: [],
                    addPhrase: function(phrase) {
                        this.phrases.push(phrase)
                    }
                },
                transcription = {
                    phrases: []
                },
                transcriptPhrase = sinon.spy({
                    fake: function(phrase) {
                        this.phrases.push("He said: " + phrase);
                    }
                }, 'fake');

            CLI.Function.interceptAfter(monologue, 'addPhrase', transcriptPhrase, transcription);

            monologue.addPhrase('I like you');
            monologue.addPhrase('I love you');

            assert.deepEqual(monologue.phrases, ['I like you', 'I love you']);
            assert.deepEqual(transcription.phrases, ['He said: I like you', 'He said: I love you']);
            assert.deepEqual(transcriptPhrase.firstCall.args, ['I like you']);
            assert.deepEqual(transcriptPhrase.secondCall.args, ['I love you']);
        });

    });

    // }}}
    // {{{ makeCallback

    describe("makeCallback", function() {

        it("should not create no method", function() {

            var cls = CLI.define('Test.Function.makeCallback', {
                foo: function() {
                }
            });

            beginSilent();

            assert.throws(function() {
                CLI.Function.makeCallback('hoge', new cls);
            });

            endSilent();

        });

        it("should not create no method", function() {

            beginSilent();

            assert.throws(function() {
                CLI.Function.makeCallback('hoge', {});
            });

            endSilent();

        });

        it("should execute callback method", function() {

            beginSilent();

            var cls = CLI.define('Test.Function.makeCallback', {
                hoge: function() {
                    return 123;
                }
            });

            var cb = CLI.Function.makeCallback('hoge', new cls);

            assert.equal(cb(), 123);

            endSilent();

        });

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
