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
// {{{ CLI.ClassManager

describe("CLI.ClassManager", function() {

    var manager = CLI.ClassManager,
        cls, emptyFn = function() {};

    beforeEach(function() {

        manager.enableNamespaceParseCache = false;

        global.My = {

            awesome: {
                Class: function() {console.log(11);},
                Class1: function() {console.log(12);},
                Class2: function() {console.log(13);}
            },

            cool: {
                AnotherClass: function() {console.log(21);},
                AnotherClass1: function() {console.log(22);},
                AnotherClass2: function() {console.log(23);}
            }

        };

    });

    afterEach(function() {

        try {
            delete global.Something;
            delete global.My;
            delete global.I;
            delete global.Test;
        } catch (e) {
            global.Something = undefined;
            global.My = undefined;
            global.I = undefined;
            global.Test = undefined;
        }
        manager.enableNamespaceParseCache = true;
    });

    // {{{ parseNamespace

    describe("parseNamespace", function() {

        it("should return the broken-down namespace", function() {

            var parts = manager.parseNamespace('Some.strange.alien.Namespace');

            assert.deepEqual(parts, [CLI.global, 'Some', 'strange', 'alien', 'Namespace']);

        });

        it("should return the broken-down namespace with object rewrites", function() {

            var parts = manager.parseNamespace('CLI.some.Namespace');

            assert.deepEqual(parts, [CLI, 'some', 'Namespace']);

        });

    });

    // }}}
    // {{{ exist

    describe("exist", function() {

        it("should return whether a single class exists", function() {

            assert.equal(manager.isCreated('My.notexisting.Class'), false);
            assert.equal(manager.isCreated('My.awesome.Class'), true);

        });

    });

    // }}}
    // {{{ loader preprocessor

    describe("loader preprocessor", function() {

        beforeEach(function() {
            cls = function() {};
        });

        /*
        it("should load and replace string class names with objects", function() {

            var data = {
                    extend: 'My.awesome.Class',
                    mixins: {
                        name1: My.cool.AnotherClass,
                        name2: 'My.cool.AnotherClass1'
                    }
                },
                expected = {
                    extend: My.awesome.Class,
                    mixins: {
                        name1: My.cool.AnotherClass,
                        name2: My.cool.AnotherClass1
                    }
                },
                classNames;

            spyOn(CLI.Loader, 'require').andCallFake(function(classes, fn) {
                classNames = classes;
                fn();
            });

            CLI.Class.getPreprocessor('loader').fn(cls, data, emptyFn, emptyFn);

            expect(CLI.Loader.require).toHaveBeenCalled();
            expect(classNames).toEqual(['My.awesome.Class', 'My.cool.AnotherClass1']);
            expect(data).toEqual(expected);

        });
       */

        // }}}

    });

    // {{{ create

    describe("create", function() {

        var subClass, parentClass, mixinClass1, mixinClass2, subSubClass;

        beforeEach(function() {

            mixinClass1 = manager.create('I.am.the.MixinClass1', {

                config: {
                    mixinConfig: 'mixinConfig'
                },

                constructor: function() {
                    this.mixinConstructor1Called = true;
                },

                mixinProperty1: 'mixinProperty1',

                mixinMethod1: function() {
                    this.mixinMethodCalled = true;
                }
            });

            mixinClass2 = manager.create('I.am.the.MixinClass2', {
                constructor: function() {
                    this.mixinConstructor2Called = true;
                },

                mixinProperty2: 'mixinProperty2',

                mixinMethod2: function() {
                    this.mixinMethodCalled = true;
                }
            });

            parentClass = manager.create('I.am.the.ParentClass', {
                alias: ['parentclass', 'superclass'],

                mixins: {
                    mixin1: 'I.am.the.MixinClass1'
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

                onClassExtended: function(subClass, data) {
                    subClass.onClassExtendedCalled = true;
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

            subClass = manager.create('I.am.the.SubClass', {

                alias: 'subclass',

                extend: 'I.am.the.ParentClass',

                mixins: {
                    mixin1: 'I.am.the.MixinClass1',
                    mixin2: 'I.am.the.MixinClass2'
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
                constructor: function() {
                    this.subConstrutorCalled = true;

                    this.superclass.constructor.apply(this, arguments);

                    this.mixins.mixin2.constructor.apply(this, arguments);
                },
                myOwnMethod: function() {
                    this.myOwnMethodCalled = true;
                }
            });
        });

        afterEach(function() {
            CLI.undefine('I.am.the.MixinClass1');
            CLI.undefine('I.am.the.MixinClass2');
            CLI.undefine('I.am.the.ParentClass');
            CLI.undefine('I.am.the.SubClass');
        });

        it("should create the namespace", function() {

            assert.notEqual(I, undefined);
            assert.notEqual(I.am, undefined);
            assert.notEqual(I.am.the, undefined);
            assert.notEqual(I.am.the.SubClass, undefined);

        });

        it("should get className", function() {

            assert.equal(CLI.getClassName(subClass), 'I.am.the.SubClass');

        });

        // {{{ addStatics

        describe("addStatics", function() {

            it("single with name - value arguments", function() {

                var called = false;

                subClass.addStatics({
                    staticMethod: function() {
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
                    staticMethod: function() {}
                });

                assert.equal(subClass.staticProperty, 'something');
                assert.notEqual(subClass.staticMethod, undefined);

            });

        });

        // }}}
        // {{{ mixin

        describe("mixin", function() {

            it("should have all properties of mixins", function() {

                var obj = new subClass();

                assert.equal(obj.mixinProperty1, 'mixinProperty1');
                assert.equal(obj.mixinProperty2, 'mixinProperty2');
                assert.notEqual(obj.mixinMethod1, undefined);
                assert.notEqual(obj.mixinMethod2, undefined);
                assert.equal(obj.config.mixinConfig, 'mixinConfig');

            });

        });

        // }}}
        // {{{ config

        describe("config", function() {

            /*
            it("should merge properly", function() {

                var obj = new subClass();

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

            });
           */

            it("should apply default config", function() {

                var obj = new subClass();

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

        });

        // }}}
        // {{{ overriden methods

        describe("overriden methods", function() {

            it("should call self constructor", function() {

                var obj = new subClass();

                assert.equal(obj.subConstrutorCalled, true);

            });

            it("should call parent constructor", function() {

                var obj = new subClass();

                assert.equal(obj.parentConstructorCalled, true);

            });

            it("should call mixins constructors", function() {

                var obj = new subClass();

                assert.equal(obj.mixinConstructor1Called, true);
                assert.equal(obj.mixinConstructor2Called, true);

            });

        });

        // }}}
        // {{{ alias

        describe("alias", function() {

            it("should store alias", function() {

                assert.equal(manager.getByAlias('subclass'), subClass);

            });

            it("should store multiple aliases", function() {

                assert.equal(manager.getByAlias('parentclass'), parentClass);
                assert.equal(manager.getByAlias('superclass'), parentClass);

            });

        });

        // }}}

    });

    // }}}
    // {{{ define

    describe('define', function () {

        it('should allow anonymous classes', function () {

            var T = CLI.define(null, function (Self) {
                return {
                    constructor: function () {
                        this.foo = 1;
                        this.T = Self;
                    }
                }
            });

            var obj = new T();

            assert.equal(obj.foo, 1);
            assert.equal(T, obj.self);
            assert.equal(obj.T, T);
            assert.equal(obj.$className, null);

        });

    });

    // }}}
    // {{{ instantiate

    describe("instantiate", function() {

        beforeEach(function() {

            manager.create('Test.stuff.Person', {
                alias: 'person',

                constructor: function(name, age, sex) {
                    this.name = name;
                    this.age = age;
                    this.sex = sex;
                },

                eat: function(food) {
                    this.eatenFood = food;
                }
            });

            manager.create('Test.stuff.Developer', {

                alias: 'developer',

                extend: 'Test.stuff.Person',

                constructor: function(isGeek, name, age, sex) {
                    this.isGeek = isGeek;

                    return this.superclass.constructor.apply(this, arguments);
                },

                code: function(language) {
                    this.languageCoded = language;
                    this.eat('bugs');
                }
            });
        });

        afterEach(function() {
            CLI.undefine('Test.stuff.Person');
            CLI.undefine('Test.stuff.Developer');
        });

        it("should create the instance by full class name", function() {

            var me = CLI.create('Test.stuff.Person', 'Jacky', 24, 'male');

            assert.equal(me instanceof Test.stuff.Person, true);

        });

        it("should create the instance by alias", function() {

            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');

            assert.equal(me instanceof Test.stuff.Person, true);

        });

        it("should pass all arguments to the constructor", function() {

            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');

            assert.equal(me.name, 'Jacky');
            assert.equal(me.age, 24);
            assert.equal(me.sex, 'male');

        });

        it("should have all methods in prototype", function() {

            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');

            me.eat('rice');

            assert.equal(me.eatenFood, 'rice');

        });

        it("should works with inheritance", function() {

            var me = manager.instantiateByAlias('developer', true, 'Jacky', 24, 'male');

            me.code('javascript');

            assert.equal(me.languageCoded, 'javascript');
            assert.equal(me.eatenFood, 'bugs');

        });

    });

    // }}}
    // {{{ post-processors

    describe("post-processors", function() {

        afterEach(function() {
            CLI.undefine('Something.Cool');
        });

        xdescribe("uses", function() {
            //expect(Something.Cool).toBeDefined();
            //expect(Something.Cool instanceof test).toBeTruthy();
        });

        // {{{ singleton

        describe("singleton", function() {

            it("should create the instance namespace and return the class", function() {

                var test = CLI.define('Something.Cool', {
                    singleton: true,
                    someMethod: function() {
                        this.someMethodCalled = true;
                    },
                    someProperty: 'something'
                });

                assert.notEqual(Something.Cool, undefined);
                assert.equal(Something.Cool instanceof test, true);

            });

        });

        // }}}
        // {{{ alias xtype

        describe("alias xtype", function() {

            it("should set xtype as a static class property", function() {

                var test = CLI.define('Something.Cool', {
                    alias: 'widget.cool'
                });

                assert.equal(Something.Cool.xtype, 'cool');

            });
        });

        // }}}
        // {{{ alternate

        describe("alternate", function() {

            it("should create the alternate with a string for alternateClassName property", function() {

                CLI.define('Something.Cool', {
                    alternateClassName: 'Something.CoolAsWell',

                    someMethod: function() {
                        this.someMethodCalled = true;
                    },

                    someProperty: 'something'
                });

                assert.notEqual(Something.CoolAsWell, undefined);
                assert.equal(Something.CoolAsWell, Something.Cool);

            });

            it("should create the alternate with an array for alternateClassName property", function() {

                CLI.define('Something.Cool', {
                    alternateClassName: ['Something.CoolAsWell', 'Something.AlsoCool']
                });

                assert.equal(Something.CoolAsWell, Something.Cool);
                assert.equal(Something.AlsoCool, Something.Cool);

            });

        });

        // }}}

    });

    // }}}
    // {{{ createNamespaces

    describe("createNamespaces", function() {

        var w = global;

        it("should have an alias CLI.namespace", function() {

            var spy = sinon.spy(CLI.ClassManager, 'createNamespaces');

            CLI.namespace('a', 'b', 'c');

            assert.deepEqual(spy.lastCall.args, ['a', 'b', 'c']);

        });

        it("should create a single top level namespace", function() {

            CLI.ClassManager.createNamespaces('FooTest1');

            assert.notEqual(w.FooTest1, undefined);

            delete w.FooTest1;
        });

        it("should create multiple top level namespace", function() {

            CLI.ClassManager.createNamespaces('FooTest2', 'FooTest3', 'FooTest4');

            assert.notEqual(w.FooTest2, undefined);
            assert.notEqual(w.FooTest3, undefined);
            assert.notEqual(w.FooTest4, undefined);

            delete w.FooTest2;
            delete w.FooTest3;
            delete w.FooTest4;

        });

        it("should create a chain of namespaces, starting from a top level", function() {

            CLI.ClassManager.createNamespaces('FooTest5', 'FooTest5.ns1', 'FooTest5.ns1.ns2', 'FooTest5.ns1.ns2.ns3');

            assert.notEqual(w.FooTest5, undefined);
            assert.notEqual(w.FooTest5.ns1, undefined);
            assert.notEqual(w.FooTest5.ns1.ns2, undefined);
            assert.notEqual(w.FooTest5.ns1.ns2.ns3, undefined);

            delete w.FooTest5;

        });

        it("should create lower level namespaces without first defining the top level", function() {

            CLI.ClassManager.createNamespaces('FooTest6.ns1', 'FooTest7.ns2');

            assert.notEqual(w.FooTest6, undefined);
            assert.notEqual(w.FooTest6.ns1, undefined);
            assert.notEqual(w.FooTest7, undefined);
            assert.notEqual(w.FooTest7.ns2, undefined);

            delete w.FooTest6;
            delete w.FooTest7;

        });

        it("should create a lower level namespace without defining the middle level", function() {

            CLI.ClassManager.createNamespaces('FooTest8', 'FooTest8.ns1.ns2');

            assert.notEqual(w.FooTest8, undefined);
            assert.notEqual(w.FooTest8.ns1, undefined);
            assert.notEqual(w.FooTest8.ns1.ns2, undefined);

            delete w.FooTest8;

        });

        it ("should not overwritte existing namespace", function() {

            CLI.ClassManager.createNamespaces('FooTest9');

            FooTest9.prop1 = 'foo';

            CLI.ClassManager.createNamespaces('FooTest9');

            assert.equal(FooTest9.prop1, "foo");

            delete w.FooTest9;

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
