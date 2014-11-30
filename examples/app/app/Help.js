/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ MyApp.app.Help

CLI.define('MyApp.app.Help', {

    // {{{ extend

    extend: 'CLI.app.Help',

    // }}}
    // {{{ run

    run: function() {

        CLI.log([
            'MyApp app',
            '',
            '  usage: myapp help app',
            ''
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
