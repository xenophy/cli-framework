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
// {{{ CLI.Error

describe("CLI.Error", function() {

    /*
    var global;

    beforeEach(function() {
        global = CLI.global;

        // mock the console to avoid logging to the real console during the tests
        CLI.global = {
            console: {
                dir: function(s) {
                    return s;
                },
                log: function(s) {
                    return s;
                },
                error: function(s) {
                    return s;
                },
                warn: function(s) {
                    return s;
                }
            }
        };
    });

    afterEach(function() {
        CLI.global = global;
    });

    describe("raising an error via CLI.Error.raise", function() {

        describe("passing a string", function() {

            it("should throw an error with a msg property", function() {
                var error;
                try {
                    CLI.Error.raise('foo');
                }
                catch (err) {
                    error = err;
                }
                expect(error.msg).toEqual('foo');
            });

            it("should log an error to the console", function() {
                spyOn(CLI.global.console, 'error');
                try {
                    CLI.Error.raise('foo');
                }
                catch (err) {}
                expect(CLI.global.console.error).toHaveBeenCalledWith('[E] foo');
            });

            it("should log the error object to the console", function() {
                spyOn(CLI.global.console, 'dir').andCallFake(function(err) {
                    expect(err.msg).toEqual('foo');
                });
                try {
                    CLI.Error.raise('foo');
                }
                catch (err) {}
            });

            it("should do nothing when CLI.Error.ignore = true", function() {
                spyOn(CLI.global.console, 'warn');

                CLI.Error.ignore = true;
                try {
                    CLI.Error.raise('foo');
                }
                catch (err) {
                    expect('Error should not have been caught').toBe(true);
                }
                expect(CLI.global.console.warn).not.toHaveBeenCalled();
                CLI.Error.ignore = false;
            });

            it("should not throw an error if handled by CLI.Error.handle", function() {
                spyOn(CLI.global.console, 'warn');

                var origHandle = CLI.Error.handle;
                CLI.Error.handle = function(err) {
                    expect(err.msg).toEqual('foo');
                    return true;
                }
                try {
                    CLI.Error.raise('foo');
                }
                catch (err) {
                    expect('Error should not have been caught').toBe(true);
                }
                expect(CLI.global.console.warn).not.toHaveBeenCalled();
                CLI.Error.handle = origHandle;
            });
        });

        describe("passing an object with a msg property", function() {

            it("should throw an error with a msg property", function() {
                var error;
                try {
                    CLI.Error.raise({msg: 'foo'});
                }
                catch (err) {
                    error = err;
                }
                expect(error.msg).toEqual('foo');
            });

            it("should log an error to the console", function() {
                spyOn(CLI.global.console, 'error');
                try {
                    CLI.Error.raise({msg: 'foo'});
                }
                catch (err) {}
                expect(CLI.global.console.error).toHaveBeenCalledWith('[E] foo');
            });

            it("should log the error object to the console", function() {
                spyOn(CLI.global.console, 'dir').andCallFake(function(err) {
                    expect(err.msg).toEqual('foo');
                });
                try {
                    CLI.Error.raise({msg: 'foo'});
                }
                catch (err) {}
            });

            it("should do nothing when CLI.Error.ignore = true", function() {
                spyOn(CLI.global.console, 'warn');

                CLI.Error.ignore = true;
                try {
                    CLI.Error.raise({msg: 'foo'});
                }
                catch (err) {
                    expect('Error should not have been caught').toBe(true);
                }
                expect(CLI.global.console.warn).not.toHaveBeenCalled();
                CLI.Error.ignore = false;
            });

            it("should not throw an error if handled by CLI.Error.handle", function() {
                spyOn(CLI.global.console, 'warn');

                var origHandle = CLI.Error.handle;
                CLI.Error.handle = function(err) {
                    expect(err.msg).toEqual('foo');
                    return true;
                }
                try {
                    CLI.Error.raise({msg: 'foo'});
                }
                catch (err) {
                    expect('Error should not have been caught').toBe(true);
                }
                expect(CLI.global.console.warn).not.toHaveBeenCalled();
                CLI.Error.handle = origHandle;
            });
        });

        describe("passing an object with custom metadata", function() {

            it("should throw an error with matching metadata", function() {
                var error;
                try {
                    CLI.Error.raise({
                        msg: 'Custom error',
                        data: {
                            foo: 'bar'
                        }
                    });
                }
                catch (err) {
                    error = err;
                }
                expect(error.msg).toEqual('Custom error');
                expect(error.data).not.toBe(null);
                expect(error.data.foo).toEqual('bar');
            });

            it("should log the complete metadata to the console", function() {
                spyOn(CLI.global.console, 'dir').andCallFake(function(err) {
                    expect(err.msg).toEqual('Custom error');
                    expect(err.data).not.toBe(null);
                    expect(err.data.foo).toEqual('bar');
                });
                try {
                    CLI.Error.raise({
                        msg: 'Custom error',
                        data: {
                            foo: 'bar'
                        }
                    });
                }
                catch (err) {}
            });
        });

        describe("originating from within a class defined by CLI Framework", function() {
            var customObj;

            beforeEach(function() {
                CLI.define('spec.CustomClass', {
                    doSomething: function(o) {
                        CLI.Error.raise({
                            msg: 'Custom error',
                            data: o,
                            foo: 'bar'
                        });
                    }
                });
                customObj = CLI.create('spec.CustomClass');
            });

            afterEach(function() {
                CLI.undefine('spec.CustomClass');
            });

            it("should throw an error containing the source class and method", function() {
                var error;
                try {
                    customObj.doSomething({
                        extraData: 'extra'
                    });
                }
                catch (err) {
                    error = err;
                }
                expect(error.msg).toEqual('Custom error');
                expect(error.sourceClass).toEqual('spec.CustomClass');
                expect(error.sourceMethod).toEqual('doSomething');
                expect(error.toString()).toBe('spec.CustomClass.doSomething(): Custom error');
            });

            it("should log the complete metadata to the console", function() {
                spyOn(CLI.global.console, 'dir').andCallFake(function(err) {
                    expect(err.msg).toEqual('Custom error');
                    expect(err.sourceClass).toEqual('spec.CustomClass');
                    expect(err.sourceMethod).toEqual('doSomething');
                    expect(err.data).not.toBe(null);
                    expect(err.data.extraData).not.toBe(null);
                    expect(err.data.extraData).toEqual('extra');
                    expect(err.foo).toEqual('bar');
                });
                try {
                    customObj.doSomething({
                        extraData: 'extra'
                    });
                }
                catch (err) {
                }
            });
        });
    });

    describe("Throwing an an CLI.Error directly intantiated", function() {
        describe("Passing an string as constructor argument", function() {
           it("should contain a msg property with the given string as value", function() {
              expect(function() {
                  throw new CLI.Error("expected message");
              }).toRaiseExtError("expected message");
           });
        });
     });

    xdescribe("CLI.deprecated", function() {
       // failing only on CI
       it("should return a function that raises an error with the given suggestion", function() {
          CLI.ClassManager.enableNamespaceParseCache = false;
          CLI.define("spec.MyClass", {
             deprecatedMethod : CLI.deprecated("use another function")
          });
          expect(function() {
              new spec.ThisClassContainsADeprecatedMethod().deprecatedMethod();
          }).toThrow('The method "spec.MyClass.deprecatedMethod" has been removed. use another function');

          CLI.undefine('spec.MyClass');
          CLI.ClassManager.enableNamespaceParseCache = true;
       });
    });

    */
});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
