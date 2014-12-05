/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.app.Controller
 *
 */
CLI.define('CLI.app.Controller', {

    // {{{ mixins

    mixins: [
        'CLI.mixin.Ansi',
        'CLI.mixin.Progress'
    ],

    // }}}
    // {{{ init

    init: CLI.emptyFn,

    // }}}
    // {{{ getOptions

    getOptions: function() {

        var me      = this,
            args    = me.argv,
            opts    = {};

        CLI.iterate(args, function(key, value) {

            if (key !== '_' && key !== '$0') {
                opts[key] = value;
            }

        });

        return opts;

    },

    // }}}
    // {{{ run

    run: CLI.emptyFn

    // }}}

});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
