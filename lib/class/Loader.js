/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Loader
 *
 * CLI.Loader is the heart of the new dynamic dependency loading capability in CLI Framework. It is most commonly used
 * via the {@link CLI#require} shorthand. CLI.Loader supports both asynchronous and synchronous loading
 * approaches, and leverage their advantages for the best development flow. We'll discuss about the pros and cons of each approach:
 *
 * # Asynchronous Loading #
 *
 * - Advantages:
 *     + Cross-domain
 *     + No web server needed: you can run the application via the file system protocol (i.e: `file://path/to/your/index
 *  .html`)
 *     + Best possible debugging experience: error messages come with the exact file name and line number
 *
 * - Disadvantages:
 *     + Dependencies need to be specified before-hand
 *
 * ### Method 1: Explicitly include what you need: ###
 *
 *     // Syntax
 *     CLI.require({String/Array} expressions);
 *
 *     // Example: Single alias
 *     CLI.require('widget.window');
 *
 *     // Example: Single class name
 *     CLI.require('CLI.window.Window');
 *
 *     // Example: Multiple aliases / class names mix
 *     CLI.require(['widget.window', 'layout.border', 'CLI.data.Connection']);
 *
 *     // Wildcards
 *     CLI.require(['widget.*', 'layout.*', 'CLI.data.*']);
 *
 * ### Method 2: Explicitly exclude what you don't need: ###
 *
 *     // Syntax: Note that it must be in this chaining format.
 *     CLI.exclude({String/Array} expressions)
 *        .require({String/Array} expressions);
 *
 *     // Include everything except CLI.data.*
 *     CLI.exclude('CLI.data.*').require('*');
 *
 *     // Include all widgets except widget.checkbox*,
 *     // which will match widget.checkbox, widget.checkboxfield, widget.checkboxgroup, etc.
 *     CLI.exclude('widget.checkbox*').require('widget.*');
 *
 * # Synchronous Loading on Demand #
 *
 * - Advantages:
 *     + There's no need to specify dependencies before-hand, which is always the convenience of including ext-all.js
 *  before
 *
 * - Disadvantages:
 *     + Not as good debugging experience since file name won't be shown (except in Firebug at the moment)
 *     + Must be from the same domain due to XHR restriction
 *     + Need a web server, same reason as above
 *
 * There's one simple rule to follow: Instantiate everything with CLI.create instead of the `new` keyword
 *
 *     CLI.create('widget.window', { ... }); // Instead of new CLI.window.Window({...});
 *
 *     CLI.create('CLI.window.Window', {}); // Same as above, using full class name instead of alias
 *
 *     CLI.widget('window', {}); // Same as above, all you need is the traditional `xtype`
 *
 * Behind the scene, {@link CLI.ClassManager} will automatically check whether the given class name / alias has already
 *  existed on the page. If it's not, CLI.Loader will immediately switch itself to synchronous mode and automatic load the given
 *  class and all its dependencies.
 *
 * # Hybrid Loading - The Best of Both Worlds #
 *
 * It has all the advantages combined from asynchronous and synchronous loading. The development flow is simple:
 *
 * ### Step 1: Start writing your application using synchronous approach.
 *
 * CLI.Loader will automatically fetch all dependencies on demand as they're needed during run-time. For example:
 *
 *     CLI.onReady(function(){
 *         var window = CLI.widget('window', {
 *             width: 500,
 *             height: 300,
 *             layout: {
 *                 type: 'border',
 *                 padding: 5
 *             },
 *             title: 'Hello Dialog',
 *             items: [{
 *                 title: 'Navigation',
 *                 collapsible: true,
 *                 region: 'west',
 *                 width: 200,
 *                 html: 'Hello',
 *                 split: true
 *             }, {
 *                 title: 'TabPanel',
 *                 region: 'center'
 *             }]
 *         });
 *
 *         window.show();
 *     })
 *
 * ### Step 2: Along the way, when you need better debugging ability, watch the console for warnings like these: ###
 *
 *     [CLI.Loader] Synchronously loading 'CLI.window.Window'; consider adding CLI.require('CLI.window.Window') before your application's code
 *     ClassManager.js:432
 *     [CLI.Loader] Synchronously loading 'CLI.layout.container.Border'; consider adding CLI.require('CLI.layout.container.Border') before your application's code
 *
 * Simply copy and paste the suggested code above `CLI.onReady`, i.e:
 *
 *     CLI.require('CLI.window.Window');
 *     CLI.require('CLI.layout.container.Border');
 *
 *     CLI.onReady(...);
 *
 * Everything should now load via asynchronous mode.
 *
 * # Deployment #
 *
 * It's important to note that dynamic loading should only be used during development on your local machines.
 * During production, all dependencies should be combined into one single JavaScript file. CLI.Loader makes
 * the whole process of transitioning from / to between development / maintenance and production as easy as
 * possible. Internally {@link CLI.Loader#history CLI.Loader.history} maintains the list of all dependencies your application
 * needs in the exact loading sequence. It's as simple as concatenating all files in this array into one,
 * then include it on top of your application.
 *
 * This process will be automated with Sencha Command, to be released and documented towards CLI Framework Final.
 *
 * @singleton
 */
(function() {

    // {{{ CLI.Loader

    CLI.Loader = new function() {

        var Loader = this,
            Manager = CLI.ClassManager, // this is an instance of CLI.Inventory
            Boot = CLI.Boot,
            Class = CLI.Class,
            alias = CLI.Function.alias,
            dependencyProperties = ['extend', 'mixins', 'requires'],
            isInHistory = {},
            history = [],
            usedClasses = [],
            _requiresMap = {},
            _missingQueue = {},
            _config = {

                // {{{ enabled

                /**
                 * @cfg {Boolean} [enabled=true]
                 * Whether or not to enable the dynamic dependency loading feature.
                 */
                enabled: true,

                // }}}
                // {{{ paths

                /**
                 * @cfg {Object} paths
                 * The mapping from namespaces to file paths
                 *
                 *     {
                 *         'CLI': '.', // This is set by default, CLI.layout.container.Container will be
                 *                     // loaded from ./layout/Container.js
                 *
                 *         'My': './src/my_own_folder' // My.layout.Container will be loaded from
                 *                                     // ./src/my_own_folder/layout/Container.js
                 *     }
                 *
                 * Note that all relative paths are relative to the current HTML document.
                 * If not being specified, for example, `Other.awesome.Class` will simply be
                 * loaded from `"./Other/awesome/Class.js"`.
                 */
                paths: Manager.paths,

                // }}}

            };

        CLI.apply(Loader, {

            // {{{ isInHistory

            /**
             * @private
             */
            isInHistory: isInHistory,

            // }}}
            // {{{ history

            /**
             * An array of class names to keep track of the dependency loading order.
             * This is not guaranteed to be the same everytime due to the asynchronous
             * nature of the Loader.
             *
             * @property {Array} history
             */
            history: history,

            // }}}
            // {{{ config

            /**
             * Configuration
             * @private
             */
            config: _config,

            // }}}
            // {{{ requiresMap

            /**
             * Map of fully qualified class names to an array of dependent classes.
             * @private
             */
            requiresMap: _requiresMap,

            // }}}
            // {{{ hasFileLoadError

            /** @private */
            hasFileLoadError: false,

            // }}}
            // {{{ missingQueue

            /**
             * @private
             */
            missingQueue: _missingQueue,

            // }}}
            // {{{ setConfig

            /**
             * Set the configuration for the loader. This should be called right after ext-(debug).js
             *
             *     <script type="text/javascript" src="ext-core-debug.js"></script>
             *     <script type="text/javascript">
             *         CLI.Loader.setConfig({
             *           enabled: true,
             *           paths: {
             *               'My': 'my_own_path'
             *           }
             *         });
             *     </script>
             *     <script type="text/javascript">
             *         CLI.require(...);
             *
             *         CLI.onReady(function() {
             *           // application code here
             *         });
             *     </script>
             *
             * Refer to config options of {@link CLI.Loader} for the list of possible properties
             *
             * @param {Object} config The config object to override the default values
             * @return {CLI.Loader} this
             */
            setConfig: CLI.Function.flexSetter(function (name, value) {

                if (name === 'paths') {
                    Loader.setPath(value);
                } else {
                    _config[name] = value;
                }

                return Loader;
            }),

            // }}}
            // {{{ getConfig

            /**
             * Get the config value corresponding to the specified name. If no name is given, will return the config object
             * @param {String} name The config property name
             * @return {Object}
             */
            getConfig: function(name) {

                return name ? _config[name] : _config;

            },

            // }}}
            // {{{ setPath

            /**
             * Sets the path of a namespace.
             * For Example:
             *
             *     CLI.Loader.setPath('CLI', '.');
             *
             * @param {String/Object} name See {@link CLI.Function#flexSetter flexSetter}
             * @param {String} [path] See {@link CLI.Function#flexSetter flexSetter}
             * @return {CLI.Loader} this
             * @method
             */
            setPath: function () {

                // Paths are an CLI.Inventory thing and ClassManager is an instance of that:
                Manager.setPath.apply(Manager, arguments);
                return Loader;
            },

            // }}}
            // {{{ addClassPathMappings

            /**
             * Sets a batch of path entries
             *
             * @param {Object } paths a set of className: path mappings
             * @return {CLI.Loader} this
             */
            addClassPathMappings: function(paths) {

                // Paths are an CLI.Inventory thing and ClassManager is an instance of that:
                Manager.setPath(paths);

                return Loader;

            },

            // }}}
            // {{{ getPath

            /**
             * Translates a className to a file path by adding the
             * the proper prefix and converting the .'s to /'s. For example:
             *
             *     CLI.Loader.setPath('My', '/path/to/My');
             *
             *     alert(CLI.Loader.getPath('My.awesome.Class')); // alerts '/path/to/My/awesome/Class.js'
             *
             * Note that the deeper namespace levels, if explicitly set, are always resolved first. For example:
             *
             *     CLI.Loader.setPath({
             *         'My': '/path/to/lib',
             *         'My.awesome': '/other/path/for/awesome/stuff',
             *         'My.awesome.more': '/more/awesome/path'
             *     });
             *
             *     alert(CLI.Loader.getPath('My.awesome.Class')); // alerts '/other/path/for/awesome/stuff/Class.js'
             *
             *     alert(CLI.Loader.getPath('My.awesome.more.Class')); // alerts '/more/awesome/path/Class.js'
             *
             *     alert(CLI.Loader.getPath('My.cool.Class')); // alerts '/path/to/lib/cool/Class.js'
             *
             *     alert(CLI.Loader.getPath('Unknown.strange.Stuff')); // alerts 'Unknown/strange/Stuff.js'
             *
             * @param {String} className
             * @return {String} path
             */
            getPath: function(className) {

                // Paths are an CLI.Inventory thing and ClassManager is an instance of that:
                return Manager.getPath(className);

            },

            // }}}
            // {{{ require

            require: function (expressions, fn, scope, excludes) {

                if (excludes) {
                    return Loader.exclude(excludes).require(expressions, fn, scope);
                }

                var classNames = Manager.getNamesByExpression(expressions);

                return Loader.load(classNames, fn, scope);

            },

            // }}}
            // {{{ syncRequire

            syncRequire: function () {

                return Loader.require.apply(Loader, arguments);

            },

            // }}}
            // {{{ exclude

            exclude: function (excludes) {

                var selector = Manager.select({

                    require: function (classNames, fn, scope) {
                        return Loader.load(classNames, fn, scope);
                    },

                    syncRequire: function (classNames, fn, scope) {

                        var ret = Loader.load(classNames, fn, scope);

                        return ret;
                    }

                });

                selector.exclude(excludes);

                return selector;

            },

            // }}}
            // {{{ load

            load: function (classNames, callback, scope) {

                if (callback) {

                    if (callback.length) {
                        // If callback expects arguments, shim it with a function that will map
                        // the requires class(es) from the names we are given.
                        callback = Loader.makeLoadCallback(classNames, callback);
                    }

                    callback = callback.bind(scope || CLI.global);

                }

                var missingClassNames = [],
                    numClasses = classNames.length,
                    className, i, numMissing, urls = [],
                    state = Manager.classState;

                for (i = 0; i < numClasses; ++i) {

                    className = Manager.resolveName(classNames[i]);

                    if (!Manager.isCreated(className)) {

                        missingClassNames.push(className);
                        _missingQueue[className] = Loader.getPath(className);

                        if(!state[className]) {
                            urls.push(_missingQueue[className]);
                        }

                    }

                }

                // If the dynamic dependency feature is not being used, throw an error
                // if the dependencies are not defined
                numMissing = missingClassNames.length;

                if (numMissing) {

                    Loader.missingCount += numMissing;

                    // We check for existence here (onExists vs onCreated) because overrides
                    // can come into existence but pause before being created until the target
                    // of the override has been created, which may not happen. For normal
                    // classes, this timing of this will be equivalent to onCreated.
                    Manager.onExists(function () {

                        if (callback) {
                            CLI.callback(callback, scope, arguments);
                        }

                    }, Loader, missingClassNames);

                    if (!_config.enabled) {

                        CLI.Error.raise("CLI.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                                        "Missing required class" + ((missingClassNames.length > 1) ? "es" : "") +
                                        ": " + missingClassNames.join(', '));
                    }

                    Loader.loadScripts({
                        url: urls,
                        // scope: this options object so we can pass these along:
                        _classNames: missingClassNames
                    });

                } else {

                    if (callback) {
                        callback.call(scope);
                    }

                }

                // Class may have been just loaded or was already loaded
                if (numClasses === 1) {

                    return Manager.get(classNames[0]);

                }

                return Loader;

            },

            // }}}
            // {{{ makeLoadCallback

            makeLoadCallback: function (classNames, callback) {

                return function () {

                    var classes = [],
                        i = classNames.length;

                    while (i-- > 0) {
                        classes[i] = Manager.get(classNames[i]);
                    }

                    return callback.apply(this, classes);
                };

            },

            // }}}
            // {{{ addUsedClasses

            /**
             * @private
             * Ensure that any classes referenced in the `uses` property are loaded.
             */
            addUsedClasses: function (classes) {

                var cls, i, ln;

                if (classes) {

                    classes = (typeof classes === 'string') ? [classes] : classes;

                    for (i = 0, ln = classes.length; i < ln; i++) {

                        cls = classes[i];

                        if (typeof cls === 'string' && !CLI.Array.contains(usedClasses, cls)) {

                            usedClasses.push(cls);

                        }

                    }

                }

                return Loader;

            },

            // }}}
            // {{{ historyPush

            /**
             * @private
             * @param {String} className
             */
            historyPush: function(className) {
                if (className && !isInHistory[className]) {
                    isInHistory[className] = true;
                    history.push(className);
                }
                return Loader;
            },

            // }}}
            // {{{ loadScripts

            /**
             * This is an internal method that delegate content loading to the
             * bootstrap layer.
             * @private
             * @param params
             */
            loadScripts: function(params) {

                var manifest = CLI.manifest,
                    options = params;

                ++Loader.scriptsLoading;

                CLI.iterate(options.url, function(t) {

                    t = require('path').normalize(t);

                    try {
                        require(t);
                    } catch(e) {
                        process.exit();
                    }

                });

            }

            // }}}

        });

        // {{{ CLI.require

        /**
         * Loads all classes by the given names and all their direct dependencies; optionally
         * executes the given callback function when finishes, within the optional scope.
         *
         * @param {String/String[]} expressions The class, classes or wildcards to load.
         * @param {Function} [fn] The callback function.
         * @param {Object} [scope] The execution scope (`this`) of the callback function.
         * @member CLI
         * @method require
         */
        CLI.require = alias(Loader, 'require');

        // }}}
        // {{{ CLI.syncRequire

        /**
         * Synchronously loads all classes by the given names and all their direct dependencies; optionally
         * executes the given callback function when finishes, within the optional scope.
         *
         * @param {String/String[]} expressions The class, classes or wildcards to load.
         * @param {Function} [fn] The callback function.
         * @param {Object} [scope] The execution scope (`this`) of the callback function.
         * @member CLI
         * @method syncRequire
         */
        CLI.syncRequire = alias(Loader, 'syncRequire');

        // }}}
        // {{{ CLI.exclude

        /**
         * Explicitly exclude files from being loaded. Useful when used in conjunction with a
         * broad include expression. Can be chained with more `require` and `exclude` methods,
         * for example:
         *
         *     CLI.exclude('CLI.data.*').require('*');
         *
         *     CLI.exclude('widget.button*').require('widget.*');
         *
         * @param {String/String[]} excludes
         * @return {Object} Contains `exclude`, `require` and `syncRequire` methods for chaining.
         * @member CLI
         * @method exclude
         */
        CLI.exclude = alias(Loader, 'exclude');

        // }}}
        // {{{ loader

        /**
         * @cfg {String[]} requires
         * @member CLI.Class
         * List of classes that have to be loaded before instantiating this class.
         * For example:
         *
         *     CLI.define('Mother', {
         *         requires: ['Child'],
         *         giveBirth: function() {
         *             // we can be sure that child class is available.
         *             return new Child();
         *         }
         *     });
         */
        Class.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {

            CLI.classSystemMonitor && CLI.classSystemMonitor(cls, 'CLI.Loader#loaderPreprocessor', arguments);

            var me = this,
                dependencies = [],
                dependency,
                className = Manager.getName(cls),
                i, j, ln, subLn, value, propertyName, propertyValue,
                requiredMap;

            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {

                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {

                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {

                        dependencies.push(propertyValue);

                    } else if (propertyValue instanceof Array) {

                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {

                            value = propertyValue[j];

                            if (typeof value == 'string') {

                                dependencies.push(value);

                            }

                        }

                    } else if (typeof propertyValue != 'function') {

                        for (j in propertyValue) {

                            if (propertyValue.hasOwnProperty(j)) {

                                value = propertyValue[j];

                                if (typeof value == 'string') {

                                    dependencies.push(value);

                                }

                            }

                        }

                    }

                }

            }

            if (dependencies.length === 0) {

                return;

            }

            if (className) {

                _requiresMap[className] = dependencies;

            }

            var deadlockPath = [],
                detectDeadlock;

            if (className) {

                requiredMap = Loader.requiredByMap || (Loader.requiredByMap = {});

                for (i = 0,ln = dependencies.length; i < ln; i++) {

                    dependency = dependencies[i];
                    (requiredMap[dependency] || (requiredMap[dependency] = [])).push(className);

                }

                detectDeadlock = function(cls) {

                    deadlockPath.push(cls);

                    if (_requiresMap[cls]) {

                        if (CLI.Array.contains(_requiresMap[cls], className)) {
                            CLI.Error.raise("Circular requirement detected! '" + className +
                                            "' and '" + deadlockPath[1] + "' mutually require each other. Path: " +
                                            deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                        }

                        for (i = 0,ln = _requiresMap[cls].length; i < ln; i++) {
                            detectDeadlock(_requiresMap[cls][i]);
                        }
                    }
                };

                detectDeadlock(className);
            }

            (className ? Loader.exclude(className) : Loader).require(dependencies, function() {

                for (i = 0,ln = dependencyProperties.length; i < ln; i++) {

                    propertyName = dependencyProperties[i];

                    if (data.hasOwnProperty(propertyName)) {

                        propertyValue = data[propertyName];

                        if (typeof propertyValue == 'string') {

                            data[propertyName] = Manager.get(propertyValue);

                        } else if (propertyValue instanceof Array) {

                            for (j = 0, subLn = propertyValue.length; j < subLn; j++) {

                                value = propertyValue[j];

                                if (typeof value == 'string') {

                                    data[propertyName][j] = Manager.get(value);

                                }

                            }

                        } else if (typeof propertyValue != 'function') {

                            for (var k in propertyValue) {

                                if (propertyValue.hasOwnProperty(k)) {

                                    value = propertyValue[k];

                                    if (typeof value == 'string') {

                                        data[propertyName][k] = Manager.get(value);

                                    }
                                }

                            }

                        }

                    }

                }

                continueFn.call(me, cls, data, hooks);

            });

            return false;

        }, true, 'after', 'className');

        // }}}
        // {{{ uses

        /**
         * @cfg {String[]} uses
         * @member CLI.Class
         * List of optional classes to load together with this class. These aren't neccessarily loaded before
         * this class is created, but are guaranteed to be available before CLI.onReady listeners are
         * invoked. For example:
         *
         *     CLI.define('Mother', {
         *         uses: ['Child'],
         *         giveBirth: function() {
         *             // This code might, or might not work:
         *             // return new Child();
         *
         *             // Instead use CLI.create() to load the class at the spot if not loaded already:
         *             return CLI.create('Child');
         *         }
         *     });
         */
        Manager.registerPostprocessor('uses', function(name, cls, data) {

            CLI.classSystemMonitor && CLI.classSystemMonitor(cls, 'CLI.Loader#usesPostprocessor', arguments);

            var manifest = CLI.manifest,
                loadOrder = manifest && manifest.loadOrder,
                classes = manifest && manifest.classes,
                uses, clazz, item, len, i, indexMap;

            if (loadOrder) {

                clazz = classes[name];

                if (clazz && !isNaN(i = clazz.idx)) {

                    item = loadOrder[i];
                    uses = item.uses;
                    indexMap = {};

                    for (len = uses.length, i = 0; i < len; i++) {

                        indexMap[uses[i]] = true;

                    }

                    if (uses.length > 0) {

                        Loader.loadScripts({
                            url: uses,
                            sequential: true
                        });

                    }

                }

            }

            if (data.uses) {

                uses = data.uses;
                Loader.addUsedClasses(uses);

            }

        });

        // }}}

        Manager.onCreated(Loader.historyPush);

    };

    // }}}

    CLI._endTime = new Date().getTime();

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
