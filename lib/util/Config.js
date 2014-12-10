/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ CLI.util.Config

CLI.define('CLI.util.Config', {

    // {{{ config

    config: {

        // {{{ params

        params: [],

        // }}}
        // {{{ filepath

        filepath: require('path').resolve(require('path').join(process.env[CLI.isWindows ? 'USERPROFILE' : 'HOME'])),

        // }}}
        // {{{ filename

        filename: '.clicfg.json'

        // }}}

    },

    // }}}
    // {{{ privates

    privates: {

        // {{{ udpate

        update: function(config) {

            config = config || {};

            var me  = this,
                fs  = require('fs'),
                t   = me.getFileFullPath();

            if (!fs.existsSync(t)) {

                fs.writeFileSync(t, CLI.encode({}, null, '  '));
                fs.chmodSync(t, 0600);

            }

            CLI.applyIf(config, CLI.decode(fs.readFileSync(t).toString()));
            fs.writeFileSync(t, CLI.encode(config, null, '  '));

        }

        // }}}

    },

    // }}}
    // {{{ constructor

    constructor: function(config) {

        var me  = this,
            cap = CLI.String.capitalize;

        me.initConfig(config);
        me.callParent(arguments);

        CLI.iterate(me.getParams(), function(param) {

            me['set' + cap(param)] = CLI.Function.createSequence(me.init, function(token) {

                var o = {};

                o[param] = token;

                this.update(o);

            });

        });

    },

    // }}}
    // {{{ init

    init: function() {

        // ファイル初期化
        this.update({});

    },

    // }}}
    // {{{ getFileFullPath

    getFileFullPath: function() {

        var me      = this,
            fs      = require('fs'),
            path    = require('path');

        return path.resolve(path.join(me.getFilepath(), me.getFilename()));

    },

    // }}}
    // {{{ getValues

    getValues: function() {

        var me  = this,
            fs  = require('fs'),
            t   = me.getFileFullPath();

        // ファイル初期化
        me.update({});

        return CLI.applyIf({}, CLI.decode(fs.readFileSync(t).toString()));

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
