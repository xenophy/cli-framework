/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Object
 * @singleton
 */

(function() {

    "use strict";

    var CLIObject = CLI.Object = {

        // {{{ each

        each: function(object, fn, scope) {

            var i, property;

            scope = scope || object;

            for (property in object) {

                if (object.hasOwnProperty(property)) {

                    if (fn.call(scope, property, object[property], object) === false) {

                        return;

                    }

                }

            }

        },

        // }}}

    };

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
