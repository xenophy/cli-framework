/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

(function() {

    var ansi    = require('ansi');
    var ansies  = require("ansi-escape-sequences");
    var colors  = require('colors');

    CLI.define('CLI.mixin.Ansi', {

        // {{{ extend

        extend: 'CLI.Mixin',

        // }}}
        // {{{ mixinConfig

        mixinConfig: {

            // {{{ cursor

            cursor: 'cursor',

            // }}}
            // {{{ colors

            colors: 'colors',

            // }}}
            // {{{ ansies

            ansies: 'ansies'

            // }}}

        },

        // }}}
        // {{{ cursor

        cursor: ansi(process.stdout),

        // }}}
        // {{{ colors

        colors: colors,

        // }}}
        // {{{ ansies

        ansies: ansies

        // }}}

    });

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
