/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint -W053 */

/**
 * This file is part of CLI Framework
 */

// define CLI
var CLI = CLI || {};

// get start time
CLI._startTime = Date.now();

(function() {

    "use strict";

    var emptyFn     = function () {},
        privateFn   = function () {};

    emptyFn.$nullFn = emptyFn.$emptyFn = privateFn.$nullFn = true;
    privateFn.$privacy = 'framework';

    // set global object
    CLI.global = global;

    // {{{ apply

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

        emptyFn: emptyFn,

        // }}}
        // {{{ privateFn

        privateFn: privateFn,

        // }}}
        // {{{ frameworkStartTime

        frameStartTime: CLI._startTime,

        // }}}
        // {{{ emptyString

        emptyString: new String()

        // }}}

    });

    // }}}
    // {{{ set CLI class instance to global

    global.CLI = module.exports = CLI;

    // }}}
    // {{{ append CLI methods and define classes

    [
        './Util.js',
        './lang/Array.js',
        './lang/Date.js',
        './lang/Function.js',
        './lang/Number.js',
        './lang/Object.js',
        './lang/String.js',
        './class/Base.js',
        './class/Class.js',
        './class/ClassManager.js',
        './class/Config.js',
        './class/Configurator.js',
        './class/Inventory.js',
        './class/Loader.js',
        './class/Mixin.js'

    ].forEach(function(file) {
        require(file);
    });

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
