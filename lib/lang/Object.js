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

    var TemplateClass = function(){};

    var CLIObject = CLI.Object = {

        /**
         * Returns a new object with the given object as the prototype chain. This method is
         * designed to mimic the ECMA standard `Object.create` method and is assigned to that
         * function when it is available.
         * 
         * **NOTE** This method does not support the property definitions capability of the
         * `Object.create` method. Only the first argument is supported.
         * 
         * @param {Object} object The prototype chain for the new object.
         */
        chain: Object.create || function (object) {
            TemplateClass.prototype = object;
            var result = new TemplateClass();
            TemplateClass.prototype = null;
            return result;
        },



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
