/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */
CLI.define('CLI.mixin.Progress', {

    // {{{ extend

    extend: 'CLI.Mixin',

    // }}}
    // {{{ mixinConfig

    mixinConfig: {

        // {{{ progress

        progress: 'progress'

        // }}}

    },

    // }}}
    // {{{ progress

    progress: (function() {

        var ProgressBar = require('progress');

        return function(line, opts) {

            return new ProgressBar(line, opts);

        };

    })()

    // }}}

});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
