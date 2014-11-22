/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

// define CLI
var CLI = CLI || {};

// get start time
CLI._startTime = Date.now ? Date.now() : (+ new Date());

(function() {

    "use strict";

    var emptyFn = function () {};

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
    // {{{ set CLI class instance to global

    global.CLI = module.exports = CLI;

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
