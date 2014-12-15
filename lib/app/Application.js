/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.app.Application
 *
 */
CLI.define('CLI.app.Application', {

    // {{{ requires

    requires: [
        'CLI.app.Util'
    ],

    // }}}
    // {{{ mixins

    mixins: [
        'CLI.mixin.Observable',
        'CLI.mixin.Ansi',
        'CLI.mixin.Progress'
    ],

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

        /**
         * @cfg {String} appProperty
         * The name of a property to be assigned to the main namespace to gain a reference to
         * this application. Can be set to an empty value to prevent the reference from
         * being created
         *
         *     CLI.application({
         *         name: 'MyApp',
         *         appProperty: 'myProp',
         *
         *         launch: function() {
         *             console.log(MyApp.myProp === this);
         *         }
         *     });
         */
        appProperty: 'app',

        /**
         * @cfg {Boolean} autoRouting
         */
        autoRouting: true,

        /**
         * @cfg {String} routeMainName
         */
        routeMainName: 'main',

        /**
         * @cfg {String} routeHelpName
         */
        routeHelpName: 'help'

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

        me.initNamespace();
        me.onBeforeLaunch();

        if(me.getAutoRouting()) {
            me.route();
        }

    },

    // }}}
    // {{{ launch

    launch: CLI.emptyFn,

    // }}}
    // {{{ initNamespace

    initNamespace: function() {

        var me = this,
            appProperty = me.getAppProperty(),
            ns;

        ns = CLI.namespace(me.getName());

        if (ns) {

            ns.getApplication = function() {
                return me;
            };

            if (appProperty) {

                if (!ns[appProperty]) {

                    ns[appProperty] = me;

                } else if (ns[appProperty] !== me) {

                    CLI.log.warn('An existing reference is being overwritten for ' + me.getName() + '.' + appProperty + '. See the appProperty config.');

                }

            }

        }
    },

    // }}}
    // {{{ onBeforeLaunch

    /**
     * @private
     */
    onBeforeLaunch: function() {

        var me = this;

        me.launch.call(me.scope || me);
        me.launched = true;
        me.fireEvent('launch', me);

    },

    // }}}
    // {{{ onRoutingError

    onRoutingError: CLI.emptyFn,

    // }}}
    // {{{ route

    /**
     * @private
     */
    route: function() {

        var me          = this,
            argv        = require('optimist').argv,
            _           = argv['_'],
            f           = CLI.String.format,
            splice      = CLI.Array.splice,
            clone       = CLI.Array.clone,
            cap         = CLI.String.capitalize,
            helpName    = me.getRouteHelpName(),
            mainName    = me.getRouteMainName(),
            tmp, cmd, cls, routeName;

        try {

            routeName = _[0] || helpName;

            tmp = clone(_);
            cmd = clone(_);
            if (_.length >= 1 && routeName === helpName) {

                splice(tmp, 0, 1);

            } else {

                routeName = mainName;

            }

            tmp.unshift('controller');

            var args = [];

            CLI.iterate(tmp, function(item) {

                if (cls) {
                    return;
                }

                try {

                    cls = CLI.create(f('{0}.{1}.{2}', me.getName(), tmp.join('.'), cap(routeName)));

                } catch(e) {

                    args.push(tmp.pop());

                }

            });

            if (!cls) {

                me.onRoutingError(cmd);
                me.fireEvent('routingerror', cmd, me);
                return;

            }

            cls.argv = argv;
            cls.run.apply(cls, args.reverse());

        } catch(e) {

            CLI.log(e.stack);

        }

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

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
