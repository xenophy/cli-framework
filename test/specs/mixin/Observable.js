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
// {{{ sinon

var sinon = require('sinon');

// }}}
// {{{ require CLI

require('../../../index.js');

// }}}
// {{{ CLI.mixin.Observable

describe("CLI.mixin.Observable", function() {

    // {{{ unit tests

    describe("unit tests", function() {

        var dispatcher, foo, bar, baz, fooId, barId, fn, scope, options, order;

        //var Foo = CLI.define(null, {
        var Foo = CLI.define('CLITest.mixin.Observable-Foo', {
            extend: 'CLI.mixin.Observable',

            observableType: 'foo',

            getEventDispatcher: function() {
                return dispatcher;
            }
        });

        //var Bar = CLI.define(null, {
        var Bar = CLI.define('CLITest.mixin.Observable-Bar', {

            extend: 'CLI.mixin.Observable',

            observableType: 'bar',

            getEventDispatcher: function() {
                return dispatcher;
            }
        });

        //var Baz = CLI.define(null, {
        var Baz = CLI.define('CLITest.mixin.Observable-Baz', {
            extend: 'CLI.mixin.Observable',

            observableType: 'bar',

            getEventDispatcher: function() {
                return dispatcher;
            }
        });

        beforeEach(function() {

            dispatcher  = new CLI.event.Dispatcher();
            foo         = new Foo();
            bar         = new Bar();
            baz         = new Baz();
            fooId       = foo.getObservableId();
            barId       = bar.getObservableId();
            fn          = function() {};
            scope       = {};
            options     = {};
            order       = undefined;

        });

        afterEach(function() {

            foo.destroy();
            bar.destroy();
            baz.destroy();

        });

        // {{{ getObservableId()

        describe("getObservableId()", function() {

            it("should return the correct value", function() {

                assert.equal(foo.getObservableId(), '#' + foo.getId());

            });

        });

        // }}}
        // {{{ doAddListener()

        describe("doAddListener()", function() {

            it("should invoke dispatcher's addListener", function() {

                var spy = sinon.spy(dispatcher, 'addListener');

                foo.doAddListener('bar', fn, scope, options, order);

                assert.deepEqual(spy.lastCall.args, ['foo', fooId, 'bar', fn, scope, options, order, foo]);

                spy.restore();

            });

            it("should invoke dispatcher's addListener with scope 'this' if not given", function() {

                var spy = sinon.spy(dispatcher, 'addListener');

                foo.doAddListener('bar', fn, null, options, order);

                assert.deepEqual(spy.lastCall.args, ['foo', fooId, 'bar', fn, foo, options, order, foo]);

                spy.restore();

            });

        });

        // }}}
        // {{{ doRemoveListener()

        describe("doRemoveListener()", function() {

            it("should invoke dispatcher's removeListener", function() {

                var spy = sinon.spy(dispatcher, 'removeListener');

                foo.doRemoveListener('bar', fn, scope, options, order);

                assert.deepEqual(spy.lastCall.args, ['foo', fooId, 'bar', fn, scope, options, order, foo]);

                spy.restore();

            });

            it("should invoke dispatcher's removeListener with scope 'this' if not specified", function() {

                var spy = sinon.spy(dispatcher, 'removeListener');

                foo.doRemoveListener('bar', fn, null, options, order);

                assert.deepEqual(spy.lastCall.args, ['foo', fooId, 'bar', fn, foo, options, order, foo]);

                spy.restore();

            });

        });

        // }}}
        // {{{ addListener()

        describe("addListener()", function() {

            it("should invoke doAddListener", function() {

                var spy = sinon.spy(dispatcher, 'doAddListener');

                foo.addListener('bar', fn, scope, options, order);

                assert.equal(spy.calledWith('foo', fooId, 'bar', fn, scope, {type: 'bar'}, order), true);

                spy.restore();

            });

            it("should invoke doAddListener() multiple times for multiple listeners", function() {

                var one = sinon.spy(),
                    two = sinon.spy(),
                    scope = {};

                var spy = sinon.spy(foo, 'doAddListener');

                foo.addListener({
                    one: one,
                    two: two,
                    scope: scope,
                    single: true
                });

                var expectedOptions = {
                    scope: scope,
                    single: true,
                    type: "one"
                };

                assert.equal(spy.callCount, 2);

                assert.deepEqual(spy.args[0], ['one', one, scope, expectedOptions, order]);
                assert.deepEqual(spy.args[1], ['two', two, scope, expectedOptions, order]);

                spy.restore();

            });

            it("should allow different scopes for different listeners", function() {

                var one = sinon.spy(),
                    two = sinon.spy(),
                    scope1 = {},
                    scope2 = {},
                    listener1 = {
                        fn: one,
                        scope: scope1,
                        single: true
                    },
                    listener2 = {
                        fn: two,
                        scope: scope2,
                        delay: 100
                    };

                var spy = sinon.spy(foo, 'doAddListener');

                foo.addListener({
                    one: listener1,
                    two: listener2
                });

                assert.equal(spy.callCount, 2);
                assert.deepEqual(spy.args[0], ['one', one, scope1, listener1, order]);
                assert.deepEqual(spy.args[1], ['two', two, scope2, listener2, order]);

                spy.restore();

            });

            it("should not mutate the options object", function() {

                var fooOptions = {
                    foo: 'onFoo',
                    scope: 'this'
                },
                fooClone = CLI.clone(fooOptions);

                var Foo = CLI.define(null, {
                    extend: 'CLI.mixin.Observable',
                    listeners: fooOptions,
                    onFoo: function() {},
                    onBar: function() {},
                    onBaz: function() {}
                });

                var foo = new Foo(),
                    barOptions = {
                        bar: foo.onBar,
                        scope: foo
                    },
                    barClone = CLI.clone(barOptions),
                    bazOptions = {
                        isBaz: true
                    },
                    bazClone = CLI.clone(bazOptions);

                foo.on(barOptions);
                foo.on('baz', foo.onBaz, foo, bazOptions);

                foo.fireEvent('foo');
                foo.fireEvent('bar');
                foo.fireEvent('baz');

                assert.deepEqual(fooOptions, fooClone);
                assert.deepEqual(barOptions, barClone);
                assert.deepEqual(bazOptions, bazClone);
            });

        });

        // }}}
        // {{{ removeListener()

        describe("removeListener()", function() {

            it("should invoke doRemoveListener", function() {

                var spy = sinon.spy(foo, 'doRemoveListener');

                foo.removeListener('bar', fn, scope, options, order);

                assert.equal(spy.calledWith('bar', fn, scope, options, order), true);

                spy.restore();

            });

            it("should invoke doRemoveListener() multiple times for multiple listeners", function() {

                var one = sinon.spy(),
                    two = sinon.spy(),
                    scope = {};

                var spy = sinon.spy(foo, 'doRemoveListener');

                foo.removeListener({
                    one: one,
                    two: two,
                    scope: scope
                });

                var expectedOptions = {
                    scope: scope
                };

                assert.equal(spy.callCount, 2);
                assert.deepEqual(spy.args[0], ['one', one, scope, expectedOptions, order]);
                assert.deepEqual(spy.args[1], ['two', two, scope, expectedOptions, order]);

                spy.restore();

            });

        });

        // }}}
        // {{{ fireEvent()

        describe("fireEvent()", function() {

            it("should invoke dispatcher's dispatchEvent", function() {

                var args = ['testeventname', 'foo', 'bar'];

                var spy = sinon.spy(dispatcher, 'dispatchEvent');

                foo.fireEvent.apply(foo, args);

                assert.equal(spy.calledWith('foo', fooId, 'testeventname', ['foo', 'bar'], undefined, undefined), true);

                spy.restore();

            });
        });

        // }}}
        // {{{ clearListeners()

        describe("clearListeners()", function() {

            it("should invoke dispatcher's clearListeners()", function() {

                var spy = sinon.spy(dispatcher, 'clearListeners');

                foo.on('foo', fn);
                foo.clearListeners();

                assert.equal(spy.calledWith('foo', fooId, foo), true);

                spy.restore();

            });
        });

        // }}}
        // {{{ relayEvents

        describe("relayEvents", function() {

            it("should support string format", function() {

                var spy = sinon.spy(foo, 'doFireEvent');

                foo.relayEvents(bar, 'bar', 'foo');

                bar.fireEvent('bar');

                assert.equal(spy.called, true);
                assert.equal(spy.callCount, 1);
                assert.equal(spy.lastCall.args[0], 'foobar');
                assert.equal(spy.lastCall.thisValue, foo);

                spy.restore();

            });

            it("should support array format", function() {

                var spy = sinon.spy(foo, 'doFireEvent');

                foo.relayEvents(bar, ['bar', 'baz'], 'foo');

                bar.fireEvent('bar');
                bar.fireEvent('baz');

                assert.equal(spy.called, true);
                assert.equal(spy.callCount, 2);
                assert.equal(spy.firstCall.args[0], 'foobar');
                assert.equal(spy.firstCall.thisValue, foo);
                assert.equal(spy.lastCall.args[0], 'foobaz');
                assert.equal(spy.lastCall.thisValue, foo);

                spy.restore();

            });

            it("should support object format", function() {

                var spy = sinon.spy(foo, 'doFireEvent');

                foo.relayEvents(bar, {
                    bar: 'newbar',
                    baz: 'newbaz'
                }, 'foo');

                bar.fireEvent('bar');

                bar.fireEvent('baz');

                assert.equal(spy.called, true);
                assert.equal(spy.callCount, 2);
                assert.equal(spy.firstCall.args[0], 'foonewbar');
                assert.equal(spy.firstCall.thisValue, foo);
                assert.equal(spy.lastCall.args[0], 'foonewbaz');
                assert.equal(spy.lastCall.thisValue, foo);

                spy.restore();
            });

        });

        // }}}
        // {{{ suspend/resume events

        describe("suspend/resume events", function () {

            var employee,
                employeeFiredFn,
                employeeQuitFn,
                employeeAskFn,
                employeeFiredListener,
                employeeQuitListener,
                employeeAskListener,
                employeeListeners;

            function generateFireEventTraffic() {
                employee.fireEvent("fired", "I'm fired :s (1)");
                employee.fireEvent("fired", "I'm fired :s (2)");
                employee.fireEvent("quit", "I'm quitting my job :) (1)");
                employee.fireEvent("quit", "I'm quitting my job :) (2)");
            };

            beforeEach(function() {

                employeeFiredFn = sinon.spy();
                employeeQuitFn = sinon.spy();
                employeeAskFn = sinon.spy();

                employeeFiredListener = {
                    fn    : employeeFiredFn,
                    scope : fakeScope
                };

                employeeQuitListener = {
                    fn    : employeeQuitFn,
                    scope : fakeScope
                };

                employeeAskListener = {
                    fn    : employeeAskFn,
                    scope : fakeScope
                };

                employeeListeners = {
                    ask_salary_augmentation : employeeAskListener,
                    fired                   : employeeFiredListener,
                    quit                    : employeeQuitListener
                };

                employee = new CLI.mixin.Observable({
                    listeners : employeeListeners
                });

            });

            afterEach(function() {

                employee.destroy();
                employee = null;

            });

            // {{{ suspended events to be fired after resumeEvents

            describe("suspended events to be fired after resumeEvents", function() {

                beforeEach(function () {

                    employee.suspendEvents(true);
                    generateFireEventTraffic();

                });

                // {{{ when suspended

                describe("when suspended", function () {

                    it("should not call fired event handler", function () {
                        assert.equal(employeeFiredFn.called, false);
                    });

                    it("should not call quit event handler", function () {
                        assert.equal(employeeQuitFn.called, false);
                    });

                });

                // }}}
                // {{{ on resume

                describe("on resume", function () {

                    // {{{ without discarding

                    describe("without discarding", function() {

                        beforeEach(function() {
                            employee.resumeEvents();
                        });

                        it("should call fired event handler two times", function() {
                            assert.equal(employeeFiredFn.callCount, 2);
                        });

                        it("should call quit event handler two times", function() {
                            assert.equal(employeeQuitFn.callCount, 2);
                        });
                    });

                    // }}}
                    // {{{ with discarding

                    describe("with discarding", function() {

                        beforeEach(function() {
                            employee.resumeEvents(true);
                        });

                        it("should not call fired event handler", function() {
                            assert.equal(employeeFiredFn.called, false);
                        });

                        it("should call quit event handler two times", function() {
                            assert.equal(employeeQuitFn.called, false);
                        });

                    });

                    // }}}

                });

                // }}}

            });

            // }}}
            // {{{ discard suspended events

            describe("discard suspended events", function () {

                beforeEach(function () {
                    employee.suspendEvents();
                    generateFireEventTraffic();
                });

                // {{{ when suspended

                describe("when suspended", function () {

                    it("should not call fired event handler", function () {
                        assert.equal(employeeFiredFn.called, false);
                    });

                    it("should not call quit event handler", function () {
                        assert.equal(employeeQuitFn.called, false);
                    });

                });

                // }}}
                // {{{ on resume

                describe("on resume", function () {

                    beforeEach(function () {

                        //will discard the event queue
                        employee.resumeEvents(true);

                    });

                    it("should not call fired event handler", function () {
                        assert.equal(employeeFiredFn.called, false);
                    });

                    it("should not call quit event handler", function () {
                        assert.equal(employeeQuitFn.called, false);
                    });

                });

                // }}}

            });

            // }}}
            // {{{ multiple suspend/resume

            describe("multiple suspend/resume", function() {

                it("should not fire events if there are more suspend than resume calls", function() {

                    employee.suspendEvents();
                    employee.suspendEvents();
                    employee.resumeEvents();
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.called, false);
                    assert.equal(employeeQuitFn.called, false);
                });

                it("should fire events if the suspend/resume calls match", function() {

                    employee.suspendEvents();
                    employee.suspendEvents();
                    employee.suspendEvents();
                    employee.resumeEvents();
                    employee.resumeEvents();
                    employee.resumeEvents();
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.called, true);
                    assert.equal(employeeQuitFn.called, true);

                });

                it("should ignore extra resumeEvents calls", function() {

                    employee.suspendEvents();
                    employee.resumeEvents();
                    employee.resumeEvents();
                    employee.resumeEvents();
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.called, true);
                    assert.equal(employeeQuitFn.called, true);

                });

            });

            // }}}
            // {{{ specific events

            describe("specific events", function() {

                it("should be able to suspend a specific event", function() {

                    employee.suspendEvent('fired');
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.called, false);

                });

                it("should be able to suspend a specific event before anything is bound", function() {

                    var o = new CLI.mixin.Observable(),
                        called = false;

                    o.suspendEvent('foo');
                    o.on('foo', function() {
                        called = true;
                    });
                    o.fireEvent('foo', o);

                    assert.equal(called, false);

                });

                it("should begin firing events after resuming a specific event", function() {

                    employee.suspendEvent('fired');
                    generateFireEventTraffic();
                    employee.resumeEvent('fired');
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.callCount, 2);

                });

                it("should not resume firing if suspend is called more than resume", function() {

                    employee.suspendEvent('fired');
                    employee.suspendEvent('fired');
                    employee.resumeEvent('fired');
                    generateFireEventTraffic();

                    assert.equal(employeeFiredFn.called, false);

                });

            });

            // }}}
            // {{{ isSuspended

            describe("isSuspended", function() {

                // {{{ all events

                describe("all events", function() {

                    it("should return false if all events aren't suspended", function() {

                        assert.equal(employee.isSuspended(), false);

                    });

                    it("should return false after suspending and then resuming all events", function() {

                        employee.suspendEvents();
                        employee.resumeEvents();

                        assert.equal(employee.isSuspended(), false);

                    });

                    it("should return true when events are globally suspended", function() {

                        employee.suspendEvents();

                        assert.equal(employee.isSuspended(), true);

                    });

                });

                // }}}
                // {{{ specific event

                describe("specific event", function() {

                    it("should return false if the specific event is not suspended", function() {

                        assert.equal(employee.isSuspended('fired'), false);

                    });

                    it("should return false if the specific event is suspended then resumed", function() {

                        employee.suspendEvent('fired');
                        employee.resumeEvent('fired');

                        assert.equal(employee.isSuspended('fired'), false);

                    });

                    it("should return true if a specific event is suspended", function() {

                        employee.suspendEvent('fired');

                        assert.equal(employee.isSuspended('fired'), true);

                    });

                    it("should return true if all events are suspended and the specific event is not", function() {

                        employee.suspendEvents();

                        assert.equal(employee.isSuspended('fired'), true);

                    });

                });

                // }}}

            });

            // }}}

        });

        // }}}
        // {{{ listeners config

        describe("listeners config", function() {

            it("should be initialized before any fireEvent()", function() {

                var listenerFn = sinon.spy();
                var Boo = CLI.define(null, {
                    mixins: [CLI.mixin.Observable],

                    observableType: 'boo',

                    config: {
                        test: true,
                        listeners: {
                            boo: listenerFn
                        }
                    },

                    constructor: function(config) {
                        this.mixins.observable.constructor.call(this, config);
                    },

                    getEventDispatcher: function() {
                        this.getListeners();

                        return dispatcher;
                    },

                    updateTest: function() {
                        this.fireEvent('boo');
                    }
                });

                var boo = new Boo;

                assert.equal(listenerFn.called, true);

            });

        });

        // }}}
        // {{{ destroy()

        describe("destroy()", function() {

            it("should fire a 'destroy' event", function() {

                var spy = sinon.spy(foo, 'fireEvent');

                foo.destroy();

                assert.equal(spy.calledWith('destroy', foo), true);

                spy.restore();

            });

            it("should invoke both clearListeners() and clearManagedListeners()", function() {

                var clearListeners = sinon.spy(foo, 'clearListeners');
                var clearManagedListeners = sinon.spy(foo, 'clearManagedListeners');

                foo.destroy();

                assert.equal(clearListeners.called, true);
                assert.equal(clearManagedListeners.called, true);

                clearListeners.restore();
                clearManagedListeners.restore();

            });

            it("should remove all managed listeners from the other object", function() {

                var fn2 = function() {};

                var spy = sinon.spy(foo, 'doRemoveListener');

                foo.on('foo', fn, bar, options, order);
                foo.on('bar', fn2, bar, options, order);

                bar.destroy();

                assert.equal(spy.called, true);
                assert.equal(spy.callCount, 3);
                assert.equal(spy.args[0][0], 'destroy');
                assert.deepEqual(spy.args[1], ['foo', fn, bar, {}, order]);
                assert.deepEqual(spy.args[2], ['bar', fn2, bar, {}, order]);

                spy.restore();

            });

        });

        // }}}
        // {{{ resolveListenerScope

        describe("resolveListenerScope", function() {

            beforeEach(function() {
                foo = new Foo();
            });

            it("should resolve to the observable instance by default", function() {

                assert.equal(foo.resolveListenerScope(), foo);

            });

            it("should resolve to an object if passed", function() {

                var scope = {};

                assert.equal(foo.resolveListenerScope(scope), scope);

            });

            it("should resolve to the observable instance if 'this' is passed", function() {

                assert.equal(foo.resolveListenerScope('this'), foo);

            });

            it("should throw an error if 'controller' is passed", function() {

                beginSilent();

                assert.throws(function() {
                    foo.resolveListenerScope('controller');
                });

                endSilent();

            });

        });

        // }}}

    });

    // }}}
    // {{{ event name normalization

    describe("event name normalization", function() {

        var spy, o;

        beforeEach(function() {
            spy = sinon.spy();
            o = new CLI.mixin.Observable();
        });

        // {{{ firing

        describe("firing", function() {

            it("should match when firing with lower case", function() {

                o.on('FOO', spy);
                o.fireEvent('foo');

                assert.equal(spy.called, true);

            });

            it("should match when firing with mixed case", function() {

                o.on('foo', spy);
                o.fireEvent('FOO');

                assert.equal(spy.called, true);

            });

        });

        // }}}
        // {{{ removing

        describe("removing", function() {

            it("should match when removing with lower case", function() {

                o.on('FOO', spy);
                o.un('foo', spy);
                o.fireEvent('foo');

                assert.equal(spy.called, false);

            });

            it("should match when removing with mixed case", function() {

                o.on('foo', spy);
                o.un('FOO', spy);
                o.fireEvent('FOO');

                assert.equal(spy.called, false);

            });

        });

        // }}}
        // {{{ hasListener(s)

        describe("hasListener(s)", function() {

            it("should use lower case for hasListeners", function() {

                o.on('FOO', spy);

                assert.equal(o.hasListeners.foo, 1);

            });

            it("should use lower case for hasListener", function() {

                o.on('FOO', spy);

                assert.equal(o.hasListener('foo'), true);

            });

        });

        // }}}
        // {{{ suspend/resume

        describe("suspend/resume", function() {

            it("should ignore case when asking if an event is suspended", function() {

                o.suspendEvent('FOO');

                assert.equal(o.isSuspended('foo'), true);

            });

            it("should ignore case when resuming events", function() {

                o.on('foo', spy);
                o.suspendEvent('FOO');
                o.fireEvent('foo');

                assert.equal(spy.called, false);

                o.resumeEvent('foo');
                o.fireEvent('foo');

                assert.equal(spy.called, true);

            });

        });

    });

    // {{{ hasListeners

    describe("hasListeners", function() {

        var dispatcher;

        beforeEach(function() {

            CLI.define('spec.Foo', {
                extend: 'CLI.mixin.Observable',
                observableType: 'foo'
            });

            CLI.define('spec.Bar', {
                extend: 'CLI.mixin.Observable',
                observableType: 'foo'
            });

            dispatcher = CLI.event.Dispatcher.getInstance();

            delete dispatcher.hasListeners.foo;
            delete dispatcher.hasListeners.bar;

        });

        afterEach(function() {

            CLI.undefine('spec.Foo');
            CLI.undefine('spec.Bar');
            CLI.undefine('spec.Baz');

            delete dispatcher.hasListeners.foo;
            delete dispatcher.hasListeners.bar;

        });

        it("should add the observableType to the dispatcher's hasListeners object when the first instance of a given observableType is created", function() {

            var hasListeners = dispatcher.hasListeners;

            assert.equal('foo' in hasListeners, false);

            new spec.Foo();

            assert.equal(typeof hasListeners.foo, 'object');

        });

        it("should chain the prototype of the observable instance's hasListeners object to the dispatchers hasListeners object for the given observableType", function() {

            var hasListeners = dispatcher.hasListeners,
                foo = new spec.Foo();

            hasListeners.foo.someEvent = 5;

            assert.equal(foo.hasListeners.someEvent, 5);

        });

        it("should not add the observableType to the dispatcher's hasListeners if it already exists", function() {

            var hasListeners = dispatcher.hasListeners,
                fooListeners;

            new spec.Foo();
            fooListeners = hasListeners.foo;
            new spec.Bar();  // another observable with observableType == 'foo'

            assert.equal(hasListeners.foo, fooListeners);

        });

        it("should increment or decrement the dispatcher's hasListeners when the dispatcher's addListener/removeListener is called with no observable refrence", function() {

            // MVC controllers do this.  unfortunately there's no way to increment the
            // observable's hasListeners, since all we have is a selector, so the best we
            // can do is increment the global hasListeners for the given observableType
            // i.e. we know there is someone of the given type listening, we just don't
            // know who.
            function handler() {};
            function handler2() {};

            dispatcher.addListener('foo', '#bar', 'click', handler);
            assert.equal(dispatcher.hasListeners.foo.click, 1);

            dispatcher.addListener('foo', '#bar', 'click', handler2);
            assert.equal(dispatcher.hasListeners.foo.click, 2);

            dispatcher.removeListener('foo', '#bar', 'click', handler);
            assert.equal(dispatcher.hasListeners.foo.click, 1);

            dispatcher.removeListener('foo', '#bar', 'click', handler2);
            assert.equal('click' in dispatcher.hasListeners.foo, false);

        });

        it("should increment or decrement the observable's hasListeners when the observable's addListener/removeListener is called", function() {

            // MVC controllers do this.  unfortunately there's no way to increment the
            // observable's hasListeners, since all we have is a selector, so the best we
            // can do is increment the global hasListeners for the given observableType
            // i.e. we know there is someone of the given type listening, we just don't
            // know who.

            var foo = new spec.Foo();

            function handler() {}
            function handler2() {}

            assert.equal(foo.hasListeners.hasOwnProperty('click'), false);
            foo.addListener('click', handler);

            assert.equal(foo.hasListeners.hasOwnProperty('click'), true);
            assert.equal(foo.hasListeners.click, 1);

            foo.addListener('click', handler2);
            assert.equal(foo.hasListeners.click, 2);

            foo.removeListener('click', handler);
            assert.equal(foo.hasListeners.click, 1);

            foo.removeListener('click', handler2);
            assert.equal(foo.hasListeners.hasOwnProperty('click'), false);

        });

        it("should delete all properties from the observable's hasListeners object when clearListeners is called", function() {

            var foo = new spec.Foo();

            foo.addListener('refresh', function() {});
            foo.addListener('refresh', function() {});
            foo.addListener('update', function() {});

            foo.clearListeners();

            assert.equal(foo.hasListeners.hasOwnProperty('refresh'), false);
            assert.equal(foo.hasListeners.hasOwnProperty('update'), false);
        });

        it("should remove properties from the dispatcher's hasListeners object for the given observableType when the dispatcher's clearListeners() is called without an observable reference", function() {

            dispatcher.addListener('foo', '#bar', 'refresh', function() {});
            dispatcher.addListener('foo', '#bar', 'update', function() {});
            dispatcher.addListener('foo', '#baz', 'refresh', function() {});

            dispatcher.clearListeners('foo', '#bar');

            assert.equal('update' in dispatcher.hasListeners.foo, false);
            assert.equal(dispatcher.hasListeners.foo.refresh, 1);

        });

        it('should only decrement hasListeners when a listener is actually removed', function() {

            var foo = new spec.Foo(),
                event1Counter = 0;

            foo.addListener('event1', function() {
                event1Counter++;
            });
            foo.fireEvent('event1');

            assert.equal(event1Counter, 1);

            // Attempt to remove a nonexistent listener. Sohuld not disturb the listener stack or the hasListeners counter
            foo.removeListener('event1', CLI.emptyFn);

            foo.fireEvent('event1');

            // Second firing of the event should work, and hasListeners should still be 1
            assert.equal(event1Counter, 2);
            assert.equal(foo.hasListeners.event1, 1);

        });

    });

    // {{{ scope: this

    describe("scope: this", function() {

        var Cls;

        beforeEach(function() {

            Cls = CLI.define(null, {
                mixins: ['CLI.mixin.Observable'],

                constructor: function() {
                    this.mixins.observable.constructor.call(this);
                },

                method1: function() {},
                method2: function() {}
            });

        });

        it("should fire on the observable", function() {

            var o = new Cls();

            var spy = sinon.spy(o, 'method1');

            o.on('custom', 'method1', 'this');
            o.fireEvent('custom');

            assert.equal(spy.called, true);
            assert.equal(getMostRecentCall(spy).thisValue, o);

        });

        it("should remove the listener", function() {

            var o = new Cls();

            var spy = sinon.spy(o, 'method1');

            o.on('custom', 'method1', 'this');
            o.un('custom', 'method1', 'this');
            o.fireEvent('custom');

            assert.equal(spy.called, false);

        });

    });

    // }}}
    // {{{ scope: controller

    describe("scope: controller", function() {

        var Cls;

        beforeEach(function() {

            Cls = CLI.define(null, {
                mixins: ['CLI.mixin.Observable'],

                constructor: function() {
                    this.mixins.observable.constructor.call(this);
                },

                method1: function() {},
                method2: function() {}
            });

        });

        it("should not resolve the scope", function() {

            // Observables can't have controllers
            var o = new Cls();

            var spy = sinon.spy(o, 'method1');

            o.on('custom', 'method1', 'controller');

            beginSilent();

            assert.throws(function() {
                o.fireEvent('custom');
            });

            endSilent();

        });

    });

    // }}}
    // {{{ declarative listeners

    describe("declarative listeners", function() {

        var ParentMixin, ChildMixin, ParentClass, ChildClass,
            result = [];

        beforeEach(function() {

            ParentMixin = CLI.define(null, {
                mixins: [ CLI.mixin.Observable ],
                type: 'ParentMixin',
                listeners: {
                    foo: 'parentMixinHandler',
                    scope: 'this'
                },
                constructor: function(config) {
                    this.mixins.observable.constructor.call(this, config);
                },

                parentMixinHandler: function() {
                    result.push('parentMixin:' + this.id);
                }
            });

            ChildMixin = CLI.define(null, {
                extend: ParentMixin,
                mixinId: 'childMixin',
                type: 'ChildMixin',
                listeners: {
                    foo: 'childMixinHandler',
                    scope: 'this'
                },

                childMixinHandler: function() {
                    result.push('childMixin:' + this.id);
                }
            });

            ParentClass = CLI.define(null, {
                mixins: [ ChildMixin ],
                type: 'ParentClass',
                listeners: {
                    foo: 'parentClassHandler',
                    scope: 'this'
                },

                constructor: function(config) {
                    this.mixins.childMixin.constructor.call(this, config);
                },

                parentClassHandler: function() {
                    result.push('parentClass:' + this.id);
                }
            });

            ChildClass = CLI.define(null, {
                extend: ParentClass,
                type: 'ChildClass',
                listeners: {
                    foo: 'childClassHandler',
                    scope: 'this'
                },

                childClassHandler: function() {
                    result.push('childClass:' + this.id);
                }
            });

        });

        it("should call all the listeners", function() {

            var instance = new ChildClass({
                listeners: {
                    foo: function() {
                        result.push('childInstance:' + this.id);
                    }
                }
            });

            instance.id = 'theId';
            instance.fireEvent('foo');

            assert.deepEqual(result, [
                'parentMixin:theId',
                'childMixin:theId',
                'parentClass:theId',
                'childClass:theId',
                'childInstance:theId'
            ]);

        });

        it("should not call addListener if extending and no listeners are declared", function() {

            var spy = sinon.spy();

            var Cls = CLI.define(null, {
                extend: 'CLI.mixin.Observable',
                constructor: function(config) {
                    this.callParent(arguments);
                },

                addListener: spy
            });
            new Cls();

            assert.equal(spy.called, false);

        });

        it("should not call addListener if mixing in and no listeners are declared", function() {

            var spy = sinon.spy();

            var Cls = CLI.define(null, {
                mixins: [
                    'CLI.mixin.Observable'
                ],

                constructor: function(config) {
                    this.mixins.observable.constructor.apply(this, arguments);
                },

                addListener: spy
            });

            new Cls();

            assert.equal(spy.called, false);

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
