/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Base
 *
 * The root of all classes created with {@link CLI#define}.
 *
 * CLI.Base is the building block of all CLI classes. All classes in CLI inherit from CLI.Base.
 * All prototype and static members of this class are inherited by all other classes.
 */

(function() {

    "use strict";

    CLI.Base = (function(flexSetter) {
        // @define CLI.Base
        // @require CLI.Util
        // @require CLI.Version
        // @require CLI.Configurator
        // @uses CLI.ClassManager

        var Base = function(){},
            BasePrototype = Base.prototype;

        CLI.apply(Base, {

            // {{{ $className

            /**
             * @private
             */
            $className: 'CLI.Base',

            // }}}
            // {{{ $isClass

            $isClass: true,

            // }}}

        });

        return Base;

    }(CLI.Function.flexSetter));

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
