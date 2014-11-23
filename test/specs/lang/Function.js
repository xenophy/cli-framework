/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI.Function

describe("CLI.Function", function() {

    // {{{ before

    before(function() {

        // require CLI
        require('../../../index.js');

    });

    // }}}
    // {{{ flexSetter

    describe('flexSetter', function() {

        it('should get can specify key and value function', function() {

            var cnt = 1;
            var f = CLI.Function.flexSetter(function(key, v) {

                assert.equal(key, 'key' + cnt);
                assert.equal(v, 'v' + cnt);

                cnt++;
            });

            var o = {key1: 'v1', key2: 'v2'};

            f(o);

        });

        it('should can specify null but function is not work.', function() {

            var ret = false;
            var f = CLI.Function.flexSetter(function(key, v) {
                ret = true;
            });

            f(null);

            assert.equal(ret, false);
        });

        it('shoud can specify primitive values', function() {

            var ret = '';
            var f = CLI.Function.flexSetter(function(key, v) {
                ret = key + ':' + v;
            });

            f('hoge', 'foo');

            assert.equal(ret, 'hoge:foo');
        });

    });

    // }}}

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
