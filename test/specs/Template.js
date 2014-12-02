/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

// {{{ helper

require('../helper.js');

// }}}
// {{{ assert

var assert = require('power-assert');

// }}}
// {{{ sinon

var sinon = require('sinon');

// }}}

// {{{ require CLI

require('../../index.js');

// }}}
// {{{ CLI.Template

describe("CLI.Template", function() {

    // {{{ instantiation

    describe("instantiation", function() {

        var tpl;

        it("it should extend CLI.Base", function() {

            tpl = new CLI.Template("");

            assert.equal(tpl.superclass, CLI.Base.prototype);

        });

        // {{{ configuration options

        describe("configuration options", function() {

            it("should disableFormats by default", function() {

                tpl = new CLI.Template("");

                assert.equal(tpl.disableFormats, false);

            });

        });

        // }}}

        it("should alias apply with applyTemplate", function() {

            tpl = new CLI.Template("");

            var spy = sinon.spy(tpl, 'apply');

            tpl.applyTemplate();

            assert.equal(spy.called, true);

            spy.restore();

        });

        it("should be able to compile immediately", function() {

            var spy = sinon.spy(CLI.Template.prototype, "compile");

            tpl = new CLI.Template('Hello {foo}', {
                compiled: true
            });
            // must call the new tpl for it bother compiling it
            var s = tpl.apply({ foo: 42 });

            assert.equal(s, 'Hello 42');
            assert.equal(spy.called, true);

            spy.restore();

        });

        // {{{ constructor arguments

        describe("constructor arguments", function() {

            // {{{ objects

            describe("objects", function() {

                it("should apply all object passed after first arguments to configuration", function() {

                    var o1 = {a: 1},
                        o2 = {a: 2},
                        o3 = {a: 3};

                    var spy = sinon.spy(CLI, "apply");

                    tpl = new CLI.Template("", o1, o2, o3);

                    assert.deepEqual(spy.args[1], [tpl, o1]);
                    assert.deepEqual(spy.args[3], [tpl, o2]);
                    assert.deepEqual(spy.args[5], [tpl, o3]);

                    CLI.apply.restore();

                });
            });

            // }}}
            // {{{ strings

            describe("strings", function() {

                it("should concat all strings passed as arguments", function() {

                    var s1 = 'a',
                        s2 = 'b',
                        s3 = 'c';

                    tpl = new CLI.Template(s1, s2, s3);

                    assert.equal(tpl.html, s1 + s2 + s3);

                });

            });

            // }}}
            // {{{ array

            describe("array", function() {

                it("should concat all array strings", function() {

                    var tpl = new CLI.Template(['foo', 'bar', 'baz']);

                    assert.equal(tpl.html, 'foobarbaz');

                });

                it("should apply an objects after the first argument to the template", function() {

                    var o1 = {
                        a: function() {}
                    }, o2 = {
                        b: function() {}
                    };

                    var tpl = new CLI.Template(['foo', 'bar', o1, o2]);

                    assert.equal(tpl.html, 'foobar');
                    assert.equal(tpl.a, o1.a);
                    assert.equal(tpl.b, o2.b);

                });

            });

            // }}}

        });

        // }}}

    });

    // }}}
    // {{{ methods

    describe("methods", function() {

        var appliedArr,
            appliedObject,
            simpleTpl,
            complexTpl;

        beforeEach(function() {

            simpleTpl = new CLI.Template('<div class="template">Hello {0}.</div>');
            appliedArr = ["world"];

            complexTpl = new CLI.Template([
                    '<div name="{id}">',
                        '<span class="{cls}">{name} {value:ellipsis(10)}</span>',
                    '</div>'
            ]);

            appliedObject = {id: "myid", cls: "myclass", name: "foo", value: "bar"};

        });

        afterEach(function() {
        });

        // {{{ set

        describe("set", function() {

            var tplString = '<div class="template">Good bye {0}.</div>';

            it("should set the HTML used as the template", function() {

                 simpleTpl.set(tplString);

                 assert.equal(simpleTpl.apply(["world"]), '<div class="template">Good bye world.</div>');
            });

            it("should be able to compile the template", function() {

                simpleTpl.set(tplString, true);

                var s = simpleTpl.apply([42]);

                // must call the new tpl for it bother compiling it
                assert.equal(s, '<div class="template">Good bye 42.</div>');
                assert.equal(typeof simpleTpl.fn === "function", true);

            });

        });

        // }}}
        // {{{ compile

        describe("compile", function() {

            it("should call compiled function", function() {

                complexTpl.compile();

                var spy = sinon.spy(complexTpl, "fn");

                complexTpl.apply(appliedObject);

                assert.deepEqual(spy.lastCall.args[0], appliedObject);

                spy.restore();

            });

            it("should return the same value as if it wasn't compiled with a complex template", function() {

                var htmlWithNotCompiledTemplate,
                    htmlWithCompiledTemplate;

                htmlWithNotCompiledTemplate = complexTpl.apply(appliedObject);
                complexTpl.compile();
                htmlWithCompiledTemplate = complexTpl.apply(appliedObject);

                assert.equal(htmlWithCompiledTemplate, htmlWithNotCompiledTemplate);

            });

            it("should return the same value as if it wasn't compiled with a simple template", function() {

                var htmlWithNotCompiledTemplate,
                    htmlWithCompiledTemplate;

                htmlWithNotCompiledTemplate = simpleTpl.apply(appliedArr);
                simpleTpl.compile();
                htmlWithCompiledTemplate = simpleTpl.apply(appliedArr);

                assert.equal(htmlWithCompiledTemplate, htmlWithNotCompiledTemplate);
            });

            it("should return the template itself", function() {
                assert.equal(simpleTpl.compile(), simpleTpl);
            });

        });

        // }}}

    });

    // }}}
    // {{{ formats

    describe("formats", function() {

        var tpl,
            ellipsisSpy,
            htmlEncodeSpy,
            appliedObject;

        beforeEach(function() {

            appliedObject = {a: "123", b: "456789"};

            ellipsisSpy = sinon.spy(CLI.util.Format, "ellipsis");
            htmlEncodeSpy = sinon.spy(CLI.util.Format, "htmlEncode");

        });

        afterEach(function() {
            ellipsisSpy.restore();
            htmlEncodeSpy.restore();
        });

        describe("enabled", function() {

            beforeEach(function() {
                tpl = new CLI.Template(
                    '{a:ellipsis(2)}',
                    '{b:htmlEncode}'
                );
            });

            it("should call CLI.util.Format.ellipsis with a non compiled template", function() {

                tpl.apply(appliedObject);

                assert.deepEqual(ellipsisSpy.lastCall.args, [appliedObject.a, 2]);
                assert.equal(htmlEncodeSpy.lastCall.args[0], appliedObject.b);

            });

            it("should call CLI.util.Format.ellipsis with compiled template", function() {

                tpl.compile();
                tpl.apply(appliedObject);

                assert.deepEqual(ellipsisSpy.lastCall.args, [appliedObject.a, 2]);
                assert.equal(htmlEncodeSpy.lastCall.args[0], appliedObject.b);

            });
        });

        // }}}
        // {{{ disabled

        describe("disabled", function() {

            beforeEach(function() {
                tpl = new CLI.Template(
                    '{a:ellipsis(2)}',
                    {disableFormats: true}
                );
            });

            it("should not call CLI.util.Format.ellipsis with a non compiled template", function() {

                tpl.apply(appliedObject);

                assert.equal(ellipsisSpy.called, false);
            });

            it("should not call CLI.util.Format.ellipsis with compiled template", function() {
                tpl.compile();
                tpl.apply(appliedObject);

                assert.equal(ellipsisSpy.called, false);
            });

        });

        // }}}

    });

    // }}}
    // {{{ members functions

    describe("members functions", function() {

        var tpl,
            memberFn,
            appliedObject;

        beforeEach(function() {

            memberFn = sinon.spy({
                fake: function(a, inc) {
                    return a + inc;
                }
            }, 'fake');

            var obj = {
                referenceHolder: true,
                controller: 'foo',

                fmt: function () {

                },
                promote: function () {
                //
                },

                items: [{
                    items: [{
                        xtype: 'button',
                        reference: 'btn',
                        listeners: {
                            click: 'promote'
                        },
                        bind: {
                            text: 'Promote {user.name:this.fmt}'
                        }
                    }]
                }]
            }

            tpl = new CLI.Template(
                '{a:this.increment(7)}',
                {increment: memberFn}
            );

            appliedObject = {a: 1};

        });

        it("should call members functions with a non compiled template", function() {

            tpl.apply(appliedObject);

            assert.deepEqual(memberFn.lastCall.args, [1, 7]);

        });

        it("should call members functions with a compiled template", function() {

            tpl.compile();
            tpl.apply(appliedObject);

            assert.deepEqual(memberFn.lastCall.args, [1, 7]);

        });

        it("should add member function in initialConfig", function() {

            assert.deepEqual(tpl.initialConfig, {increment: memberFn});

        });

    });

    // }}}

    function testTemplate(compiled) {

        describe('Using numeric tokens and a values array', function() {

            it('should use CLI.util.Format formatting functions by default', function() {

                assert.equal(new CLI.Template('Value: {0:number("0.00")}', {compiled: compiled}).apply([3.257]), "Value: 3.26");

            });

            it('should use member formatting functions when prepended with "this."', function() {

                var tpl = [
                    'Warning: {0:this.bold}',
                    {
                        bold: function(v) {
                            return '<b>' + v + '</b>';
                        },
                        compiled: compiled
                    }
                ];

                assert.equal(new CLI.Template(tpl).apply(['Warning message']), "Warning: <b>Warning message</b>");

            });

            it('should not see "{margin:0} as a token', function() {

                assert.equal(new CLI.Template('p{margin:0}body{direction:{0}}', {compiled: compiled}).apply(['rtl']), 'p{margin:0}body{direction:rtl}');

            });

            it('should not see "{1:someText} as a token', function() {

                assert.equal(new CLI.Template('{0}{1:sometext}{1}', {compiled: compiled}).apply(['foo', 'bar']), 'foo{1:sometext}bar');

            });

        });

        describe('Using alphanumeric tokens and a values object', function() {

            it('should use CLI.util.Format formatting functions by default', function() {

                assert.equal(new CLI.Template('Value: {prop0:number("0.00")}', {compiled: compiled}).apply({prop0:3.257}), "Value: 3.26");

            });

            it('should use member formatting functions when prepended with "this."', function() {

                var tpl = [
                    'Warning: {prop0:this.bold}',
                    {
                        bold: function(v) {
                            return '<b>' + v + '</b>';
                        },
                        compiled: compiled
                    }
                ]

                assert.equal(new CLI.Template(tpl).apply({prop0:'Warning message'}), "Warning: <b>Warning message</b>");

            });

            it('should not see "{margin:0} as a token', function() {

                assert.equal(new CLI.Template('p{margin:0}body{direction:{prop0}}', {compiled: compiled}).apply({prop0:'rtl'}), 'p{margin:0}body{direction:rtl}');

            });

            it('should not see "{1:someText} as a token', function() {

                assert.equal(new CLI.Template('{prop0}{1:sometext}{prop1}', {compiled: compiled}).apply({prop0:'foo', prop1:'bar'}), 'foo{1:sometext}bar');

            });

        });

    }

    // {{{ Non-compiled

    describe('Non-compiled', function() {

        testTemplate(false);

    });

    // }}}
    // {{{ Compiled

    describe('Compiled', function() {

        testTemplate(true);

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
