/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint -W053 */

/**
 * This file is part of CLI Framework
 */

// define CLI
var CLI = CLI || {};

// get start time
CLI._startTime = Date.now ? Date.now() : (+ new Date());

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
        // {{{ identityFn

        identityFn: identityFn,

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
    // {{{ append CLI Utils

    require('./Util.js');

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */