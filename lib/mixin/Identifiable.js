/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * An Identifiable mixin.
 * @private
 */
CLI.define('CLI.mixin.Identifiable', {

    // {{{ statics

    statics: {
        uniqueIds: {}
    },

    // }}}
    // {{{ isIdentifiable

    isIdentifiable: true,

    // }}}
    // {{{ mixinId

    mixinId: 'identifiable',

    // }}}
    // {{{ idCleanRegex

    idCleanRegex: /\.|[^\w\-]/g,

    // }}}
    // {{{ defaultIdPrefix

    defaultIdPrefix: 'ext-',

    // }}}
    // {{{ defaultIdSeparator

    defaultIdSeparator: '-',

    // }}}
    // {{{ getOptimizedId

    getOptimizedId: function() {
        return this.id;
    },

    // }}}
    // {{{ getUniqueId

    getUniqueId: function() {

        var id = this.id,
            prototype, separator, xtype, uniqueIds, prefix;

        // Cannot test falsiness. Zero is a valid ID.
        if (!(id || id === 0)) {

            prototype = this.self.prototype;
            separator = this.defaultIdSeparator;

            uniqueIds = CLI.mixin.Identifiable.uniqueIds;

            if (!prototype.hasOwnProperty('identifiablePrefix')) {

                xtype = this.xtype;

                if (xtype) {

                    prefix = this.defaultIdPrefix + xtype.replace(this.idCleanRegex, separator) + separator;

                } else if (!(prefix = prototype.$className)) {

                    prefix = this.defaultIdPrefix + 'anonymous' + separator;

                } else {

                    prefix = prefix.replace(this.idCleanRegex, separator).toLowerCase() + separator;

                }

                prototype.identifiablePrefix = prefix;
            }

            prefix = this.identifiablePrefix;

            if (!uniqueIds.hasOwnProperty(prefix)) {

                uniqueIds[prefix] = 0;

            }

            id = this.id = prefix + (++uniqueIds[prefix]);

        }

        this.getUniqueId = this.getOptimizedId;

        return id;
    },

    // }}}
    // {{{ setId

    setId: function(id) {

        this.id = id;

    },

    // }}}
    // {{{ getId

    /**
     * Retrieves the id of this component. Will autogenerate an id if one has not already been set.
     * @return {String} id
     */
    getId: function() {

        var id = this.id;

        if (!id) {

            id = this.getUniqueId();

        }

        this.getId = this.getOptimizedId;

        return id;
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
