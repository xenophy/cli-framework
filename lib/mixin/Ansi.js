/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */
CLI.define('CLI.mixin.Ansi', {

    // {{{ extend

    extend: 'CLI.Mixin',

    // }}}
    // {{{ mixinConfig

    mixinConfig: {
        cursor: 'cursor'
    },

    // }}}
    // {{{ cursor

    cursor: (function() {

        var ansi = require('ansi'),
            cursor = ansi(process.stdout);

        return cursor;

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
