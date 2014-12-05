/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ MyApp.app.build.Main

CLI.define('MyApp.app.build.Main', {

    // {{{ extend

    extend: 'CLI.app.Controller',

    // }}}
    // {{{ run

    run: function() {

        var me = this,
            cursor = me.cursor;

        cursor.write('Hello World!')

        CLI.log([
            'Execute app build process.'
        ].join("\n"));

    }

    // }}}

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
