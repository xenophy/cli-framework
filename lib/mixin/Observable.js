/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * Mixin that provides a common interface for publishing events. Classes using this mixin can use the {@link #fireEvent}
 * and {@link #fireAction} methods to notify listeners of events on the class.
 *
 * Classes can also define a {@link #listeners} config to add an event handler to the current object. See
 * {@link #addListener} for more details.
 *
 * ## Example
 *
 *     CLI.define('Employee', {
 *         mixins: ['CLI.mixin.Observable'],
 *
 *         config: {
 *             fullName: ''
 *         },
 *
 *         constructor: function(config) {
 *             this.initConfig(config);  // We need to initialize the config options when the class is instantiated
 *         },
 *
 *         quitJob: function() {
 *              this.fireEvent('quit');
 *         }
 *     });
 *
 *     var newEmployee = CLI.create('Employee', {
 *
 *         fullName: 'Ed Spencer',
 *
 *         listeners: {
 *             quit: function() { // This function will be called when the 'quit' event is fired
 *                 // By default, "this" will be the object that fired the event.
 *                 console.log(this.getFullName() + " has quit!");
 *             }
 *         }
 *     });
 *
 *     newEmployee.quitJob(); // Will log 'Ed Spencer has quit!'
 *
 *  @aside guide events
 */
CLI.define('CLI.mixin.Observable', {

    // {{{ requires

    requires: ['CLI.event.Dispatcher'],

    // }}}
    // {{{ extend

    extend: 'CLI.Mixin',

    // }}}
    // {{{ mixins

    mixins: ['CLI.mixin.Identifiable'],

    // }}}
    // {{{ mixinConfig

    mixinConfig: {
        id: 'observable',
        after: {
            destroy: 'destroy'
        }
    },

    // }}}
    // {{{ isObservable

    // @private
    isObservable: true,

    // }}}
    // {{{ observableType

    observableType: 'observable',

    // }}}
    // {{{ validIdRe

    validIdRe: CLI.validIdRe,

    // }}}
    // {{{ observableIdPrefix

    observableIdPrefix: '#',

    // }}}
    // {{{ listenerOptionsRegex

    listenerOptionsRegex: /^(?:scope|order|delegate|single|delay|buffer|args|prepend|destroyable)$/,

    // }}}
    // {{{ eventFiringSuspended

    eventFiringSuspended: 0,

    // }}}
    // {{{ hasListeners

    /**
     * @property {Object} hasListeners
     * @readonly
     * This object holds a key for any event that has a listener. The listener may be set
     * directly on the instance, or on its class or a super class or
     * on the {@link CLI.app.EventBus MVC EventBus}. The values of this object are truthy
     * (a non-zero number) and falsy (0 or undefined). They do not represent an exact count
     * of listeners. The value for an event is truthy if the event must be fired and is
     * falsy if there is no need to fire the event.
     *
     * The intended use of this property is to avoid the expense of fireEvent calls when
     * there are no listeners. This can be particularly helpful when one would otherwise
     * have to call fireEvent hundreds or thousands of times. It is used like this:
     *
     *      if (this.hasListeners.foo) {
     *          this.fireEvent('foo', this, arg1);
     *      }
     */

    // }}}
    // {{{ config

    config: {

        // {{{ listeners

        /**
         * @cfg {Object} listeners
         *
         * A config object containing one or more event handlers to be added to this object during initialization. This
         * should be a valid listeners `config` object as specified in the {@link #addListener} example for attaching
         * multiple handlers at once.
         *
         * See the [Event guide](#!/guide/events) for more
         *
         * __Note:__ It is bad practice to specify a listener's `config` when you are defining a class using `CLI.define()`.
         * Instead, only specify listeners when you are instantiating your class with `CLI.create()`.
         * @accessor
         */
        listeners: {

            // {{{ $value

            $value: null,

            // }}}
            // {{{ merge

            // this merge function allows listeners to be defined declaratively without
            // the config system merging the listeners object with that of its superclass.
            // This is accomplished by adding the listeners to an array along with the
            // listeners of its superclass & mixins (see getDeclaredListeners). This array
            // is then recursively processed by applyListeners().  The end result is that
            // instances will have all the listeners that were defined on themselves,
            // their class, and all base classes and mixins.
            merge: function (newValue, oldValue, target) {

                var value = newValue,
                    scope, namedScope;

                if (target.isInstance) {

                    if (target._hasDeclaredListeners) {

                       value = [ target.self.getDeclaredListeners(), newValue ];

                    }

                } else {

                    if (!target.listeners) {

                        target.listeners = target.getDeclaredListeners();

                    }

                    if (newValue) {

                        // Allow listener scope resolution mechanism to know if the listeners
                        // were declared on the class.  This is only necessary when scope
                        // is unspecified, or when scope is 'controller'.  We use special private
                        // named scopes of "self" and "self.controller" to indicate either
                        // unspecified scope, or scope declared as controller on the class
                        // body.  To avoid iterating the listeners object multiple times, we
                        // only put this special scope on the outermost object at this point
                        // and allow addListener to handle scope:'controller' declared on
                        // inner objects of the listeners config.
                        scope = newValue.scope;

                        if (!scope) {

                            newValue.scope = 'self';

                        } else {

                            namedScope = CLI._namedScopes[scope];

                            if (namedScope && namedScope.isController) {
                                newValue.scope = 'self.controller';
                            }

                        }

                        // setting _hasDeclaredListeners on the prototype of classes that
                        // have declared listeners allows instances to avoid the recursive
                        // descent into the nested arrays of declared listeners on their
                        // superclasses if no superclasses have declared listeners.
                        target.prototype._hasDeclaredListeners = true;
                        target.listeners.push(newValue);

                    }

                }

                return value;

            }

            // }}}

        }

        // }}}

    },

    // }}}
    // {{{ inheritableStatics

    inheritableStatics: {

        getDeclaredListeners: function() {

            var me = this,
                superclass = me.superclass,
                listeners = me.listeners,
                proto = me.prototype,
                mixins, name, mixin;

            if (!listeners) {

                listeners = me.listeners = [];

                if (superclass.isObservable) {
                    listeners.push(superclass.self.getDeclaredListeners());
                }

                if (proto.hasOwnProperty('mixins')) {

                    mixins = proto.mixins;

                    for (name in mixins) {

                        mixin = mixins[name];

                        if (mixin.isObservable) {

                            listeners.push(mixin.self.getDeclaredListeners());

                        }

                    }

                }

            }

            return listeners;

        }

    },

    // }}}
    // {{{ afterClassMixedIn

    afterClassMixedIn: function(targetClass) {

        var targetProto = targetClass.prototype,
            targetListeners = targetProto.listeners;

        // if a class mixes in Observable, and declares listeners on its class body, the
        // listeners will not get processed as a config because the class does not have
        // a listeners "config" until Observable is mixed in.  To work around this we have
        // to add the listeners after Observable is mixed in
        if (targetListeners) {

            delete targetProto.listeners;

            targetClass.getConfigurator().add({

                listeners: targetListeners

            });

        }

    },

    // }}}
    // {{{ constructor

    constructor: function(config) {

        var me = this;

        me.initConfig(config);

        // getHasListeners will assign this.hasListeners for us
        me.getEventDispatcher().getHasListeners(me.observableType, me);

        me.callParent(arguments);

    },

    // }}}
    // {{{ applyListeners

    applyListeners: function(listeners) {

        if (listeners) {

            if (listeners instanceof Array) {

                CLI.each(listeners, this.applyListeners, this);

            } else {

                this.addListener(listeners);

            }

        }

        return listeners;

    },

    // }}}
    // {{{ resolveListenerScope

    /**
     * This method determines the scope (the `this` pointer) of named listeners that have
     * not be given a specific scope. For example:
     *
     *      component.on({
     *          click: 'onClick'
     *      });
     *
     * The default implementation of this method returns this object. Components and other
     * observable objects that have natural hierarchies can override this method to pick
     * the desired scope using other means.
     *
     * @param {Object} [defaultScope=this] The default scope to return if none is found.
     * @return {Object} The object on which non-scoped, named listeners should be fired.
     * @protected
     */
    resolveListenerScope: function (defaultScope) {

        if (defaultScope === 'controller') {
            CLI.Error.raise('scope: "controller" can only be specified on classes that derive from CLI.Component or CLI.Widget');
        }

        if (defaultScope === 'this') {
            defaultScope = null;
        }

        return defaultScope || this;

    },

    // }}}
    // {{{ getOptimizedObservableId

    getOptimizedObservableId: function() {

        return this.observableId;

    },

    // }}}
    // {{{ getObservableId

    getObservableId: function() {

        var me = this,
            id, validIdRe;

        if (!me.observableId) {

            id = me.getUniqueId();
            validIdRe = me.validIdRe;

            // RegExp.test(string) is faster than string.test(RegExp). http://jsperf.com/regexp-test-vs-match-m5
            // This also works with numeric IDs.
            if (validIdRe && !validIdRe.test(id)) {
                CLI.Error.raise('Invalid unique id "' + id + '" for object of type ' + me.$className);
            }

            me.observableId = me.observableIdPrefix + id;

            me.getObservableId = me.getOptimizedObservableId;
        }

        return me.observableId;

    },

    // }}}
    // {{{ getOptimizedEventDispatcher

    getOptimizedEventDispatcher: function() {

        return this.eventDispatcher;

    },

    // }}}
    // {{{ createEventDispatcher

    createEventDispatcher: function() {

        var me = this,
            dispatcher;

        me.eventDispatcher = dispatcher = CLI.event.Dispatcher.getInstance();
        me.getEventDispatcher = me.getOptimizedEventDispatcher;

        me.getListeners();

        return dispatcher;

    },

    // }}}
    // {{{ getEventDispatcher

    getEventDispatcher: function() {

        var dispatcher = this.eventDispatcher;

        if (!dispatcher) {
            dispatcher = this.createEventDispatcher();
        }

        return dispatcher;

    },

    // }}}
    // {{{ getManagedListeners

    getManagedListeners: function(object, eventName) {

        var id = object.getUniqueId(),
            managedListeners = this.managedListeners;

        if (!managedListeners) {

            this.managedListeners = managedListeners = {};

        }

        if (!managedListeners[id]) {

            managedListeners[id] = {};
            object.doAddListener('destroy', 'clearManagedListeners', this, {
                single: true,
                args: [object]
            });

        }

        if (!managedListeners[id][eventName]) {

            managedListeners[id][eventName] = [];

        }

        return managedListeners[id][eventName];

    },

    // }}}
    // {{{ getUsedSelectors

    getUsedSelectors: function() {

        var selectors = this.usedSelectors;

        if (!selectors) {

            selectors = this.usedSelectors = [];
            selectors.$map = {};

        }

        return selectors;
    },

    // }}}
    // {{{ fireEvent

    /**
     * Fires the specified event with the passed parameters (minus the event name, plus the `options` object passed
     * to {@link #addListener}).
     *
     * The first argument is the name of the event. Every other argument passed will be available when you listen for
     * the event.
     *
     * ## Example
     *
     * Firstly, we set up a listener for our new event.
     *
     *     this.on('myevent', function(arg1, arg2, arg3, arg4, options, e) {
     *         console.log(arg1); // true
     *         console.log(arg2); // 2
     *         console.log(arg3); // { test: 'foo' }
     *         console.log(arg4); // 14
     *         console.log(options); // the options added when adding the listener
     *         console.log(e); // the event object with information about the event
     *     });
     *
     * And then we can fire off the event.
     *
     *     this.fireEvent('myevent', true, 2, { test: 'foo' }, 14);
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} Returns `false` if any of the handlers return `false`.
     */
    fireEvent: function(eventName) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.doFireEvent(eventName, args);
    },

    // }}}
    // {{{ fireEventArgs

    /**
     * Fires the specified event with the passed parameter list.
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Object[]} args An array of parameters which are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fireEventArgs: function(eventName, args) {

        return this.doFireEvent(eventName, args);

    },

    // }}}
    // {{{ fireAction

    /**
     * Fires the specified event with the passed parameters and execute a function (action)
     * at the end if there are no listeners that return `false`.
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Array} args Arguments to pass to handers.
     * @param {Function} fn Action.
     * @param {Object} scope Scope of fn.
     * @return {Object}
     */
    fireAction: function(eventName, args, fn, scope, options, order) {

        var fnType = typeof fn,
            action;

        if (args === undefined) {
            args = [];
        }

        if (fnType !== 'undefined') {

            action = {
                fn: fn,
                isLateBinding: fnType === 'string',
                scope: scope || this,
                options: options || {},
                order: order
            };

        }

        return this.doFireEvent(eventName, args, action);

    },

    // }}}
    // {{{ doFireEvent

    doFireEvent: function(eventName, args, action, connectedController) {

        var me = this,
            eventQueue = me.eventQueue,
            eventNameMap = CLI.$eventNameMap,
            suspendedEvents = me.suspendedEvents,
            ret = true;

        // This is inlined for performance
        eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());

        if (me.eventFiringSuspended || (suspendedEvents && suspendedEvents[eventName])) {

            if (eventQueue) {

                eventQueue.push([eventName, args, action, connectedController]);

            }

        } else {

            ret = me.getEventDispatcher().dispatchEvent(me.observableType, me.getObservableId(), eventName, args, action, connectedController);

        }

        return ret;

    },

    // }}}
    // {{{ doAddListener

    /**
     * @private
     * @return {Boolean}
     */
    doAddListener: function(name, fn, scope, options, order) {

        var me = this,
            isManaged = (scope && scope !== me && scope.isIdentifiable),
            usedSelectors = me.getUsedSelectors(),
            usedSelectorsMap = usedSelectors.$map,
            selector = me.getObservableId(),
            isAdded, managedListeners, delegate;

        if (!options) {
            options = {};
        }

        if (!options.type) {  // type may have been set already (CLI.dom.Element)
            // add type info to options object so ListenerStack can use it
            options.type = name;
        }

        if (!scope && typeof fn === 'function') {
            scope = me;
        }

        if (options.delegate) {
            delegate = options.delegate;
            // See https://sencha.jira.com/browse/TOUCH-1579
            selector += ' ' + delegate;
        }

        if (!(selector in usedSelectorsMap)) {
            usedSelectorsMap[selector] = true;
            usedSelectors.push(selector);
        }

        isAdded = me.addDispatcherListener(selector, name, fn, scope, options, order);

        if (isAdded && isManaged) {

            managedListeners = me.getManagedListeners(scope, name);
            managedListeners.push({
                delegate: delegate,
                scope: scope,
                fn: fn,
                order: order
            });

        }

        return isAdded;

    },

    // }}}
    // {{{ addDispatcherListener

    addDispatcherListener: function(selector, name, fn, scope, options, order) {

        return this.getEventDispatcher().addListener(this.observableType, selector, name, fn, scope, options, order, this);

    },

    // }}}
    // {{{ doRemoveListener

    doRemoveListener: function(name, fn, scope, options, order) {

        var me = this,
            isManaged = (scope && scope !== me && scope.isIdentifiable),
            selector = me.getObservableId(),
            isRemoved,
            managedListeners, i, ln, listener, delegate;

        if (!options) {
            options = {};
        }

        if (!scope && typeof fn === 'function') {
            scope = me;
        }

        if (options.delegate) {
            delegate = options.delegate;
            // See https://sencha.jira.com/browse/TOUCH-1579
            selector += ' ' + delegate;
        }

        isRemoved = me.removeDispatcherListener(selector, name, fn, scope, options, order);

        if (isRemoved && isManaged) {
            managedListeners = me.getManagedListeners(scope, name);

            for (i = 0,ln = managedListeners.length; i < ln; i++) {
                listener = managedListeners[i];

                if (listener.fn === fn && listener.scope === scope && listener.delegate === delegate && listener.order === order) {
                    managedListeners.splice(i, 1);
                    break;
                }
            }
        }

        return isRemoved;

    },

    // }}}
    // {{{ removeDispatcherListener

    removeDispatcherListener: function(selector, name, fn, scope, options, order) {

        return this.getEventDispatcher().removeListener(this.observableType, selector, name, fn, scope, options, order, this);

    },

    // }}}
    // {{{ clearManagedListeners

    clearManagedListeners: function(object) {

        var me = this,
            managedListeners = me.managedListeners,
            id, namedListeners, listeners, eventName, i, ln, listener, options;

        if (!managedListeners) {
            return me;
        }

        if (object) {

            if (typeof object !== 'string') {

                id = object.getUniqueId();

            } else {

                id = object;

            }

            namedListeners = managedListeners[id];

            for (eventName in namedListeners) {

                if (namedListeners.hasOwnProperty(eventName)) {

                    listeners = namedListeners[eventName];

                    for (i = 0,ln = listeners.length; i < ln; i++) {

                        listener = listeners[i];

                        options = {};

                        if (listener.delegate) {

                            options.delegate = listener.delegate;

                        }

                        if (me.doRemoveListener(eventName, listener.fn, listener.scope, options, listener.order)) {

                            i--;
                            ln--;

                        }

                    }

                }

            }

            delete managedListeners[id];
            return me;

        }

        for (id in managedListeners) {

            if (managedListeners.hasOwnProperty(id)) {

                me.clearManagedListeners(id);

            }

        }

    },

    // }}}
    // {{{ changeListener

    /**
     * @private
     */
    changeListener: function(actionFn, eventName, fn, scope, options, order) {

        var me = this,
            eventNameMap = CLI.$eventNameMap,
            eventNames, listeners, listenerOptionsRegex, actualOptions, isClassListener,
            namedScopes, namedScope, innerScope, name, value, i, ln, listener, valueType;

        if (typeof fn !== 'undefined') {

            // Support for array format to add multiple listeners
            if (typeof eventName !== 'string') {

                for (i = 0,ln = eventName.length; i < ln; i++) {

                    name = eventName[i];
                    // This is inlined for performance
                    name = eventNameMap[name] || (eventNameMap[name] = name.toLowerCase());
                    actionFn.call(me, name, fn, scope, options, order);

                }

                return me;

            }

            // This is inlined for performance
            eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());

            if (options) {

                // if the caller passed an options object, chain it to avoid mutating the original
                options = CLI.Object.chain(options);

            }

            actionFn.call(me, eventName, fn, scope, options, order);

        } else if (CLI.isArray(eventName)) {

            listeners = eventName;

            for (i = 0,ln = listeners.length; i < ln; i++) {

                listener = listeners[i];
                eventName = listener.event;
                // This is inlined for performance
                eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());
                actionFn.call(me, eventName, listener.fn, listener.scope, listener, listener.order);

            }

        } else if (eventName) {

            listenerOptionsRegex = me.listenerOptionsRegex;
            options = eventName;
            eventNames = [];
            listeners = [];
            actualOptions = {};
            order = options.order;
            scope = options.scope;
            namedScopes = CLI._namedScopes;
            namedScope = scope && namedScopes[scope];
            isClassListener = namedScope && namedScope.isSelf;

            for (name in options) {

                value = options[name];

                if (!listenerOptionsRegex.test(name)) {

                    // This is inlined for performance
                    name = eventNameMap[name] || (eventNameMap[name] = name.toLowerCase());
                    valueType = typeof value;

                    if (valueType !== 'string' && valueType !== 'function') {

                        innerScope = value.scope;
                        // for proper scope resolution, scope:'controller' specified on an
                        // inner object, must be translated to 'self.controller' if the
                        // listeners object was declared on the class body.
                        // see also CLI.util.Observable#prepareClass and
                        // CLI.mixin.Inheritable#resolveListenerScope
                        if (innerScope && isClassListener) {
                            namedScope = namedScopes[innerScope];
                            if (namedScope && namedScope.isController) {
                                innerScope = 'self.controller';
                            }
                        }

                        actionFn.call(this, name, value.fn, innerScope || scope, value, value.order || order);
                        continue;
                    }

                    eventNames.push(name);
                    listeners.push(value);

                } else {

                    actualOptions[name] = value;

                }

            }

            for (i = 0,ln = eventNames.length; i < ln; i++) {

                actionFn.call(me, eventNames[i], listeners[i], scope, actualOptions, order);

            }

        }

        return me;

    },

    // }}}
    // {{{ addListener

    /**
     * Appends an event handler to this object. You can review the available handlers by looking at the 'events'
     * section of the documentation for the component you are working with.
     *
     * ## Combining Options
     *
     * Using the options argument, it is possible to combine different types of listeners:
     *
     * A delayed, one-time listener:
     *
     *     container.addListener('tap', this.handleTap, this, {
     *         single: true,
     *         delay: 100
     *     });
     *
     * ## Attaching multiple handlers in 1 call
     *
     * The method also allows for a single argument to be passed which is a config object containing properties which
     * specify multiple events. For example:
     *
     *     container.addListener({
     *         tap  : this.onTap,
     *         swipe: this.onSwipe,
     *
     *         scope: this // Important. Ensure "this" is correct during handler execution
     *     });
     *
     * One can also specify options for each event handler separately:
     *
     *     container.addListener({
     *         tap  : { fn: this.onTap, scope: this, single: true },
     *         swipe: { fn: button.onSwipe, scope: button }
     *     });
     *
     * See the [Events Guide](#!/guide/events) for more.
     *
     * @param {String/String[]/Object} eventName The name of the event to listen for. May also be an object who's property names are
     * event names.
     * @param {Function/String} fn The method the event invokes.  Will be called with arguments given to
     * {@link #fireEvent} plus the `options` parameter described below.
     * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed. **If
     * omitted, defaults to the object which fired the event.**
     * @param {Object} [options] An object containing handler configuration.
     *
     * This object may contain any of the following properties:
     *
     * @param {Object} [options.scope] The scope (`this` reference) in which the handler function is executed. If omitted, defaults to the object
     * which fired the event.
     * @param {Number} [options.delay] The number of milliseconds to delay the invocation of the handler after the event fires.
     * @param {Boolean} [options.single] `true` to add a handler to handle just the next firing of the event, and then remove itself.
     * @param {String} [options.order=current] The order of when the listener should be added into the listener queue.
     *
     * If you set an order of `before` and the event you are listening to is preventable, you can return `false` and it will stop the event.
     *
     * Available options are `before`, `current` and `after`.
     *
     * @param {Number} [options.buffer] Causes the handler to be delayed by the specified number of milliseconds. If the event fires again within that
     * time, the original handler is _not_ invoked, but the new handler is scheduled in its place.
     * @param {String} [options.element] If this observable is a Component, allows you to add
     * a listener onto a element of the component using the element's reference.
     *
     *     CLI.create('CLI.Component', {
     *         listeners: {
     *             element: 'element',
     *             tap: function() {
     *                 alert('element tap!');
     *             }
     *         }
     *     });
     *
     * In Sencha Touch, All components have the `element` reference, which is the outer
     * most element of the component. {@link CLI.Container} also has the `innerElement`
     * element which contains all children. In most cases `element` is adequate.
     *
     * @param {String} [options.delegate] For {@link CLI.dom.Element Elements}, a simple DOM selector to
     * filter the target or look for a descendant of the target.
     *
     * Sencha Touch Components can use {@link CLI.ComponentQuery} selectors to filter child Components.
     *
     *     // Create a container with a two children; a button and a toolbar
     *     var container = CLI.create('CLI.Container', {
     *         items: [
     *             {
     *                 xtype: 'toolbar',
     *                 docked: 'top',
     *                 title: 'My Toolbar'
     *             },
     *             {
     *                xtype: 'button',
     *                text: 'My Button'
     *             }
     *         ]
     *     });
     *
     *     container.addListener({
     *         // CLI.Buttons have an xtype of 'button', so we use that are a selector for our delegate
     *         delegate: 'button',
     *
     *         tap: function() {
     *             alert('Button tapped!');
     *         }
     *     });
     *
     * @param {Boolean} options.capture `true` to initiate capture which will fire the
     * listeners on the target Element *before* any descendant Elements. Normal events
     * start with the target element and propagate upward to ancestor elements, whereas
     * captured events propagate from the top of the DOM downward to descendant elements.
     * This option achieves the same result as the useCapture parameter in the standard
     * JavaScript addEventListener method.
     *
     * @param {String} [order='current'] The order of when the listener should be added into the listener queue.
     * Possible values are `before`, `current` and `after`.
     */
    addListener: function(eventName, fn, scope, options, order) {

        var me = this,
            destroy, out;

        if (options) {

            destroy = options.destroyable;

        } else if (typeof eventName === 'object') {

            destroy = eventName.destroyable;

        }

        out = me.changeListener(me.doAddListener, eventName, fn, scope, options, order);

        if (destroy) {

            out = new CLI.mixin.Observable.$ListenerRemover(me, eventName, fn, scope, options, order);

        }

        return out;
    },

    // }}}
    // {{{ toggleListener

    toggleListener: function(toggle, eventName, fn, scope, options, order) {

        return this.changeListener(toggle ? this.doAddListener : this.doRemoveListener, eventName, fn, scope, options, order);

    },

    // }}}
    // {{{ addBeforeListener

    /**
     * Appends a before-event handler.  Returning `false` from the handler will stop the event.
     *
     * Same as {@link #addListener} with `order` set to `'before'`.
     *
     * @param {String/String[]/Object} eventName The name of the event to listen for.
     * @param {Function/String} fn The method the event invokes.
     * @param {Object} [scope] The scope for `fn`.
     * @param {Object} [options] An object containing handler configuration.
     */
    addBeforeListener: function(eventName, fn, scope, options) {

        return this.addListener(eventName, fn, scope, options, 'before');

    },

    // }}}
    // {{{ addAfterListener

    /**
     * Appends an after-event handler.
     *
     * Same as {@link #addListener} with `order` set to `'after'`.
     *
     * @param {String/String[]/Object} eventName The name of the event to listen for.
     * @param {Function/String} fn The method the event invokes.
     * @param {Object} [scope] The scope for `fn`.
     * @param {Object} [options] An object containing handler configuration.
     */
    addAfterListener: function(eventName, fn, scope, options) {

        return this.addListener(eventName, fn, scope, options, 'after');

    },

    // }}}
    // {{{ removeListener

    /**
     * Removes an event handler.
     *
     * @param {String/String[]/Object} eventName The type of event the handler was associated with.
     * @param {Function/String} fn The handler to remove. **This must be a reference to the function passed into the
     * {@link #addListener} call.**
     * @param {Object} [scope] The scope originally specified for the handler. It must be the same as the
     * scope argument specified in the original call to {@link #addListener} or the listener will not be removed.
     * @param {Object} [options] Extra options object. See {@link #addListener} for details.
     * @param {String} [order='current'] The order of the listener to remove.
     * Possible values are `before`, `current` and `after`.
     */
    removeListener: function(eventName, fn, scope, options, order) {
        return this.changeListener(this.doRemoveListener, eventName, fn, scope, options, order);
    },

    // }}}
    // {{{ removeBeforeListener

    /**
     * Removes a before-event handler.
     *
     * Same as {@link #removeListener} with `order` set to `'before'`.
     *
     * @param {String/String[]/Object} eventName The name of the event the handler was associated with.
     * @param {Function/String} fn The handler to remove.
     * @param {Object} [scope] The scope originally specified for `fn`.
     * @param {Object} [options] Extra options object.
     */
    removeBeforeListener: function(eventName, fn, scope, options) {
        return this.removeListener(eventName, fn, scope, options, 'before');
    },

    // }}}
    // {{{ removeAfterListener

    /**
     * Removes a before-event handler.
     *
     * Same as {@link #removeListener} with `order` set to `'after'`.
     *
     * @param {String/String[]/Object} eventName The name of the event the handler was associated with.
     * @param {Function/String} fn The handler to remove.
     * @param {Object} [scope] The scope originally specified for `fn`.
     * @param {Object} [options] Extra options object.
     */
    removeAfterListener: function(eventName, fn, scope, options) {

        return this.removeListener(eventName, fn, scope, options, 'after');

    },

    // }}}
    // {{{ clearListeners

    /**
     * Removes all listeners for this object.
     */
    clearListeners: function() {

        var me = this,
            usedSelectors = me.getUsedSelectors(),
            dispatcher = me.getEventDispatcher(),
            i, ln, selector;

        for (i = 0,ln = usedSelectors.length; i < ln; i++) {

            selector = usedSelectors[i];

            dispatcher.clearListeners(me.observableType, selector, me);
        }

    },

    // }}}
    // {{{ hasListener

    /**
     * Checks to see if this object has any listeners for a specified event
     *
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */
    hasListener: function(eventName) {

        return this.getEventDispatcher().hasListener(this.observableType, this.getObservableId(), eventName);

    },

    // }}}
    // {{{ isSuspended

    /**
     * Checks if all events, or a specific event, is suspended.
     * @param {String} [eventName] The name of the specific event to check
     * @return {Boolean} `true` if events are suspended
     */
    isSuspended: function(eventName) {

        var eventNameMap = CLI.$eventNameMap,
            suspendedEvents = this.suspendedEvents;

        if (eventName) {

            // This is inlined for performance
            eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());

        }

        return !!(this.eventFiringSuspended || (suspendedEvents && suspendedEvents[eventName]));

    },

    // }}}
    // {{{ suspendEvents

    /**
     * Suspends the firing of all events. (see {@link #resumeEvents})
     *
     * @param {Boolean} queueSuspended `true` to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events.
     */
    suspendEvents: function(queueSuspended) {

        ++this.eventFiringSuspended;

        if (queueSuspended && !this.eventQueue) {
            this.eventQueue = [];
        }

    },

    // }}}
    // {{{ suspendEvent

    /**
     * Suspends firing of the named event(s).
     *
     * After calling this method to suspend events, the events will no longer fire when requested to fire.
     *
     * **Note that if this is called multiple times for a certain event, the converse method
     * {@link #resumeEvent} will have to be called the same number of times for it to resume firing.**
     *
     * @param  {String...} eventName Multiple event names to suspend.
     */
    suspendEvent: function() {

        var args = arguments,
            suspendedEvents = this.suspendedEvents,
            eventNameMap = CLI.$eventNameMap,
            ln = args.length,
            i, eventName;

        if (!suspendedEvents) {

            suspendedEvents = this.suspendedEvents = {};

        }

        for (i = 0; i < ln; i++) {

            eventName = args[i];
            // This is inlined for performance
            eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());

            if (!(eventName in suspendedEvents)) {
                suspendedEvents[eventName] = 0;
            }

            ++suspendedEvents[eventName];

        }

    },

    // }}}
    // {{{ resumeEvents

    /**
     * Resumes firing events (see {@link #suspendEvents}).
     *
     * @param {Boolean} discardQueuedEvents Pass as true to discard any queued events.
     */
    resumeEvents: function(discardQueuedEvents) {

        var me = this,
            eventQueue = me.eventQueue || [],
            suspendedEvents = me.suspendedEvents,
            args, i, ln;

        if (me.eventFiringSuspended && !--me.eventFiringSuspended) { // only decrement if > 0

            //don't loop over the queue if specified to discard the queue
            if (!discardQueuedEvents) {

                for (i = 0, ln = eventQueue.length; i < ln; i++) {

                    args = eventQueue[i];

                    if (!(suspendedEvents && suspendedEvents[args[0]])) {

                        me.doFireEvent.apply(me, args);

                    }

                }

            }

            //clear the queue
            me.eventQueue = null;

        }

    },

    // }}}
    // {{{ resumeEvent

    /**
     * Resumes firing of the named event(s).
     *
     * After calling this method to resume events, the events will fire when requested to fire.
     *
     * **Note that if the {@link #suspendEvent} method is called multiple times for a certain event,
     * this converse method will have to be called the same number of times for it to resume firing.**
     *
     * @param  {String...} eventName Multiple event names to resume.
     */
    resumeEvent: function() {

        var me = this,
            args = arguments,
            suspendedEvents = me.suspendedEvents,
            eventNameMap = CLI.$eventNameMap,
            ln = args.length,
            i, eventName;

        for (i = 0; i < ln; i++) {

            eventName = args[i];
            // This is inlined for performance
            eventName = eventNameMap[eventName] || (eventNameMap[eventName] = eventName.toLowerCase());

            if (suspendedEvents && suspendedEvents[eventName]) {

                --suspendedEvents[eventName];

            }

        }

        if (!me.eventFiringSuspended) {

            me.resumeEvents();

        }

    },

    // }}}
    // {{{ relayEvents

    /**
     * Relays selected events from the specified Observable as if the events were fired by `this`.
     * @param {Object} object The Observable whose events this object is to relay.
     * @param {String/Array/Object} events Array of event names to relay.
     */
    relayEvents: function(object, events, prefix) {

        var eventNameMap = CLI.$eventNameMap,
            i, ln, oldName, newName;

        if (typeof prefix === 'undefined') {
            prefix = '';
        }

        prefix = prefix.toLowerCase();

        if (typeof events === 'string') {
            events = [events];
        }

        if (CLI.isArray(events)) {

            for (i = 0,ln = events.length; i < ln; i++) {

                oldName = events[i];
                // This is inlined for performance
                oldName = eventNameMap[oldName] || (eventNameMap[oldName] = oldName.toLowerCase());
                newName = prefix + oldName;

                object.addListener(oldName, this.createEventRelayer(newName), this);

            }

        } else {

            for (oldName in events) {

                if (events.hasOwnProperty(oldName)) {

                    // This is inlined for performance
                    oldName = eventNameMap[oldName] || (eventNameMap[oldName] = oldName.toLowerCase());
                    newName = prefix + events[oldName];

                    object.addListener(oldName, this.createEventRelayer(newName), this);

                }

            }

        }

        return this;

    },

    // }}}
    // {{{ relayEvent

    /**
     * @private
     */
    relayEvent: function(args, fn, scope, options, order) {

        var fnType = typeof fn,
            controller = args[args.length - 1],
            eventName = controller.getInfo().eventName,
            action;

        args = Array.prototype.slice.call(args, 0, -2);
        args[0] = this;

        if (fnType !== 'undefined') {
            action = {
                fn: fn,
                scope: scope || this,
                options: options || {},
                order: order,
                isLateBinding: fnType === 'string'
            };
        }

        return this.doFireEvent(eventName, args, action, controller);

    },

    // }}}
    // {{{ createEventRelayer

    /**
     * @private
     * Creates an event handling function which re-fires the event from this object as the passed event name.
     * @param {String} newName
     * @return {Function}
     */
    createEventRelayer: function(newName){

        return function() {

            return this.doFireEvent(newName, Array.prototype.slice.call(arguments, 0, -2));

        };

    },

    // }}}
    // {{{ destroy

    destroy: function() {

        var me = this;

        if (me.observableId) {

            me.fireEvent('destroy', me);
            me.clearListeners();
            me.clearManagedListeners();

        }

    }

    // }}}

}, function(Cls) {

    // Private Destroyable class which removes listeners
    var Remover = function(observable) {
        // Passed a ListenerRemover: return it
        if (observable instanceof Remover) {
            return observable;
        }
        this.observable = observable;
        this.args = Array.prototype.slice.call(arguments, 1);
    };

    Remover.prototype.destroy = function() {
        var observable = this.observable;
        observable.un.apply(observable, this.args);
    };

    Cls.$ListenerRemover = Remover;

    Cls.createAlias({
        /**
         * @method
         * Alias for {@link #addListener}.
         * @inheritdoc CLI.mixin.Observable#addListener
         */
        on: 'addListener',
        /**
         * @method
         * Alias for {@link #removeListener}.
         * @inheritdoc CLI.mixin.Observable#removeListener
         */
        un: 'removeListener',
        /**
         * @method
         * Alias for {@link #addBeforeListener}.
         * @inheritdoc CLI.mixin.Observable#addBeforeListener
         */
        onBefore: 'addBeforeListener',
        /**
         * @method
         * Alias for {@link #addAfterListener}.
         * @inheritdoc CLI.mixin.Observable#addAfterListener
         */
        onAfter: 'addAfterListener',
        /**
         * @method
         * Alias for {@link #removeBeforeListener}.
         * @inheritdoc CLI.mixin.Observable#removeBeforeListener
         */
        unBefore: 'removeBeforeListener',
        /**
         * @method
         * Alias for {@link #removeAfterListener}.
         * @inheritdoc CLI.mixin.Observable#removeAfterListener
         */
        unAfter: 'removeAfterListener'
    });
});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
