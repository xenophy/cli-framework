/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ MyApp.controller.app.build.Help

CLI.define('MyApp.controller.app.build.Help', {

    // {{{ extend

    extend: 'CLI.app.Help',

    // }}}
    // {{{ run

    run: function() {

        CLI.log([
            'MyApp app build',
            '',
            '  usage: myapp help app build',
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
