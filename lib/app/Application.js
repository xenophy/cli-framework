/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.app.Application
 *
 */

(function() {

    "use strict";

    // {{{ CLI.app.Application

    CLI.define('CLI.app.Application', {

        // {{{ mixins

        mixins: ['CLI.mixin.Observable'],

        // }}}
        // {{{ config

        /**
         * @cfg {String} appFolder
         * The path to the directory which contains all application's classes.
         * This path will be registered via {@link CLI.Loader#setPath} for the namespace specified
         * in the {@link #name name} config.
         */
        appFolder: 'app',
        // NOTE - this config has to be processed by CLI.application

        config: {

            /**
             * @cfg {String} name
             * The name of your application. This will also be the namespace for your views, controllers
             * models and stores. Don't use spaces or special characters in the name. **Application name
             * is mandatory**.
             */
            name: '',

        },

        // }}}
        // {{{ constructor

        /**
         * Creates new Application.
         * @param {Object} [config] Config object.
         */
        constructor: function(config) {

            var me = this;

            me.mixins.observable.constructor.call(me, config);

            //need to have eventbus property set before we initialize the config
            me.initConfig(config);

            if (CLI.isEmpty(me.getName())) {
                CLI.Error.raise("[CLI.app.Application] Name property is required");
            }

            //me.doInit(me);
            //me.initNamespace();
            me.onBeforeLaunch();

        },

        // }}}
        // {{{ launch

        launch: CLI.emptyFn,

        // }}}
        // {{{ onBeforeLaunch

        /**
         * @private
         */
        onBeforeLaunch: function() {

            var me      = this,
                argv    = require('optimist').argv,
                main, mainClsName, mainCls;

            me.launch.call(me.scope || me);
            me.launched = true;

//            me.fireEvent('launch', me);

            try {


                main = argv._[0] || 'help';

                if (argv._.length >= 1 && main === 'help') {

                    var tmp = CLI.Array.clone(argv._);

                    CLI.Array.splice(tmp, 0, 1);

                    mainClsName = CLI.String.format('{0}.{1}.{2}', me.getName(), tmp.join('.'), CLI.String.capitalize(main));
                    mainCls = CLI.create(mainClsName);

                } else {

                    main = 'Main';

                    var tmp = CLI.Array.clone(argv._);

                    mainClsName = CLI.String.format('{0}.{1}.{2}', me.getName(), tmp.join('.'), CLI.String.capitalize(main));

                    mainCls = CLI.create(mainClsName);

                }

            } catch(e) {

                try {

                    main = 'help';
                    mainClsName = CLI.String.format('{0}.{1}', me.getName(), CLI.String.capitalize(main));
                    mainCls = CLI.create(mainClsName);

                } catch(e) {

                    CLI.Error.raise(CLI.String.format('you should set {0}.{1} class as {2}/{1}.js.', me.getName(), CLI.String.capitalize(main), CLI.Loader.getPath(me.getName())));

                }

            }

            mainCls.run.apply(mainCls, []);

        }

        // }}}

    });

    // }}}
    // {{{ CLI.application

    CLI.application = function(config) {

        var createApp = function (App) {

            CLI.app.Application.instance = new App();

        },
        paths = config.paths,
        ns;

        if (typeof config === "string") {

            CLI.require(config, function() {

                createApp(CLI.ClassManager.get(config));

            });

        } else {

            config = CLI.apply({
                extend: 'CLI.app.Application' // can be replaced by config!
            }, config);

            // We have to process `paths` before creating Application class,
            // or `requires` won't work.
            CLI.Loader.setPath(config.name, config.appFolder || require('path').dirname(require.main.filename) + '/app');

            if (paths) {

                for (ns in paths) {

                    if (paths.hasOwnProperty(ns)) {

                        CLI.Loader.setPath(ns, paths[ns]);

                    }

                }

            }

            config['paths processed'] = true;

            // Let CLI.define do the hard work but don't assign a class name.
            CLI.define(config.name + ".$application", config, function () {
                createApp(this);
            });

        }

    };

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
