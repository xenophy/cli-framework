/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

(function() {

    var ansi    = require('ansi');
    var ansies  = require("ansi-escape-sequences");
    var colors  = require('colors/safe');

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

            ansies: 'ansies',

            // }}}
            // {{{ ansi

            ansi: 'ansi'

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

        ansies: ansies,

        // }}}
        // {{{ ansi

        ansi: {

            // {{{ bold

            bold: function(text) {

                var me  = this,
                    f   = CLI.String.format;

                return f('{0}{2}{1}', ansies.bold, ansies.reset, text);

            },

            // }}}
            // {{{ underline

            underline: function(text) {

                var me  = this,
                    f   = CLI.String.format;

                return f('{0}{2}{1}', ansies.underline, ansies.reset, text);

            }

            // }}}

        }

        // ]}}

    });

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
