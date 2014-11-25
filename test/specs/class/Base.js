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
// {{{ CLI.Base

describe("CLI.Base", function() {

    var cls;

    // {{{ before

    before(function() {

        // require CLI
        require('../../../index.js');

    });

    // }}}
    // {{{ afterEach

    afterEach(function() {
        cls = null;
    });

    // }}}
    // {{{ deprecated

    describe("deprecated", function() {

        afterEach(function() {
            delete CLI.versions.foo;
            delete CLI.compatVersions.foo;
        });

        function declareClass(compatVersion) {

            CLI.setCompatVersion('foo', compatVersion);

            cls = CLI.define(null, {

                foo: function () {
                    return 'a';
                },

                deprecated: {
                    name: 'foo',
                    5: {
                        methods: {
                            bar: 'foo',
                            foo: function () {
                                return this.callParent() + 'd';
                            }
                        }
                    },

                    5.1: {
                        methods: {
                            foo: {
                                fn: function () {
                                    return this.callParent() + 'c';
                                }
                            }
                        }
                    },

                    '5.2': {
                        methods: {
                            foo: {
                                message: 'Foo is bad',
                                fn: function () {
                                    return this.callParent() + 'b';
                                }
                            }
                        }
                    }
                }

            });

        };

        // {{{ no backward compatibility

        describe('no backward compatibility', function () {

            beforeEach(function () {
                declareClass('5.2');
            });

            it("should not activate methods when compatVersion equals curVersion", function() {

                var obj = new cls();
                var s = obj.foo();

                assert.equal(s, 'a');

            });

            it("should install error shim from old block", function() {

                var obj = new cls();
                var s = 'No exception';

                beginSilent();
                try {
                    console.dir(obj);
                    obj.bar();
                } catch (e) {
                    s = e.message;
                }
                endSilent();

                assert.equal(s, '"#bar" is deprecated. Please use "foo" instead.');

            });

        });

        // }}}
        // {{{ one increment of backward compatibility

        describe('one increment of backward compatibility', function () {

            beforeEach(function () {
                declareClass('5.1');
            });

            it("should activate just one block", function() {

                var obj = new cls();
                var s = obj.foo();

                assert.equal(s, 'ab');

            });

            it("should install error shim from old block", function() {

                var obj = new cls();
                var s = 'No exception';

                beginSilent();
                try {
                    obj.bar();
                } catch (e) {
                    s = e.message;
                }
                endSilent();

                assert.equal(s, '"#bar" is deprecated. Please use "foo" instead.');

            });

        });

        // }}}
        // {{{ two increments of backward compatibility

        describe('two increments of backward compatibility', function () {

            beforeEach(function () {
                declareClass('5');
            });

            it("should activate just two blocks", function() {

                var obj = new cls();
                var s = obj.foo();

                assert.equal(s, 'abc');

            });

            it("should install error shim from old block", function() {

                var obj = new cls();
                var s = 'No exception';

                beginSilent();
                try {
                    obj.bar();
                } catch (e) {
                    s = e.message;
                }
                endSilent();

                assert.equal(s, '"#bar" is deprecated. Please use "foo" instead.');

            });

        });

        // }}}
        // {{{ full backward compatibility

        describe('full backward compatibility', function () {

            beforeEach(function () {
                declareClass('4.2');
            });

            it("should activate all three blocks", function() {

                var obj = new cls();
                var s = obj.foo();

                assert.equal(s, 'abcd');

            });

            it("should install alias", function() {

                var obj = new cls();
                var s = obj.bar();

                assert.equal(s, 'abcd');

            });

        });

        // }}}

    });

    // }}}
    // {{{ borrow

    describe("borrow", function() {

        beforeEach(function() {

            CLI.define("spec.Foo", {
                a: function() {
                    return 'foo a';
                },
                b: function() {
                    return 'foo b';
                },
                c: function() {
                    return 'foo c';
                }
            });

            CLI.define("spec.Bar", {
                a: function() {
                    return 'bar a';
                }
            });

        });

        afterEach(function() {
            CLI.undefine('spec.Foo');
            CLI.undefine('spec.Bar');
        });

        it("should borrow methods", function() {

            spec.Bar.borrow(spec.Foo, ['b', 'c']);

            var bar = new spec.Bar();

            assert.equal(bar.a(), 'bar a');
            assert.equal(bar.b(), 'foo b');
            assert.equal(bar.c(), 'foo c');
        });

    });

    // }}}
    // {{{ createAlias

    describe("createAlias", function() {

        var o;

        function makeCls(fn, name) {
            var o = {};
            o[name || 'oldFn'] = fn;
            cls = CLI.define(null, o);
        }

        afterEach(function() {
            o = null;
        });

        it("should create a method on the prototype", function() {

            makeCls(function(){});
            cls.createAlias('newFn', 'oldFn');

            assert.equal(CLI.isFunction(cls.prototype.newFn), true);
        });

        it("should call through to the old method with the passed arguments", function() {

            var a, b;

            makeCls(function(arg1, arg2) {
                a = arg1;
                b = arg2;
            });

            cls.createAlias('newFn', 'oldFn');

            o = new cls();
            o.newFn('Val', 17);

            assert.equal(a, 'Val');
            assert.equal(b, 17);

        });

        it("should dynamically resolve the old method at runtime", function() {

            var values = [];

            makeCls(function() {
                values.push(1);
            });

            cls.createAlias('newFn', 'oldFn');

            o = new cls();
            o.newFn();

            cls.override({
                oldFn: function() {
                    values.push(2);
                }
            });
            o.newFn();

            o.oldFn = function() {
                values.push(3);
            };

            o.newFn();

            assert.deepEqual(values, [1, 2, 3]);
        });

    });

    // }}}
    // {{{ override

    describe("override", function() {

        // {{{ mixins

        describe("mixins", function() {

            var aFn, bFn;

            beforeEach(function() {

                aFn = function() {};
                bFn = function() {};

                CLI.define('spec.Mix1', {
                    extend: 'CLI.Mixin',
                    mixinConfig: {
                        id: 'mix1'
                    },

                    a: aFn
                });

                CLI.define('spec.Mix2', {
                    extend: 'CLI.Mixin',
                    mixinConfig: {
                        id: 'mix2'
                    },

                    b: bFn
                });

            });

            afterEach(function() {
                aFn = bFn = null;
                CLI.undefine('spec.Mix1');
                CLI.undefine('spec.Mix2');
                CLI.undefine('spec.MyBase');
            });

            it("should add mixins on a class without mixins", function() {

                cls = CLI.define('spec.MyBase', {
                });

                CLI.define(null, {
                    override: 'spec.MyBase',
                    mixins : ['spec.Mix1']
                });

                assert.equal(cls.prototype.a, aFn);
                assert.equal(cls.prototype.mixins.mix1, spec.Mix1.prototype);
            });

            it("should add mixins on a class with existing mixins", function() {

                cls = CLI.define('spec.MyBase', {
                    mixins: ['spec.Mix1']
                });

                CLI.define(null, {
                    override: 'spec.MyBase',
                    mixins : ['spec.Mix2']
                });

                assert.equal(cls.prototype.a, aFn);
                assert.equal(cls.prototype.mixins.mix1, spec.Mix1.prototype);

                assert.equal(cls.prototype.b, bFn);
                assert.equal(cls.prototype.mixins.mix2, spec.Mix2.prototype);
            });

            it("should add mixins when the type differs", function() {

                cls = CLI.define('spec.MyBase', {
                    mixins: {
                        mixFoo: 'spec.Mix1'
                    }
                });

                CLI.define(null, {
                    override: 'spec.MyBase',
                    mixins : ['spec.Mix2']
                });

                assert.equal(cls.prototype.a, aFn);
                assert.equal(cls.prototype.mixins.mixFoo, spec.Mix1.prototype);

                assert.equal(cls.prototype.b, bFn);
                assert.equal(cls.prototype.mixins.mix2, spec.Mix2.prototype);
            });

        });

        // }}}

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
