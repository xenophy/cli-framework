/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * This file is part of CLI Framework
 */

// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ CLI

describe("CLI", function() {

    // {{{ before

    before(function(){

        // require CLI
        require('../../index.js');

    });

    // }}}
    // {{{ CLI.global

    describe("CLI.global", function() {

        it("should return the global scope", function() {
            assert(CLI.global === (function(){ return this; }).call());
        });

    });

    // }}}
    // {{{ CLI.apply

    describe("CLI.apply", function() {

        var origin, o;

        beforeEach(function() {

            origin = {
                name: 'value',
                something: 'cool',
                items: [1,2,3],
                method: function() {
                    this.myMethodCalled = true;
                },
                toString: function() {
                    this.myToStringCalled = true;
                }
            };

        });

        it("should copy normal properties", function() {

            CLI.apply(origin, {
                name: 'newName',
                items: [4,5,6],
                otherThing: 'not cool',
                isCool: false
            });

            assert(origin.name === 'newName');
            assert(origin.items[0] === 4);
            assert(origin.items[1] === 5);
            assert(origin.items[2] === 6);
            assert(origin.something === 'cool');
            assert(origin.otherThing === 'not cool');
            assert(origin.isCool === false);
        });

    });

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
