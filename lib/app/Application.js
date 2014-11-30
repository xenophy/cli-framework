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

        mixins: {
            observable: 'CLI.util.Observable'
        },

        // }}}
        // {{{ config

        /**
         * @cfg {String} appFolder
         * The path to the directory which contains all application's classes.
         * This path will be registered via {@link Ext.Loader#setPath} for the namespace specified
         * in the {@link #name name} config.
         */
        appFolder: 'app',
        // NOTE - this config has to be processed by Ext.application

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
        // {{{ init

        init: function() {

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

            var me = this;

            me.launch.call(me.scope || me);
            me.launched = true;
//            me.fireEvent('launch', me);

        }

        // }}}

    });

    // }}}
    // {{{ CLI.application

    CLI.application = function(config) {

        var createApp = function (App) {

            CLI.app.Application.instance = new App();
            CLI.app.Application.instance.init();

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
