/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

(function() {

    "use strict";

    // {{{ CLI.JSON

    /**
     * Modified version of [Douglas Crockford's JSON.js][dc] that doesn't
     * mess with the Object prototype.
     *
     * [dc]: http://www.json.org/js.html
     *
     * @class CLI.JSON
     * @singleton
     */
    CLI.JSON = (new(function() {

        var me = this;

        // {{{ encode

        /**
         * Encodes an Object, Array or other value.
         *
         * @param {Object} o The variable to encode.
         * @return {String} The JSON string.
         */
        me.encode = function(o) {
            return JSON.stringify(o);
        };

        // }}}
        // {{{ decode

        /**
         * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws
         * a SyntaxError unless the safe option is set.
         *
         * @param {String} json The JSON string.
         * @param {Boolean} [safe=false] `true` to return null, otherwise throw an exception
         * if the JSON is invalid.
         * @return {Object} The resulting object.
         */
        me.decode = function(json, safe) {

            try {
                return JSON.parse(json);
            } catch (e) {

                if (safe) {
                    return null;
                }

                CLI.Error.raise({
                    sourceClass: "CLI.JSON",
                    sourceMethod: "decode",
                    msg: "You're trying to decode an invalid JSON String: " + json
                });
            }

        };

        // }}}

        if (!CLI.util) {
            CLI.util = {};
        }

        // {{{ CLI.util.JSON

        CLI.util.JSON = me;

        // }}}
        // {{{ CLI.encode

        /**
         * Shorthand for {@link CLI.JSON#encode}
         * @member CLI
         * @method encode
         * @inheritdoc CLI.JSON#encode
         */
        CLI.encode = me.encode;

        // }}}
        // {{{ CLI.decode

        /**
         * Shorthand for {@link CLI.JSON#decode}
         * @member CLI
         * @method decode
         * @inheritdoc CLI.JSON#decode
         */
        CLI.decode = me.decode;

        // }}}

    })());

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
