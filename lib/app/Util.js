/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @private 
 * @class CLI.app.Util
 */
CLI.define('CLI.app.Util', {
}, function() {

    // {{{ CLI.app

    CLI.apply(CLI.app, {

        // {{{ namespace

        namespaces: {
            CLI: {}
        },

        // }}}
        // {{{ addNamespaces

        /**
         * Adds namespace(s) to known list.
         * @private
         *
         * @param {String/String[]} namespace
         */
        addNamespaces: function(namespace) {

            var namespaces = CLI.app.namespaces,
                i, l;

            if (!CLI.isArray(namespace)) {

                namespace = [namespace];

            }

            for (i = 0, l = namespace.length; i < l; i++) {

                namespaces[namespace[i]] = true;

            }

        },

        // }}}
        // {{{ addNamespaces

        /**
         * @private Clear all namespaces from known list.
         */
        clearNamespaces: function() {
            CLI.app.namespaces = {};
        },

        // }}}
        // {{{ getNamespace

        /**
         * Get namespace prefix for a class name.
         * @private
         *
         * @param {String} className
         *
         * @return {String} Namespace prefix if it's known, otherwise undefined
         */
        getNamespace: function(className) {

            var namespaces    = CLI.apply({}, CLI.ClassManager.paths, CLI.app.namespaces),
                deepestPrefix = '',
                prefix;

            for (prefix in namespaces) {

                if (namespaces.hasOwnProperty(prefix)    &&

                    prefix.length > deepestPrefix.length &&
                    (prefix + '.' === className.substring(0, prefix.length + 1))) {
                    deepestPrefix = prefix;

                }

            }

            return deepestPrefix === '' ? undefined : deepestPrefix;
        }

        // }}}

    });

    // }}}

});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
