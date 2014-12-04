/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ helper

require('../../helper.js');

// }}}
// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ sinon

var sinon = require('sinon');

// }}}
// {{{ CLI.Loader

describe("CLI.Loader", function() {

    var Loader = CLI.Loader,
        app    = CLI.app;

    it("should set single namespace with setPath call", function() {

        Loader.setPath('CLILoaderTestNamespace1', '/foo1');

        assert.equal(Loader.getPath('CLILoaderTestNamespace1'), '/foo1');
        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo.Bar'), 'CLILoaderTestNamespace1');

    });

    it("should set multiple namespaces with setPath call", function() {

        Loader.setPath({
            CLILoaderTestNamespace2: '/foo2',
            CLILoaderTestNamespace3: '/foo3'
        });

        assert.equal(app.getNamespace('CLILoaderTestNamespace2.foo.Bar'), 'CLILoaderTestNamespace2');
        assert.equal(app.getNamespace('CLILoaderTestNamespace3.foo.Bar'), 'CLILoaderTestNamespace3');
    });

    it("should set namespaces with setConfig object", function() {

        Loader.setConfig({
            paths: {
                CLILoaderTestNamespace4: '/foo4'
            }
        });

        assert.equal(app.getNamespace('CLILoaderTestNamespace4.foo.Bar'), 'CLILoaderTestNamespace4');

    });

    it("should set namespaces with setConfig name/value pair", function() {

        Loader.setConfig('paths', {
            CLILoaderTestNamespace5: '/foo5'
        });

        assert.equal(app.getNamespace('CLILoaderTestNamespace5.foo.Bar'), 'CLILoaderTestNamespace5');

    });

    it("should allow nested namespaces 1", function() {

        Loader.setPath({
            'CLILoaderTestNamespace1.foo': '/foobar1'
        });

        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo.Bar'), 'CLILoaderTestNamespace1.foo');
    });

    it("should allow nested namespaces 2", function() {

        Loader.setPath({
            'CLILoaderTestNamespace1.foo.Bar': '/foobaroo1'
        });

        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo.Bar.Baz'), 'CLILoaderTestNamespace1.foo.Bar');
    });

    it("should clean up namespaces (not a test)", function() {

        var paths = Loader.config.paths;

        delete paths.CLILoaderTestNamespace1;
        delete paths['CLILoaderTestNamespace1.foo'];
        delete paths['CLILoaderTestNamespace1.foo.Bar'];
        delete paths['CLILoaderTestNamespace1.foo.Bar.Baz'];
        delete paths.CLILoaderTestNamespace2;
        delete paths.CLILoaderTestNamespace3;
        delete paths.CLILoaderTestNamespace4;
        delete paths.CLILoaderTestNamespace5;

        app.clearNamespaces();

        assert.equal(app.getNamespace('CLILoaderTestNamespace1'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo.Bar'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace1.foo.Bar.Baz'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace2'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace3'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace4'), undefined);
        assert.equal(app.getNamespace('CLILoaderTestNamespace5'), undefined);

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
