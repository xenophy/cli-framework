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
// {{{ require CLI

require('../../../index.js');

// }}}
// {{{ sinon

var sinon = require('sinon');

// }}}
// {{{ CLI.Class

describe("CLI.Class", function() {

    var emptyFn = function(){},
        defaultInitConfig = function(config) {
            this.initConfig(config);
        },
        cls, sub, fn, subClass, parentClass, mixinClass1, mixinClass2, o;

    beforeEach(function() {

        fn = function(){};

        mixinClass1 = CLI.define(null, {

            config: {
                mixinConfig: 'mixinConfig'
            },

            constructor: function(config) {

                this.initConfig(config);

                this.mixinConstructor1Called = true;
            },

            mixinProperty1: 'mixinProperty1',

            mixinMethod1: function() {
                this.mixinMethodCalled = true;
            }

        });

        mixinClass2 = CLI.define(null, {

            constructor: function(config) {

                this.initConfig(config);

                this.mixinConstructor2Called = true;

            },

            mixinProperty2: 'mixinProperty2',

            mixinMethod2: function() {

                this.mixinMethodCalled = true;

            }

        });

        parentClass = CLI.define(null, {

            mixins: {

                mixin1: mixinClass1

            },

            config: {

                name: 'parentClass',

                isCool: false,

                members: {

                    abe: 'Abraham Elias',

                    ed: 'Ed Spencer'

                },
                hobbies: ['football', 'bowling']

            },

            constructor: function(config) {

                this.initConfig(config);

                this.parentConstructorCalled = true;

                this.mixins.mixin1.constructor.apply(this, arguments);

            },

            parentProperty: 'parentProperty',

            parentMethod: function() {

                this.parentMethodCalled = true;

            }

        });

        subClass = CLI.define(null, {

            extend: parentClass,

            mixins: {

                mixin1: mixinClass1,

                mixin2: mixinClass2

            },

            config: {

                name: 'subClass',

                isCool: true,

                members: {

                    jacky: 'Jacky Nguyen',

                    tommy: 'Tommy Maintz'

                },

                hobbies: ['sleeping', 'eating', 'movies'],

                isSpecial: true

            },

            constructor: function(config) {

                this.initConfig(config);

                this.subConstructorCalled = true;

                subClass.superclass.constructor.apply(this, arguments);

                this.mixins.mixin2.constructor.apply(this, arguments);

            },

            myOwnMethod: function() {

                this.myOwnMethodCalled = true;

            }

        });

    });

    afterEach(function() {

        o = subClass, parentClass, mixinClass1, mixinClass2 = sub = cls = null;

    });

    // {{{ extend

    describe("extend", function() {

        beforeEach(function() {

            fn = function() {};

            CLI.define('spec.Base', {
                aProp: 1,

                aFn: fn
            });

        });

        afterEach(function() {

            CLI.undefine('spec.Base');

        });

        it("should extend from Base if no 'extend' property found", function() {

            cls = CLI.define(null, {});

            assert.equal((new cls()) instanceof CLI.Base, true);

        });

        describe("extending from a parent", function() {

            it("class reference", function() {

                cls = CLI.define(null, {
                    extend: spec.Base
                });

                assert.equal((new cls()) instanceof spec.Base, true);

            });

            it("class string", function() {

                cls = CLI.define(null, {
                    extend: 'spec.Base'
                });

                assert.equal((new cls()) instanceof spec.Base, true);

            });
        });

        it("should have superclass reference", function() {

            var parentPrototype = spec.Base.prototype;

            cls = CLI.define(null, {
                extend: spec.Base
            });

            assert.equal(cls.superclass, parentPrototype);
            assert.equal((new cls()).superclass, parentPrototype);

        });

        it("should copy properties from the parent", function() {

            cls = CLI.define(null, {
                extend: spec.Base
            });

            assert.equal(cls.prototype.aProp, 1);

        });

        it("should copy functions from the parent", function() {

            cls = CLI.define(null, {
                extend: spec.Base
            });

            assert.equal(cls.prototype.aFn, fn);

        })
    });

    // }}}
    // {{{ config

    describe("config", function() {

        beforeEach(function() {
            fn = function() {};
        });

        // {{{ getter/setter creation

        describe("getter/setter creation", function() {

            it("should create getter if not exists", function() {

                cls = CLI.define(null, {
                    config: {
                        someName: 'someValue'
                    }
                });

                assert.notEqual(cls.prototype.getSomeName, undefined)

            });

            it("should NOT create getter if already exists", function() {

                var cls = CLI.define(null, {
                    getSomeName: fn,
                    config: {
                        someName: 'someValue'
                    }
                });

                assert.equal(cls.prototype.getSomeName, fn);

            });

            it("should create setter if not exists", function() {

                cls = CLI.define(null, {
                    config: {
                        someName: 'someValue'
                    }
                });

                assert.notEqual(cls.prototype.setSomeName, undefined);

            });

            it("should NOT create setter if already exists", function() {

                cls = CLI.define(null, {
                    setSomeName: fn,
                    config: {
                        someName: 'someValue'
                    }
                });

                assert.equal(cls.prototype.setSomeName, fn);

            });

            it("should allow a custom getter to call the generated getter", function() {

                cls = CLI.define(null, {
                    config: {
                        someName: 'foo'
                    },
                    constructor: defaultInitConfig,
                    getSomeName: function() {
                        return this.callParent().toUpperCase();
                    }
                });

                o = new cls();

                assert.equal(o.getSomeName(), 'FOO');

            });

            it("should allow a custom setter to call the generated setter", function() {

                cls = CLI.define(null, {
                    config: {
                        someName: 'foo'
                    },
                    constructor: defaultInitConfig,
                    setSomeName: function(someName) {
                        someName = someName.toUpperCase();
                        return this.callParent([someName]);
                    }
                });

                o = new cls();

                assert.equal(o.getSomeName(), 'FOO');

            });

            it("should not set the value if the applier returns undefined", function() {

                var called = false;

                cls = CLI.define(null, {
                    config: {
                        foo: 1
                    },
                    constructor: defaultInitConfig,
                    applyFoo: function(foo) {
                        if (!called) {
                            called = true;
                            return foo;
                        }
                        return undefined;
                    }
                });

                o = new cls();
                o.setFoo(2);

                assert.equal(o.getFoo(), 1);

            });

            it("should not call the updater if the value does not change", function() {

                var count = 0;

                cls = CLI.define(null, {
                    config: {
                        foo: 1
                    },
                    constructor: defaultInitConfig,
                    updateFoo: function() {
                        ++count;
                    }
                });

                o = new cls();
                o.setFoo(1);

                assert.equal(count, 1);

            });

            it("should check using === to see if the value changed", function() {

                var count = 0;

                cls = CLI.define(null, {
                    config: {
                        foo: 1
                    },
                    constructor: defaultInitConfig,
                    updateFoo: function() {
                        ++count;
                    }
                });

                o = new cls();
                o.setFoo('1');

                assert.equal(count, 2);

            });

            // {{{ when getters are called by other configs' updaters

            describe("when getters are called by other configs' updaters", function() {

                var applyCount, updateCount;

                beforeEach(function() {

                    cls = CLI.define(null, {
                        config: {
                            foo: 1,
                            bar: 2
                        },
                        constructor: defaultInitConfig,
                        updateFoo: function() {
                            // this assumes that the configs are processed in the order
                            // they were defined.  Since we process them using a for/in
                            // loop, we can be reasonably certain foo gets processed
                            // before bar.  Call the getter here means we call it before
                            // the config system does.  This test ensures the config
                            // system does not call getBar() a second time.
                            this.getBar();
                        },
                        applyBar: function(bar) {
                            ++applyCount;
                            return bar;
                        },
                        updateBar: function() {
                            ++updateCount;
                        }
                    });

                });

                it("should only call appliers/updaters once for class configs", function() {

                    applyCount = updateCount = 0;

                    o = new cls();

                    assert.equal(applyCount, 1);
                    assert.equal(updateCount, 1);

                });

                it("should only call appliers/updaters once for instance configs", function() {

                    applyCount = updateCount = 0;

                    o = new cls({
                        foo: 10,
                        bar: 20
                    });

                    assert.equal(applyCount, 1);
                    assert.equal(updateCount, 1);
                });

            });

            // }}}
            // {{{ initialization

            describe("initialization", function() {

                // {{{ default values - no passed config

                describe("default values - no passed config", function() {

                    // {{{ null

                    describe("null", function() {

                        it("should not initialize the config", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: function(config) {

                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, false);

                        });

                        it("should not initialize with a custom setter", function() {

                            var called = false;

                            cls = CLI.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: defaultInitConfig,
                                setFoo: function() {
                                    called = true;
                                }
                            });

                            o = new cls();

                            assert.equal(called, false);
                        });

                        it("should not initialize with an applier", function() {

                            var called = false;

                            cls = CLI.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: defaultInitConfig,
                                applyFoo: function() {
                                    called = true;
                                }
                            });

                            o = new cls();

                            assert.equal(called, false);

                        });

                        it("should not initialize with an updater", function() {

                            var called = false;

                            cls = CLI.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: defaultInitConfig,
                                updateFoo: function() {
                                    called = true;
                                }
                            });
                            o = new cls();

                            assert.equal(called, false);

                        });

                    });

                    // }}}
                    // {{{ other values

                    describe("other values", function() {

                        it("should not call the setter", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: function(config) {
                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, false);

                        });

                        it("should call the setter if there is a custom setter", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: function(config) {
                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                },
                                setFoo: function() {

                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, true);

                        });

                        it("should call the setter if there is an applier", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: function(config) {
                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                },
                                applyFoo: function(foo) {
                                    return foo;
                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, true);

                        });

                        it("should call the setter if there is an updater", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: function(config) {
                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                },
                                setFoo: function() {

                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, true);

                        });

                        it("should call the setter if the value is an object", function() {

                            var itFn;

                            cls = CLI.define(null, {
                                config: {
                                    foo: {}
                                },
                                constructor: function(config) {
                                    itFn = sinon.spy(this, 'setFoo');
                                    this.initConfig(config);
                                }
                            });

                            o = new cls();

                            assert.equal(itFn.called, true);

                        });

                    });

                    // }}}

                });

                // }}}
                // {{{ dependencies

                describe("dependencies", function() {

                    it("should force an initialization if the getter is called during init time for a primitive", function() {

                        var secondVal;

                        cls = CLI.define(null, {
                            config: {
                                first: undefined,
                                second: undefined
                            },
                            constructor: defaultInitConfig,
                            updateFirst: function() {
                                secondVal = this.getSecond();
                            }
                        });

                        new cls({
                            first: 1,
                            second: 2
                        });

                        assert.equal(secondVal, 2);

                    });

                    it("should have a non-config applied by the time any setter is called with non-strict mode", function() {

                        var secondVal;

                        cls = CLI.define(null, {
                            config: {
                                first: undefined
                            },
                            constructor: defaultInitConfig,
                            $configStrict: false,
                            applyFirst: function() {
                                secondVal = this.second;
                            }
                        });

                        new cls({
                            first: 1,
                            second: 2
                        });

                        assert.equal(secondVal, 2);

                    });

                });

                // }}}

            });

            // }}}

        });

        // }}}
        // {{{ get/setConfig

        describe("get/setConfig", function() {

            beforeEach(function() {

                cls = CLI.define(null, {
                    config: {
                        foo: 1,
                        bar: 2
                    },
                    constructor: defaultInitConfig
                });

            });

            // {{{ dependency ordering

            describe('dependency ordering', function () {

                var order;

                function declareClass () {

                    order = [];

                    cls = CLI.define(null, {

                        config: {
                            b: 'bbb',
                            c: 'ccc',
                            a: 'aaa'
                        },

                        constructor: defaultInitConfig,

                        applyA: function (value) {
                            order.push('a=' + value);
                        },
                        applyB: function (value) {
                            this.getA();
                            order.push('b=' + value);
                        },
                        applyC: function (value) {
                            this.getB();
                            order.push('c=' + value);
                        }
                    });

                }

                it('should initialize dependent config first', function () {

                    declareClass();

                    var o = new cls();

                    assert.deepEqual(order, ['a=aaa', 'b=bbb', 'c=ccc']);

                });

                it('should update configs in dependency order', function () {

                    declareClass();

                    var o = new cls();

                    order.length = 0;

                    // Because the objects tend to be enumerated in order of keys
                    // declared, we deliberately put these *not* in the order that
                    // we expect them to be processed. At least in Chrome 33 this
                    // test would fail w/o a fix to setConfig that checks if the
                    // initGetter is still in place and avoid calling setB() twice!
                    // Of course, putting the keys in a,b,c order would pass!
                    o.setConfig({
                        a: 1,
                        c: 3,  // IMPORTANT - not in dependency order!
                        b: 2
                    });

                    assert.deepEqual(order, ['a=1', 'b=2', 'c=3']);

                });

            });

            // }}}
            // {{{ getConfig

            describe("getConfig", function() {

                it("should be able to get a config by name", function() {

                    o = new cls();

                    assert.equal(o.getConfig('bar'), 2);

                });

                it("should return all configs if no name is passed", function() {

                    o = new cls();

                    assert.deepEqual(o.getConfig(), {
                        foo: 1,
                        bar: 2
                    });

                });

                it("should throw an exception when asking for a config name that does not exist", function() {

                    var itFn = sinon.spy(CLI, 'log');

                    o = new cls();

                    assert.throws(function() {
                        o.getConfig('fake');
                    });

                });

                // {{{ peek

                describe("peek", function() {

                    beforeEach(function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    lazy: true,
                                    $value: 120
                                }
                            }
                        });

                    });

                    it("should not call the getter if the initGetter has not yet been called", function() {

                        o = new cls({
                            foo: 1
                        });

                        var itFn = sinon.spy(o, 'getFoo');

                        o.getConfig('foo', true);

                        assert.equal(itFn.called, false);

                    });

                    it("should return the pending value configured on the instance", function() {

                        o = new cls({
                            foo: 1
                        });

                        assert.equal(o.getConfig('foo', true), 1);

                    });

                    it("should return the pending value configured on the class", function() {

                        o = new cls();

                        assert.equal(o.getConfig('foo', true), 120);

                    });

                });

                // }}}

            });

            // }}}
            // {{{ setConfig

            describe("setConfig", function() {

                it("should be able to set a config by name", function() {

                    o = new cls();
                    o.setConfig('foo', 7);

                    assert.equal(o.getFoo(), 7);

                });

                it("should be able to set a group of configs at once", function() {

                    o = new cls();

                    o.setConfig({
                        foo: 6,
                        bar: 8
                    });

                    assert.equal(o.getFoo(), 6);
                    assert.equal(o.getBar(), 8);

                });

                it("should ignore non-config properties with no setter", function() {

                    beginSilent();
                    o = new cls();

                    o.setConfig({
                        foo: 3,
                        baz: 100
                    });

                    assert.equal(o.getFoo(), 3);
                    assert.equal(o.baz, undefined);
                    endSilent();

                });

                it("should call the setter for a non-config property if one exists and $configStrict is false", function() {

                    cls = CLI.define(null, {
                        $configStrict: false,
                        constructor: defaultInitConfig,
                        setBaz: function() {}
                    });

                    o = new cls();

                    var itFn = sinon.spy(o, 'setBaz');

                    o.setConfig({
                        baz: 100
                    });

                    assert.equal(itFn.lastCall.args[0], 100);

                });


                it("should set non-config properties on the instance when the strict option is false and $configStrict is false", function() {

                    cls = CLI.define(null, {
                        $configStrict: false,
                        constructor: defaultInitConfig
                    });

                    o = new cls();

                    o.setConfig('baz', 100, {
                        strict: false
                    });

                    assert.equal(o.baz, 100);

                });

                it("should be able to handle undefined/null configs", function() {

                    o = new cls();

                    assert.doesNotThrow(function() {
                        o.setConfig(null);
                        o.setConfig(undefined);
                    });

                });

                it("should return the current instance", function() {

                    o = new cls();

                    assert.deepEqual(o.setConfig(), o);

                });

            });

            // }}}

        });

        // }}}

        it("should merge properly", function() {

            var obj = new subClass;

            /*
             TODO: check code
            assert.deepEqual(obj.config, {

                mixinConfig: 'mixinConfig',
                name: 'subClass',
                isCool: true,
                members: {
                    abe: 'Abraham Elias',
                    ed: 'Ed Spencer',
                    jacky: 'Jacky Nguyen',
                    tommy: 'Tommy Maintz'
                },
                hobbies: ['sleeping', 'eating', 'movies'],
                isSpecial: true

            });
           */

        });

        it("should apply default config", function() {

            var obj = new subClass;

            assert.equal(obj.getName(), 'subClass');
            assert.equal(obj.getIsCool(), true);
            assert.deepEqual(obj.getHobbies(), ['sleeping', 'eating', 'movies']);

        });

        it("should apply with supplied config", function() {

            var obj = new subClass({
                name: 'newName',
                isCool: false,
                members: {
                    aaron: 'Aaron Conran'
                }
            });

            assert.equal(obj.getName(), 'newName');
            assert.equal(obj.getIsCool(), false);
            assert.equal(obj.getMembers().aaron, 'Aaron Conran');

        });

        it("should not share the same config", function() {

            var obj1 = new subClass({
                name: 'newName',
                isCool: false,
                members: {
                    aaron: 'Aaron Conran'
                }
            });

            var obj2 = new subClass();

            assert.notEqual(obj2.getName(), 'newName');

        });

        it("should copy objects", function() {

            var o1 = new parentClass(),
                o2 = new parentClass(),
                m1 = o1.getMembers(),
                m2 = o2.getMembers();

            assert.deepEqual(m1, m2);

        });

        // Possibly need to revisit this, arrays are not cloned.
        it("should copy arrays", function() {

            var o1 = new parentClass(),
                o2 = new parentClass(),
                h1 = o1.getHobbies(),
                h2 = o2.getHobbies();

            assert.deepEqual(h1, h2);

        });

        // {{{ values

        describe("values", function() {

            it("should set the the config value defined", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                assert.equal((new cls()).getFoo(), 'bar');

            });

            it("should be able to set the config", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                o = new cls();

                o.setFoo('baz');

                assert.equal(o.getFoo(), 'baz');

                o = null;

            });

            it("should use the inherited config", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    config: {
                        foo: 'baz'
                    }
                });

                assert.equal((new sub()).getFoo(), 'baz');

            });

            it("should inherit the parent value even if not specified in the config block", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    config: {
                        herp: 'derp'
                    }
                });

                assert.equal((new sub()).getFoo(), 'bar');

            });

        });

        // }}}
        // {{{ value on prototype

        describe("value on prototype", function() {

            it("should read the value from the prototype in a subclass", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    foo: 'baz'
                });

                assert.equal((new sub()).getFoo(), 'baz');

            });

            it("should remove the property from the prototype", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    foo: 'baz'
                });

                assert.equal(sub.prototype.foo, undefined);

            });

            it("should favour the property on the config", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    foo: 'baz',
                    config: {
                        foo: 'bar'
                    }
                });

                assert.equal((new cls()).getFoo(), 'bar');

            });

            it("should favour the property on the prototype in a subclass", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    foo: 'baz'
                });

                assert.equal((new sub()).getFoo(), 'baz');

            });

            it("should pull the property from the prototype in the subclass if it exists on the parent prototype", function() {

                cls = CLI.define(null, {
                    constructor: defaultInitConfig,
                    foo: 'baz',
                    config: {
                        foo: 'bar'
                    }
                });

                sub = CLI.define(null, {
                    extend: cls,
                    foo: 'bleh'
                });

                assert.equal((new sub()).getFoo(), 'bleh');

            });

        });

        // }}}
        // {{{ $configStrict

        describe("$configStrict", function() {

            it("should not copy non-configs to the instance when true", function() {

                cls = CLI.define(null, {
                    $configStrict: true,
                    config: {
                        foo: 'bar'
                    },
                    constructor: defaultInitConfig
                });

                o = new cls({
                    baz: 1
                });

                assert.equal(o.baz, undefined);

            });

            it("should copy non-configs to the instance when false", function() {

                cls = CLI.define(null, {
                    $configStrict: false,
                    config: {
                        foo: 'bar'
                    },
                    constructor: defaultInitConfig
                });

                o = new cls({
                    baz: 1
                });

                assert.equal(o.baz, 1);

            });

            it("should not copy if the subclass sets the property to true", function() {

                cls = CLI.define(null, {
                    $configStrict: false,
                    config: {
                        foo: 'bar'
                    },
                    constructor: defaultInitConfig
                });

                sub = CLI.define(null, {
                    extend: sub,
                    $configStrict: true
                });

                o = new sub({
                    baz: 1
                });

                assert.equal(o.baz, undefined);

            });
        });

        // }}}
        // {{{ $configPrefixed

        describe("$configPrefixed", function() {

            var defineCls = function(prefix, defaultValue) {

                cls = CLI.define(null, {
                    $configPrefixed: !!prefix,
                    config: {
                        foo: defaultValue || 'bar'
                    },
                    constructor: defaultInitConfig
                });

            };

            it("should use the config name as the instance property when false", function() {

                defineCls();

                o = new cls();

                assert.equal(o.foo, 'bar');

            });

            it("should use _config name as the instance property when true", function() {

                defineCls(true);

                o = new cls();

                assert.equal(o._foo, 'bar');

            });

            it("should allow a subclass to have a different prefix", function() {

                defineCls(false, {});

                sub = CLI.define(null, {
                    extend: cls,
                    $configPrefixed: true
                });

                var o1 = new cls(),
                    o2 = new sub();

                // Use objects since they won't get stamped on the prototype.
                assert.deepEqual(o1.foo, {});
                assert.deepEqual(o2._foo, {});
                assert.equal(o2.foo, undefined);

            });

        });

        // }}}
        // {{{ meta configs

        describe("meta configs", function() {

            // {{{ mixins

            describe('mixins', function () {

                it("should inherit meta configs from mixins", function() {

                    var calls = 0;

                    var Mix = CLI.define(null, {
                        config: {
                            foo: {
                                lazy: true,
                                $value: 42
                            }
                        }
                    });

                    var Cls = CLI.define(null, {
                        mixins: {
                            mix: Mix
                        },
                        constructor: function (config) {
                            this.initConfig(config);
                        },
                        applyFoo: function (newValue, oldValue) {
                            ++calls;
                            return newValue;
                        }
                    });

                    o = new Cls();

                    assert.equal(calls, 0);

                    var v = o.getFoo();

                    assert.equal(v, 42);
                    assert.equal(calls, 1);

                });

                it("should not allow mixins to modify meta configs", function() {

                    var calls = 0;

                    var Mix = CLI.define(null, {
                        config: {
                            foo: {
                                lazy: false,
                                $value: 1
                            }
                        }
                    });

                    var Cls = CLI.define(null, {
                        mixins: {
                            mix: Mix
                        },
                        config: {
                            foo: {
                                lazy: true,
                                $value: 2
                            }
                        },
                        constructor: function (config) {
                            this.initConfig(config);
                        },
                        applyFoo: function (newValue, oldValue) {
                            ++calls;
                            return newValue;
                        }
                    });

                    o = new Cls();

                    assert.equal(calls, 0);

                    var v = o.getFoo();

                    assert.equal(v, 2);
                    assert.equal(calls, 1);

                });

            });

            // }}}
            // {{{ cached

            describe("cached", function() {

                describe("caching", function() {

                    it("should not attempt to initialize until the first instance", function() {

                        cls = CLI.define(null, {
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        assert.equal(cls.prototype.foo, undefined);

                    });

                    it("should not attempt to cache the config if we don't call initConfig", function() {

                        cls = CLI.define(null, {
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        new cls();

                        assert.equal(cls.prototype.foo, undefined);

                    });

                    it("should stamp the value on the prototype after the first instance is created", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            cachedConfig: {
                                foo: 'bar'
                            }
                        });

                        o = new cls();

                        assert.equal(cls.prototype._foo, 'bar');
                        assert.equal(o.hasOwnProperty('_foo'), false);

                    });

                    it("should stamp all values on the prototype after the first instance is created", function() {

                        var calls = 0;

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            cachedConfig: {
                                foo: 21,
                                bar: 1,
                                baz: 3
                            },
                            applyFoo: function (foo) {
                                ++calls;
                                return foo * this.getBar(); // fwd dependency
                            },
                            applyBar: function (bar) {
                                ++calls;
                                return bar * 2;
                            },
                            applyBaz: function (baz) {
                                ++calls;
                                return baz * this.getFoo(); // backward dependency
                            }
                        });

                        o = new cls();

                        assert.equal(cls.prototype._foo, 42);
                        assert.equal(cls.prototype._bar, 2);
                        assert.equal(cls.prototype._baz, 3 * 42);

                        assert.equal(calls, 3);
                        assert.equal(o.hasOwnProperty('_foo'), false);
                        assert.equal(o.hasOwnProperty('_bar'), false);
                        assert.equal(o.hasOwnProperty('_baz'), false);

                        o = new cls();

                        assert.equal(calls, 3);
                        assert.equal(o.hasOwnProperty('_foo'), false);
                        assert.equal(o.hasOwnProperty('_bar'), false);
                        assert.equal(o.hasOwnProperty('_baz'), false);
                    });

                    it("should work with the cachedConfig notification", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        o = new cls();

                        assert.equal(cls.prototype._foo, 'bar');
                        assert.equal(o.hasOwnProperty('_foo'), false);

                    });

                    it("should call an applier only once", function() {

                        var count = 0;

                        o = {};

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            },
                            applyFoo: function(foo) {
                                ++count;
                                o.foo = foo;
                                return o;
                            }
                        });

                        var a = new cls(),
                            b = new cls(),
                            c = new cls();

                        assert.equal(count, 1);
                        assert.deepEqual(a.getFoo(), o);
                        assert.deepEqual(b.getFoo(), o);
                        assert.deepEqual(c.getFoo(), o);

                    });

                    it("should call the updater only once", function() {

                        var count = 0;

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            },
                            updateFoo: function(foo) {
                                ++count;
                            }
                        });

                        var a = new cls(),
                            b = new cls(),
                            c = new cls();

                        assert.equal(count, 1);

                    });

                    it("should allow the value to be updated from the config", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        o = new cls({
                            foo: 'baz'
                        });

                        assert.equal(cls.prototype._foo, 'bar');
                        assert.equal(o.getFoo(), 'baz');

                    });

                    it("should allow the value to be updated from the setter", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        o = new cls();
                        o.setFoo('baz');

                        assert.equal(cls.prototype._foo, 'bar');
                        assert.equal(o.getFoo(), 'baz');

                    });

                });

                // }}}
                // {{{ subclassing

                describe("subclassing", function() {

                    it("should initialize the value on the subclass prototype", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        sub = CLI.define(null, {
                            extend: cls
                        });

                        o = new sub();

                        assert.equal(sub.prototype._foo, 'bar');
                        assert.equal(o.getFoo(), 'bar');

                    });

                    it("should be able to override the default value", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        sub = CLI.define(null, {
                            extend: cls,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'baz'
                                }
                            }
                        });

                        o = new sub();

                        assert.equal(sub.prototype._foo, 'baz');
                        assert.equal(o.getFoo(), 'baz');

                    });

                    it("should call the applier only once per instance", function() {

                        var parentCount = 0,
                            subCount = 0;

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            },

                            applyFoo: function(foo) {
                                if (this.self === cls) {
                                    ++parentCount;
                                } else if (this.self === sub) {
                                    ++subCount;
                                }
                                return foo;
                            }
                        });

                        sub = CLI.define(null, {
                            extend: cls
                        });

                        new cls();
                        new sub();

                        new cls();
                        new sub();

                        new cls();
                        new sub();

                        assert.equal(parentCount, 1);
                        assert.equal(subCount, 1);

                    });

                    it("should retain cached-ness even when overridden in a subclass config", function() {

                        cls = CLI.define(null, {
                            constructor: defaultInitConfig,

                            config: {
                                foo: {
                                    cached: true,
                                    $value: 'bar'
                                }
                            }
                        });

                        sub = CLI.define(null, {
                            config: {
                                foo: 'baz'
                            }
                        });

                        assert.equal((new cls()).getFoo(), 'bar');
                        assert.equal((new sub()).getFoo(), undefined);

                    });

                    it("should not allow an initially uncached config to be declared as cached", function() {

                        cls = CLI.define(null, {
                            config: {
                                foo: 1
                            }
                        });

                        beginSilent();

                        assert.throws(function() {
                            CLI.define(null, {
                                extend: cls,
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: 2
                                    }
                                }
                            });
                        });

                        endSilent();

                    });

                    // }}}
                    // {{{ nulls

                    describe("nulls", function() {

                        it("should allow null overrides in child classes", function() {
                            cls = CLI.define(null, {
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: 1
                                    }
                                },
                                constructor: defaultInitConfig
                            });
                            sub = CLI.define(null, {
                                extend: cls,
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: null
                                    }
                                }
                            });

                            new cls();
                            new sub();

                            assert.equal(cls.prototype._foo, 1);
                            assert.equal(sub.prototype._foo, undefined);

                        });

                        it("should allow null in the base class and value overrides in child classes", function() {

                            cls = CLI.define(null, {
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: null
                                    }
                                },
                                constructor: defaultInitConfig
                            });

                            sub = CLI.define(null, {
                                extend: cls,
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: 1
                                    }
                                }
                            });

                            new cls();
                            new sub();

                            assert.equal(cls.prototype._foo, null);
                            assert.equal(sub.prototype._foo, 1);

                        });

                        it("should be able to return to being cached after being nulled out", function() {

                            var A = CLI.define(null, {
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: 1
                                    }
                                },
                                constructor: defaultInitConfig
                            });

                            var B = CLI.define(null, {
                                extend: A,
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: null
                                    }
                                }
                            });

                            var C = CLI.define(null, {
                                extend: B,
                                config: {
                                    foo: {
                                        cached: true,
                                        $value: 2
                                    }
                                }
                            });

                            new A();
                            assert.equal(A.prototype._foo, 1);

                            new B();
                            assert.equal(B.prototype._foo, undefined);

                            new C();
                            assert.equal(C.prototype._foo, 2);

                        });

                    });

                    // }}}

                });

                // }}}

            });

            // }}}
            // {{{ lazy

            describe("lazy", function() {

                function makeLazy(value) {
                    return {
                        foo: {
                            lazy: true,
                            $value: value
                        }
                    };
                }

                // {{{ basic construction

                describe("basic construction", function() {

                    it("should not call the applier when instantiated without a config value", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            applyFoo: function() {}
                        });

                        var itFn = sinon.spy(new Cls(), 'applyFoo');

                        assert.equal(itFn.called, false);

                    });

                    it("should not call the applier when instantiated with a config value", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            applyFoo: function() {}
                        });

                        var o = new Cls({
                            foo: 100
                        });
                        var itFn = sinon.spy(o, 'applyFoo');

                        assert.equal(itFn.called, false);

                    });

                    it("should not call the updater when instantiated without a config value", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            updateFoo: function() {}
                        });

                        var itFn = sinon.spy(new Cls(), 'updateFoo');

                        assert.equal(itFn.called, false);

                    });

                    it("should not call the updater when instantiated with a config value", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            updateFoo: function() {}
                        });

                        var o = new Cls({
                            foo: 100
                        });

                        var itFn = sinon.spy(o, 'updateFoo');

                        assert.equal(itFn.called, false);

                    });

                });

                // }}}
                // {{{ during construction

                describe("during construction", function() {

                    it("should allow the getter to be called during initConfig by another method", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: CLI.apply({
                                bar: 0
                            }, makeLazy(1)),

                            applyBar: function() {
                                return this.getFoo() + 100;
                            }
                        });

                        o = new Cls();

                        assert.equal(o.getBar(), 101);

                    });

                    it("should not call the applier on subsequent get calls", function() {

                        var spy = sinon.spy();
                        spy.returned(1);

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: CLI.apply({
                                bar: 0
                            }, makeLazy(1)),

                            applyFoo: spy,

                            applyBar: function() {
                                return this.getFoo() + 100;
                            }
                        });

                        o = new Cls();

                        assert.equal(o.applyFoo.callCount, 1);
                        o.getFoo();
                        assert.equal(o.applyFoo.callCount, 1);
                    });

                    it("should not call the updater on subsequent get calls", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: CLI.apply({
                                bar: 0
                            }, makeLazy(1)),

                            updateFoo: spy,
                            applyBar: function() {
                                return this.getFoo() + 100;
                            }
                        });

                        o = new Cls();

                        assert.equal(spy.callCount, 1);
                        o.getFoo();
                        assert.equal(spy.callCount, 1);

                    });

                });

                // }}}
                // {{{ value before first get call

                describe("value before first get call", function() {

                    // {{{ from the prototype

                    describe("from the prototype", function() {

                        it("should have primitives defined on the instance", function() {

                            var Cls = CLI.define(null, {
                                constructor: defaultInitConfig,
                                config: makeLazy(1)
                            });

                            var o = new Cls();

                            assert.equal(o._foo, 1);

                        });

                        it("should not have objects on the instance", function() {

                            var Cls = CLI.define(null, {
                                constructor: defaultInitConfig,
                                config: makeLazy({})
                            });

                            var o = new Cls();

                            assert.equal(o._foo, undefined);
                        });

                    });

                    // }}}
                    // {{{ from the instance config

                    describe("from the instance config", function() {

                        it("should not set the value on the underlying property", function() {

                            var Cls = CLI.define(null, {
                                constructor: defaultInitConfig,
                                config: makeLazy({})
                            });

                            var o = new Cls({
                                foo: {}
                            });

                            assert.equal(o._foo, undefined);

                        });

                    });

                    // }}}

                    it("should not have configs with a custom setter on the instance", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            setFoo: function() {
                                this.callParent(arguments);
                                return this;
                            }
                        });

                        var o = new Cls();

                        assert.equal(o._foo, undefined);

                    });

                    it("should not have configs with a custom applier on the instance", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            applyFoo: CLI.identityFn
                        });

                        var o = new Cls();

                        assert.equal(o._foo, undefined);

                    });

                    it("should not have configs with a custom updater on the instance", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            updateFoo: CLI.emptyFn
                        });

                        var o = new Cls();

                        assert.equal(o._foo, undefined);

                    });

                    it("should not call the getter if set is called", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),
                            getFoo: spy
                        });

                        var o = new Cls();

                        o.setFoo(2);

                        assert.equal(spy.callCount, 0);
                    });

                });

                // }}}
                // {{{ first call to get

                describe("first call to get", function() {

                    it("should call the applier on the first get call", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy
                        });

                        o = new Cls({});
                        o.getFoo();

                        assert.equal(spy.called, true);

                    });

                    it("should not call the applier on subsequent get calls", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy
                        });

                        o = new Cls({});
                        o.getFoo();
                        o.getFoo();
                        o.getFoo();

                        assert.equal(spy.callCount, 1);
                    });

                    it("should call the updater on the first get call", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            updateFoo: spy
                        });

                        o = new Cls({});
                        o.getFoo();

                        assert.equal(spy.called, true);
                    });

                    it("should not call the updater on subsequent get calls", function() {

                        var spy = sinon.spy();
                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            updateFoo: spy
                        });

                        o = new Cls({});
                        o.getFoo();
                        o.getFoo();
                        o.getFoo();

                        assert.equal(spy.callCount, 1);
                    });

                    it("should merge any values for objects", function() {

                        var Cls = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    lazy: true,
                                    $value: {
                                        z: 1
                                    }
                                }
                            }
                        });

                        o = new Cls({
                            foo: {
                                y: 2
                            }
                        });

                        /*
                         TODO: don't marge bug
                        assert.deepEqual(o.getFoo(), {
                            y: 2,
                            z: 1
                        });
                       */

                    });
                });

                // }}}
                // {{{ subclassing

                describe("subclassing", function() {

                    it("should inherit laziness from the parent", function() {

                        var spy = sinon.spy();
                        var A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy
                        });

                        var B = CLI.define(null, {
                            extend: A
                        });

                        o = new B();

                        assert.equal(spy.called, false);

                        o.getFoo();

                        assert.equal(spy.called, true);

                    });

                    it("should inherit laziness from the parent and allow the value to change", function() {

                        var spy = sinon.spy({
                            hoge: function(v) {
                                return v;
                            }
                        }, 'hoge');

                        var A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy.hoge
                        });

                        var B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: 9876
                            }
                        });

                        o = new B();

                        assert.equal(spy.called, false);
                        assert.equal(o.getFoo(), 9876);

                    });

                    it("should be able to go from lazy -> !lazy", function() {

                        var spy = sinon.spy();
                        var A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy
                        });

                        var B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {
                                    lazy: false,
                                    $value: 1
                                }
                            }
                        });

                        o = new B();

                        assert.equal(spy.called, true);

                    });

                    it("should be able to go from !lazy -> lazy", function() {

                        var spy = sinon.spy();
                        var A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: 1
                            },

                            applyFoo: spy
                        });

                        var B = CLI.define(null, {
                            extend: A,
                            config: makeLazy(1)
                        });

                        o = new B();

                        assert.equal(spy.called, false);
                        o.getFoo();
                        assert.equal(spy.called, true);

                    });

                    it("should retain laziness on the superclass", function() {

                        var spy = sinon.spy();
                        var A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: makeLazy(1),

                            applyFoo: spy
                        });

                        var B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {
                                    lazy: false,
                                    $value: 2
                                }
                            }
                        });

                        o = new A();

                        assert.equal(spy.called, false);
                        o.getFoo();
                        assert.equal(spy.called, true);

                    });

                });

                // }}}

            });

            // }}}
            // {{{ merge

            describe("merge", function() {

                var spy, A, B;

                beforeEach(function() {
                    spy = sinon.spy();
                });

                afterEach(function() {
                    A = B = null;
                });

                // {{{ during class definition

                describe("during class definition", function() {

                    function defineInherit(aVal, bVal, onlyA) {

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: aVal
                                }
                            }
                        });

                        if (!onlyA) {

                            B = CLI.define(null, {
                                extend: A,
                                config: {
                                    foo: bVal
                                }
                            });

                        }

                    }

                    function defineMixin(aVal, bVal) {

                        CLI.undefine('spec.B');

                        // Mixins require a name to work...
                        B = CLI.define('spec.B', {
                            config: {
                                foo: bVal
                            }
                        });

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            mixins: [B],
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: aVal
                                }
                            }
                        });
                    }

                    afterEach(function() {
                        CLI.undefine('spec.B');
                    });

                    it("should not call the merge fn when defining the config", function() {

                        defineInherit({}, undefined, true);

                        assert.equal(spy.called, false);
                    });

                    // }}}
                    // {{{ merge values

                    describe("merge values", function() {

                        var possible = [undefined, null, true, 'aString', 1, new Date(), {}, []];

                        // {{{ for subclasses

                        describe("for subclasses", function() {

                            it("should call the merge function for all value combinations", function() {

                                CLI.Array.forEach(possible, function(superValue) {

                                    CLI.Array.forEach(possible, function(subValue) {
                                        spy.reset();
                                        defineInherit(superValue, subValue);
                                        assert.equal(spy.called, true);
                                    });

                                });

                            });

                        });

                        // }}}
                        // {{{ for mixins

                        describe("for mixins", function() {

                            it("should call the merge function for all value combinations", function() {

                                CLI.Array.forEach(possible, function(mixinValue) {

                                    CLI.Array.forEach(possible, function(clsValue) {

                                        spy.reset();
                                        defineMixin(mixinValue, clsValue, false, true);

                                        assert.equal(spy.called, true);

                                    });

                                });

                            });

                        });

                        // }}}

                    });

                    // }}}
                    // {{{ merging

                    describe("merging", function() {

                        /*
                        it("should pass the sub value, then super value and whether it is from a mixin", function() {
                            var o1 = {},
                                o2 = {};

                            defineInherit(o1, o2);

                            var result = {};
                            spy.getCalls().forEach(function(cl) {

                                result[cl.callId] = result[cl.callId] || 0;
                                result[cl.callId]++;

                            });
                            var maxCnt = 0;
                            var maxKey;
                            CLI.iterate(result, function(key, cnt) {
                                if (maxCnt < cnt) {
                                    maxCnt = cnt;
                                    maxKey = key;
                                }
                            });
                            var mostRecentCall;
                            spy.getCalls().forEach(function(cl) {
                                if (cl.callId == maxKey) {
                                    mostRecentCall = cl;
                                }
                            });

                            var call = mostRecentCall;
                            var args = call.args;

                            // When merge is called the "this" pointer should be the
                            // CLI.Config instance (which may have meta-level configs on
                            // it).
                            assert.equal(call.thisValue, B.$config.configs.foo);

                            assert.equal(args[0], o2);
                            assert.equal(args[1], o1);
                            assert.equal(args[2], B);
                            assert.equal(args[3], false);
                        });
                       */

                        // {{{ with a mixin

                        describe("with a mixin", function() {

                            it("should pass the mixinClass", function() {

                                defineMixin({}, {});

                                var result = {};
                                spy.getCalls().forEach(function(cl) {

                                    result[cl.callId] = result[cl.callId] || 0;
                                    result[cl.callId]++;

                                });
                                var maxCnt = 0;
                                var maxKey;
                                CLI.iterate(result, function(key, cnt) {
                                    if (maxCnt < cnt) {
                                        maxCnt = cnt;
                                        maxKey = key;
                                    }
                                });
                                var mostRecentCall;
                                spy.getCalls().forEach(function(cl) {
                                    if (cl.callId == maxKey) {
                                        mostRecentCall = cl;
                                    }
                                });

                                var args = mostRecentCall.args;

                                assert.equal(args[2], A);
                                assert.equal(args[3], B);

                            });
                        });

                        // }}}

                        it("should pass the scope as the Config instance", function() {

                            defineInherit({}, {});

                            var result = {};
                            spy.getCalls().forEach(function(cl) {

                                result[cl.callId] = result[cl.callId] || 0;
                                result[cl.callId]++;

                            });
                            var maxCnt = 0;
                            var maxKey;
                            CLI.iterate(result, function(key, cnt) {
                                if (maxCnt < cnt) {
                                    maxCnt = cnt;
                                    maxKey = key;
                                }
                            });
                            var mostRecentCall;
                            spy.getCalls().forEach(function(cl) {
                                if (cl.callId == maxKey) {
                                    mostRecentCall = cl;
                                }
                            });

                            assert.equal(mostRecentCall.thisValue, B.$config.configs.foo);

                        });

                        /*
                        it("should set the returned value", function() {

                            spy = sinon.spy();

                            spy.alwaysReturned({
                                merged: 'ok!'
                            });

                            defineInherit({}, {});

                            o = new B();

                            expect(o.getFoo()).toEqual({
                                merged: 'ok!'
                            });

                        });
                       */

                    });

                    // }}}

                });

                // }}}
                // {{{ instance values

                describe("instance values", function() {

                    var A;

                    function defineAndInstance(classVal, instanceVal) {

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: classVal
                                }
                            }
                        });

                        o = new A({
                            foo: instanceVal
                        });
                    }

                    afterEach(function() {
                        A = null;
                    });

                    // {{{ merge values

                    describe("merge values", function() {

                        it("should call the merge function for all value combinations", function() {

                            var possible = [undefined, null, true, 'aString', 1, new Date(), {}, []];

                            CLI.Array.forEach(possible, function(clsValue) {
                                CLI.Array.forEach(possible, function(instanceValue) {

                                    spy.reset();
                                    defineAndInstance(clsValue, instanceValue);

                                    assert.equal(spy.called, true);

                                });

                            });

                        });
                    });

                    // }}}
                    // {{{ merging

                    describe("merging", function() {

                        /*
                        it("should pass the instance value, then class value", function() {

                            var args;

                            defineAndInstance({
                                foo: 1
                            }, {
                                bar: 1
                            });

                            args = spy.mostRecentCall.args;

                            expect(args[0]).toEqual({
                                bar: 1
                            });

                            expect(args[1]).toEqual({
                                foo: 1
                            });

                        });
                       */

                      /*
                        it("should pass the instance", function() {

                            defineAndInstance({}, {});
                            expect(spy.mostRecentCall.args[2]).toBe(o);

                        });
                       */

                        /*
                        it("should set the returned value", function() {

                            spy = jasmine.createSpy().andReturn({
                                merged: 'ok!'
                            });
                            defineAndInstance({}, {});
                            expect(o.getFoo()).toEqual({
                                merged: 'ok!'
                            });

                        });
                       */

                    });

                    // }}}

                });

                // }}}
                // {{{ subclassing

                describe("subclassing", function() {

                    /*
                    it("should inherit the merge from the parent", function() {

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: null
                                }
                            }
                        });

                        B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {}
                            }
                        });

                        spy.reset();
                        o = new B({
                            foo: {}
                        });

                        expect(spy).toHaveBeenCalled();

                    });
                   */

                  /*
                    it("should be able to set a merge on a subclass", function() {

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: 1
                            }
                        });

                        B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: {}
                                }
                            }
                        });

                        spy.reset();
                        o = new B({
                            foo: {}
                        });
                        expect(spy).toHaveBeenCalled();

                    });
                   */

                  /*
                    it("should be able to override the merge on a superclass", function() {

                        var superSpy = jasmine.createSpy();
                        spy = jasmine.createSpy().andReturn({});

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    merge: superSpy,
                                    $value: {}
                                }
                            }
                        });

                        B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: {}
                                }
                            }
                        });

                        superSpy.reset();
                        spy.reset();
                        o = new B({
                            foo: {}
                        });
                        expect(superSpy).not.toHaveBeenCalled();
                        expect(spy).toHaveBeenCalled();
                    });
                   */

                  /*
                    it("should retain the merge on the superclass", function() {

                        var superSpy = jasmine.createSpy().andReturn({});

                        A = CLI.define(null, {
                            constructor: defaultInitConfig,
                            config: {
                                foo: {
                                    merge: superSpy,
                                    $value: {}
                                }
                            }
                        });

                        B = CLI.define(null, {
                            extend: A,
                            config: {
                                foo: {
                                    merge: spy,
                                    $value: {}
                                }
                            }
                        });

                        superSpy.reset();
                        spy.reset();
                        o = new A({
                            foo: {}
                        });
                        expect(superSpy).toHaveBeenCalled();
                        expect(spy).not.toHaveBeenCalled();
                    });
                   */

                });

                // }}}

            });

        });

    });

    // }}}
    // {{{ statics

    describe("statics", function() {

        beforeEach(function() {
            fn = function() {};
        });

        it("should copy static properties to the class", function() {

            cls = CLI.define(null, {
                statics: {
                    someName: 'someValue',
                    someMethod: fn
                }
            });

            assert.equal(cls.someName, 'someValue');
            assert.equal(cls.someMethod, fn);

        });

        it("should not copy statics to subclasses", function() {

            cls = CLI.define(null, {
                statics: {
                    someName: 'someValue',
                    someMethod: fn
                }
            });

            sub = CLI.define(null, {
                extend: sub
            });

            assert.equal(sub.someName, undefined);
            assert.equal(sub.someMethod, undefined);

        });

    });

    // }}}
    // {{{ inheritableStatics

    describe("inheritableStatics", function() {

        beforeEach(function() {
            fn = function() {};
        });

        it("should store names of inheritable static properties", function() {

            cls = CLI.define(null, {
                inheritableStatics: {
                    someName: 'someValue',
                    someMethod: fn
                }
            });

            assert.equal((new cls()).inheritableStatics, undefined);
            assert.equal(cls.someName, 'someValue');
            assert.deepEqual(cls.prototype.$inheritableStatics, ['someName', 'someMethod']);
            assert.equal(cls.someMethod, fn);

        });

        it("should inherit inheritable statics", function() {

            cls = CLI.define(null, {
                inheritableStatics: {
                    someName: 'someValue',
                    someMethod: fn
                }
            });

            sub = CLI.define(null, {
                extend: cls
            });

            assert.equal(sub.someName, 'someValue');
            assert.equal(sub.someMethod, fn);
        });

        it("should NOT inherit inheritable statics if the class already has it", function() {

            cls = CLI.define(null, {
                inheritableStatics: {
                    someName: 'someValue',
                    someMethod: fn
                }
            });
            sub = CLI.define(null, {
                extend: cls,
                statics: {
                    someName: 'someOtherValue',
                    someMethod: function(){}
                }
            });

            assert.equal(sub.someName, 'someOtherValue');
            assert.notEqual(sub.someMethod, fn);

        });

    });

    // }}}
    // {{{ addStatics

    describe("addStatics", function() {

        it("single with name - value arguments", function() {

            var called = false;

            subClass.addStatics({
                staticMethod: function(){
                    called = true;
                }
            });

            assert.notEqual(subClass.staticMethod, undefined);

            subClass.staticMethod();

            assert.equal(called, true);
        });

        it("multiple with object map argument", function() {

            subClass.addStatics({
                staticProperty: 'something',
                staticMethod: function(){}
            });

            assert.equal(subClass.staticProperty, 'something');
            assert.notEqual(subClass.staticMethod, undefined);

        });

    });

    // }}}
    // {{{ override

    describe("override", function() {

        it("should override", function() {

            subClass.override({

                myOwnMethod: function(){

                    this.isOverridden = true;
                    this.callOverridden(arguments);

                }
            });

            var obj = new subClass;

            obj.myOwnMethod();

            assert.equal(obj.isOverridden, true);
            assert.equal(obj.myOwnMethodCalled, true);

        });

        it("should override a default config", function() {

            cls = CLI.define(null, {
                constructor: defaultInitConfig,
                config: {
                    foo: 1
                }
            });

            cls.override({
                config: {
                    foo: 2
                }
            });

            assert.equal((new cls()).getFoo(), 2);

        });

        it("should be able to add a new config", function() {

            cls = CLI.define(null, {
                constructor: defaultInitConfig,
                config: {
                    foo: 1
                }
            });

            cls.override({
                config: {
                    bar: 2
                }
            });

            assert.equal((new cls()).getBar(), 2);

        });

    });

    // }}}
    // {{{ private methods

    describe('private methods', function () {

        var Base;

        beforeEach(function () {

            // This is to silence console log errors
            beginSilent();
            Base = CLI.define(null, {
                bar: function () {},

                privates: {
                    foo: function () {}
                }
            });
            endSilent();

        });

        // {{{ extend

        describe('extend', function () {

            it('should allow derived class to override a private method w/a private method', function () {

                beginSilent();
                assert.doesNotThrow(function () {
                    CLI.define(null, {
                        extend: Base,

                        privates: {
                            foo: function () {}
                        }
                    });
                });
                endSilent();

            });

            it('should allow derived class to override a public method w/a private method', function () {

                beginSilent();
                assert.doesNotThrow(function () {
                    CLI.define(null, {
                        extend: Base,

                        privates: {
                            bar: function () {}
                        }
                    });
                });
                endSilent();

            });

            it('should throw when derived class overrides a private method', function () {

                beginSilent();
                assert.throws(function () {
                    CLI.define(null, {
                        extend: Base,

                        foo: function () {}
                    });
                });
                endSilent();

            });

            it('should throw when derived class overrides a private method w/a foreign private method', function () {
                beginSilent();
                assert.throws(function () {
                    CLI.define(null, {
                        extend: Base,

                        privates: {
                            privacy: 'user',

                            foo: function () {}
                        }
                    });
                });
                endSilent();

            });

        });

        // }}}
        // {{{ override

        describe('override', function () {

            it('should throw when overriding a private method', function () {

                beginSilent();
                assert.throws(function () {
                    Base.override({
                        foo: function () {}
                    });
                });
                endSilent();

            });

            it('should allow overriding a public method w/a private method', function () {

                assert.doesNotThrow(function() {
                    Base.override({
                        privates: {
                            bar: function () {}
                        }
                    });
                });

            });

            it('should allow overriding a private method w/a private method', function () {

                assert.doesNotThrow(function() {
                    Base.override({
                        privates: {
                            foo: function () {}
                        }
                    });
                });

            });

            it('should throw when derived class overrides a private method w/a foreign private method', function () {
                assert.throws(function() {
                    base.override({
                        privates: {
                            privacy: 'user',

                            foo: function () {}
                        }
                    });
                });

            });

        });

        // }}}

    });

    // }}}
    // {{{ define override

    describe("define override", function() {

        var obj,
            createFnsCalled;

        beforeEach(function () {
            createFnsCalled = [];

            function onCreated () {
                createFnsCalled.push(this.$className);
            }

            CLI.define('Foo.UnusedOverride', {
                override: 'Foo.Nothing',

                foo: function (x) {
                    return this.callParent([x*2]);
                }
            }, onCreated);

            // this override comes before its target:
            CLI.define('Foo.SingletonOverride', {
                override: 'Foo.Singleton',

                foo: function (x) {
                    return this.callParent([x*2]);
                }
            }, onCreated);

            CLI.define('Foo.Singleton', {
                singleton: true,
                foo: function (x) {
                    return x;
                }
            });

            CLI.define('Foo.SomeBase', {
                patchedMethod: function (x) {
                    return x + 'A';
                },

                statics: {
                    patchedStaticMethod: function (x) {
                        return x + 'a';
                    },
                    staticMethod: function (x) {
                        return 'A' + x;
                    }
                }
            });

            CLI.define('Foo.SomeClass', {
                extend: 'Foo.SomeBase',

                prop: 1,

                constructor: function () {
                    this.prop = 2;
                },

                method1: function(x) {
                    return 'b' + x;
                },

                patchedMethod: function () {
                    return this.callParent() + 'B';
                },

                statics: {
                    patchedStaticMethod: function (x) {
                        return this.callParent(arguments) + 'b';
                    },

                    staticMethod: function (x) {
                        return 'B' + this.callParent(arguments);
                    }
                }
            });

            // this override comes after its target:
            CLI.define('Foo.SomeClassOverride', {
                override: 'Foo.SomeClass',

                constructor: function () {
                    this.callParent(arguments);
                    this.prop *= 21;
                },

                method1: function(x) {
                    return 'a' + this.callParent([x*2]) + 'c';
                },

                method2: function() {
                    return 'two';
                },

                patchedMethod: function (x) {
                    return this.callSuper(arguments) + 'C';
                },

                statics: {
                    newStatic: function () {
                        return 'boo';
                    },
                    patchedStaticMethod: function (x) {
                        return this.callSuper(arguments) + 'c';
                    },
                    staticMethod: function (x) {
                        return 'Z' + this.callParent([x*2]) + '!';
                    }
                }
            }, onCreated);

            obj = CLI.create('Foo.SomeClass');
        });

        afterEach(function () {
            CLI.each(['Foo.SingletonOverride', 'Foo.Singleton', 'Foo.SomeClassOverride',
                      'Foo.SomeBase', 'Foo.SomeClass'],
                function (className) {
                    CLI.undefine(className);
                });

            CLI.undefine('Foo');

            obj = null;
        });

        it("should call the createdFn", function () {

            assert.equal(createFnsCalled.length, 2);
            assert.equal(createFnsCalled[0], 'Foo.Singleton');
            assert.equal(createFnsCalled[1], 'Foo.SomeClass');

        });

        it("can override constructor", function() {

            assert.equal(obj.prop, 42);

        });

        it("can add new methods", function() {

            assert.equal(obj.method2(), 'two');

        });

        it("can add new static methods", function() {

            assert.equal(Foo.SomeClass.newStatic(), 'boo');

        });

        it("callParent should work for instance methods", function() {

            assert.equal(obj.method1(21), 'ab42c');

        });

        it("callParent should work for static methods", function() {

            assert.equal(Foo.SomeClass.staticMethod(21), 'ZBA42!');

        });

        it("callSuper should work for instance methods", function() {

            assert.equal(obj.patchedMethod('x'), 'xAC');

        });

        it("callSuper should work for static methods", function() {

            assert.equal(Foo.SomeClass.patchedStaticMethod('X'), 'Xac');

        });

        it('works with singletons', function () {

            assert.equal(Foo.Singleton.foo(21), 42);

        });

    });

    // }}}
    // {{{ mixin

    describe("mixin", function() {

        it("should have all properties of mixins", function() {

            var obj = new subClass;

            assert.equal(obj.mixinProperty1, 'mixinProperty1');
            assert.equal(obj.mixinProperty2, 'mixinProperty2');
            assert.notEqual(obj.mixinMethod1, undefined);
            assert.notEqual(obj.mixinMethod2, undefined);
            assert.equal(obj.getMixinConfig(), 'mixinConfig');

        });

        it("should not overwrite a config if it exists on the class", function() {

            var Mix = CLI.define('spec.Mixin', {
                config: {
                    foo: 1
                }
            });

            var Cls = CLI.define(null, {
                constructor: defaultInitConfig,
                mixins: [Mix],
                config: {
                    foo: 2
                }
            });
            o = new Cls();

            assert.equal(o.getFoo(), 2);

            CLI.undefine('spec.Mixin');
        });

    });

    describe('hooks', function() {

        var fooResult,
            extendLog;

        beforeEach(function() {

            fooResult = '';
            extendLog = [];

            CLI.define('Foo.M1', {
                extend: 'CLI.Mixin',

                mixinConfig: {
                    extended: function (base, derived, body) {
                        extendLog.push(derived.$className + ' extends ' + base.$className);
                    }
                },

                foo: function(s) {
                    fooResult += 'M1.foo' + s;
                },
                doBar: function(s) {
                    fooResult += 'M1.bar' + s;
                }
            });

            CLI.define('Foo.M2', {
                extend: 'Foo.M1',
                mixinConfig: {
                    on: {
                        foo: function(s) {
                            this.callParent(arguments); // Expected not to call anything.
                            // These cannot call parent for now.
                            fooResult += 'M2.foo' + s;
                        },
                        bar: 'doBar'
                    }
                },
                doBar: function (s) {
                    // This flavor will work since this is a normal class method
                    this.callParent(arguments);
                    fooResult += 'M2.bar' + s;
                }
            });

            CLI.define('Foo.A', {
                foo: function(s) {
                    fooResult += 'A.foo' + s;
                },
                bar: function(s) {
                    fooResult += 'A.bar' + s;
                }
            });

            CLI.define('Foo.B', {
                extend: 'Foo.A',
                foo: function(s) {
                    this.callParent(arguments);
                    fooResult += 'B.foo' + s;
                },
                bar: function(s) {
                    this.callParent(arguments);
                    fooResult += 'B.bar' + s;
                }
            });

            CLI.define('Foo.C', {
                extend: 'Foo.A',
                mixins: {
                    m2: 'Foo.M2'
                },
                foo: function(s) {
                    this.callParent(arguments);
                    fooResult += 'C.foo' + s;
                    return 'C.foo';
                },
                bar: function(s) {
                    this.callParent(arguments);
                    fooResult += 'C.bar' + s;
                }
            });

            CLI.define('Foo.D', {
                extend: 'Foo.B',
                mixins: {
                    m2: 'Foo.M2'
                },
                foo: function(s) {
                    this.callParent(arguments);
                    fooResult += 'D.foo' + s;
                    return 'D.foo';
                },
                bar: function(s) {
                    this.callParent(arguments);
                    fooResult += 'D.bar' + s;
                    return 42;
                }
            });

            CLI.define('Foo.E', {
                extend: 'Foo.C',
                foo: function(s) {
                    this.callParent(arguments);
                    fooResult += 'B.foo' + s;
                },
                bar: function(s) {
                    this.callParent(arguments);
                    fooResult += 'B.bar' + s;
                }
            });
        });

        afterEach(function() {
            CLI.undefine('Foo.M1');
            CLI.undefine('Foo.M2');
            CLI.undefine('Foo.A');
            CLI.undefine('Foo.B');
            CLI.undefine('Foo.C');
            CLI.undefine('Foo.D');
            CLI.undefine('Foo.E');
            CLI.undefine('Foo');
        });

        it('should call A then M2 then C', function() {

            var cInstance = new Foo.C(),
                result = cInstance.foo(' ');

            assert.equal(fooResult, 'A.foo M2.foo C.foo ');
            assert.equal(result, 'C.foo');
        });

        it('function hook should call A then B then M2 then C', function() {

            var dInstance = new Foo.D(),
                result = dInstance.foo(' ');

            assert.equal(fooResult, 'A.foo B.foo M2.foo D.foo ');
            assert.equal(result, 'D.foo');
        });

        it('named hook should call A then B then M2 then C', function() {

            var dInstance = new Foo.D(),
                result = dInstance.bar(' - ');

            assert.equal(fooResult, 'A.bar - B.bar - M1.bar - M2.bar - D.bar - ');
            assert.equal(result, 42);
        });

        it('should process extended option', function () {

            var s = extendLog.join('/');

            assert.equal(s, 'Foo.E extends Foo.C');
        });

    });

    // }}}
    // {{{ overriden methods

    describe("overriden methods", function() {

        it("should call self constructor", function() {

            var obj = new subClass;

            assert.equal(obj.subConstructorCalled, true);

        });

        it("should call parent constructor", function() {

            var obj = new subClass;

            assert.equal(obj.parentConstructorCalled, true);
        });

        it("should call mixins constructors", function() {

            var obj = new subClass;

            assert.equal(obj.mixinConstructor1Called, true);
            assert.equal(obj.mixinConstructor2Called, true);
        });

    });

    // }}}
    // {{{ callbacks

    describe("callbacks", function() {

        // {{{ extend

        describe("extend", function() {

            afterEach(function() {
                CLI.undefine('spec.Extend');
            });

            it("should set the scope to the created class", function() {

                var fn = function() {},
                    val;

                CLI.define('spec.Extend', {
                    extend: 'CLI.Base',
                    foo: fn
                }, function() {
                    val = this.prototype.foo;
                });

                assert.equal(val, fn);
            });

            it("should pass the created class", function() {

                var fn = function() {},
                    val;

                CLI.define('spec.Extend', {
                    extend: 'CLI.Base',
                    foo: fn
                }, function(Cls) {
                    val = Cls.prototype.foo;
                });

                assert.equal(val, fn);
            });

        });

        describe("override", function() {

            var base;

            beforeEach(function() {
                base = CLI.define('spec.Base', {});
            });

            afterEach(function() {
                CLI.undefine('spec.Base');
            });

            it("should set the scope to the overridden class", function() {

                var val;

                CLI.define('spec.Override', {
                    override: 'spec.Base'
                }, function() {
                    val = this;
                });

                assert.equal(val, base);
            });

            it("should pass the overridden class", function() {

                var val;

                CLI.define('spec.Override', {
                    override: 'spec.Base'
                }, function(Cls) {
                    val = Cls;
                });

                assert.equal(val, base);
            });

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
