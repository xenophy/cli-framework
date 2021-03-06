/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint -W053 */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI
 * @singleton
 */

// define CLI
var CLI = CLI || {};

// get start time
CLI._startTime = Date.now();

(function() {

    "use strict";

    var emptyFn     = function () {},
        privateFn   = function () {},
        identityFn  = function(o) { return o; };

    emptyFn.$nullFn = identityFn.$nullFn = emptyFn.$emptyFn = identityFn.$identityFn = privateFn.$nullFn = true;
    privateFn.$privacy = 'framework';

    // set global object
    CLI.global = global;

    // {{{ apply

    /**
     * Copies all the properties of `config` to the specified `object`. There are two levels
     * of defaulting supported:
     * 
     *      CLI.apply(obj, { a: 1 }, { a: 2 });
     *      //obj.a === 1
     * 
     *      CLI.apply(obj, {  }, { a: 2 });
     *      //obj.a === 2
     * 
     * Note that if recursive merging and cloning without referencing the original objects
     * or arrays is needed, use {@link CLI.Object#merge} instead.
     * 
     * @param {Object} object The receiver of the properties.
     * @param {Object} config The primary source of the properties.
     * @param {Object} [defaults] An object that will also be applied for default values.
     * @return {Object} returns `object`.
     */
    CLI.apply = function(object, config, defaults) {

        if (defaults) {
            CLI.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {

            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

        }

        return object;
    };

    // }}}
    // {{{ define CLI class

    CLI.apply(CLI, {

        // {{{ emptyFn

        /**
         * @property {Function}
         * A reusable empty function.
         */
        emptyFn: emptyFn,

        // }}}
        // {{{ identityFn

        /**
         * @property {Function}
         * A reusable identity function that simply returns its first argument.
         */
        identityFn: identityFn,

        // }}}
        // {{{ $eventNameMap

        /**
         * @property {Object} $eventNameMap
         * A map of event names which contained the lower-cased verions of any mixed
         * case event names.
         * @private
         */
        $eventNameMap: {},

        // }}}
        // {{{ privateFn

        /**
         * @property {Function}
         * A reusable empty function for use as `privates` members.
         *
         *      CLI.define('MyClass', {
         *          nothing: CLI.emptyFn,
         *
         *          privates: {
         *              privateNothing: CLI.privateFn
         *          }
         *      });
         *
         */
        privateFn: privateFn,

        // }}}
        // {{{ emptyString

        /**
         * A zero length string which will pass a truth test. Useful for passing to methods
         * which use a truth test to reject <i>falsy</i> values where a string value must be cleared.
         */
        emptyString: new String()

        // }}}

    });

    // }}}
    // {{{ set CLI class instance to global

    global.CLI = module.exports = CLI;

    // }}}
    // {{{ load package.json and set to manifest

    CLI.manifest = JSON.parse(require('fs').readFileSync(__dirname + '/../package.json').toString('utf8'));

    // }}}
    // {{{ append CLI methods and define classes

    [
        './Util.js',
        './JSON.js',
        './util/Version.js',
        './lang/Array.js',
        './lang/Assert.js',
        './lang/Error.js',
        './lang/Date.js',
        './lang/Function.js',
        './lang/Number.js',
        './lang/Object.js',
        './lang/String.js',
        './class/Config.js',
        './class/Configurator.js',
        './class/Base.js',
        './class/Class.js',
        './class/Inventory.js',
        './class/ClassManager.js',
        './class/Mixin.js',
        './class/Loader.js'

    ].forEach(function(file) {
        require(file);
    });

    CLI.require([
        'CLI.Fs',
        'CLI.Template',
        'CLI.mixin.Observable',
        'CLI.app.Application'
    ]);

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
