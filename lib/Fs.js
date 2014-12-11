/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */
CLI.define('CLI.Fs', {

    // {{{ singleton

    singleton: true,

    // }}}
    // {{{ copy

    copy: function(src, dest, callback) {

        var me      = this,
            fs      = require('fs-extra');

        fs.copy(src, dest, function(err) {
            callback(err);
        });

    },

    // }}}
    // {{{ remove

    remove: function(target, callback) {

        var me      = this,
            fs      = require('fs-extra');

        fs.remove(target, function(err) {
            callback(err);
        });

    }

    // }}}

});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
