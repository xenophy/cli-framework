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
// {{{ CLI.Object

describe("CLI.Object", function() {

    // {{{ size

    describe("size", function() {

        it("should return 0 when there are no properties", function() {

            var o = {};

            assert.equal(CLI.Object.getSize(o), 0);
        });

        it("should return the number of keys", function() {

            var o = {
                key1: true,
                key2: true,
                key3: true,
                key4: true
            };

            assert.equal(CLI.Object.getSize(o), 4);
        });

    });

    // }}}
    // {{{ clear

    describe("clear", function () {

        it("should remove a single key", function () {

            var obj = { x: 42 };

            CLI.Object.clear(obj);

            assert.equal(obj.hasOwnProperty('x'), false);
        });

        it("should remove multiple keys", function() {

            var obj = { a: 1, b: 2, c: 3 };

            CLI.Object.clear(obj);

            assert.equal(obj.hasOwnProperty('a'), false);
            assert.equal(obj.hasOwnProperty('b'), false);
            assert.equal(obj.hasOwnProperty('c'), false);
        });

        it("should retain items that are not hasOwnProperty on the object", function() {

            var obj = CLI.Object.chain({
                a: 1,
                b: 2
            });

            obj.c = 3;

            CLI.Object.clear(obj);

            assert.equal(obj.hasOwnProperty('c'), false);
            assert.equal(obj.a, 1);
            assert.equal(obj.b, 2);
        });

        it("should return the object", function() {

            var obj = {};

            assert.deepEqual(CLI.Object.clear(obj), obj);
        });

    });

    // }}}
    // {{{ isEmpty

    describe("isEmpty", function() {

        it("should return true if there are no properties", function() {

            var o = {};

            assert.equal(CLI.Object.isEmpty(o), true);
        });

        it("should return false if there are properties", function() {

            var o = {
                key1: true
            };

            assert.equal(CLI.Object.isEmpty(o), false);
        });

    });

    // }}}
    // {{{ getKeys

    describe("getKeys", function() {

        var getKeys = CLI.Object.getKeys;

        it("should return an empty array for a null value", function() {

            assert.deepEqual(getKeys(null), []);
        });

        it("should return an empty array for an empty object", function() {
            assert.deepEqual(getKeys({}), []);
        });

        it("should return all the keys in the object", function() {

            assert.deepEqual(getKeys({
                foo: 1,
                bar: 2,
                baz: 3
            }), ['foo', 'bar', 'baz']);

        });

    });

    // }}}
    // {{{ getValues

    describe("getValues", function() {

        var getValues = CLI.Object.getValues;

        it("should return an empty array for a null value", function() {

            assert.deepEqual(getValues(null), []);

        });

        it("should return an empty array for an empty object", function() {

            assert.deepEqual(getValues({}), []);

        });

        it("should return all the values in the object", function() {

            assert.deepEqual(getValues({
                foo: 1,
                bar: 2,
                baz: 3
            }), [1, 2, 3]);

        });

    });

    // }}}
    // {{{ getKey

    describe("getKey", function() {

        var getKey = CLI.Object.getKey;

        it("should return null for a null object", function() {

            assert.equal(getKey(null, 'foo'), null);

        });

        it("should return null for an empty object", function() {

            assert.equal(getKey({}, 'foo'), null);

        });

        it("should return null if the value doesn't exist", function() {

            assert.equal(getKey({
                foo: 1,
                bar: 2
            }, 3), null);

        });

        it("should only do strict matching", function() {

            assert.equal(getKey({
                foo: 1
            }, '1'), null);

        });

        it("should return the correct key if it matches", function() {

            assert.equal(getKey({
                foo: 1
            }, 1), 'foo');

        });

        it("should only return the first matched value", function() {

            assert.equal(getKey({
                bar: 1,
                foo: 1
            }, 1), 'bar');

        });

    });

    // }}}
    // {{{ equals

    describe("equals", function() {

        var equals = CLI.Object.equals;

        it("should match undefined", function() {

            assert.equal(equals(undefined, undefined), true);

        });

        it("should match null", function() {

            assert.equal(equals(null, null), true);

        });

        it("should not match if one object is null", function() {

            assert.equal(equals({}, null), false);

        });

        it("should not match if the objects have different keys", function() {

            var o1 = {
                foo: true
            };

            var o2 = {
                bar: true
            };

            assert.equal(equals(o1, o2), false);

        });

        it("should not match if keys have different values", function() {

            var o1 = {
                foo: 1
            };

            var o2 = {
                foo: 2
            };

            assert.equal(equals(o1, o2), false);

        });

        it("should use strict equality", function() {

            var o1 = {
                foo: 1
            };

            var o2 = {
                foo: '1'
            };

            assert.equal(equals(o1, o2), false);

        });

        it("should match objects with the same keys/values", function() {

            var o1 = {
                foo: 'value',
                bar: true
            };

            var o2 = {
                foo: 'value',
                bar: true
            };

            assert.equal(equals(o1, o2), true);

        });

        it("should ignore key ordering", function() {

            var o1 = {
                bar: true,
                foo: 'value'
            };

            var o2 = {
                foo: 'value',
                bar: true
            };

            assert.equal(equals(o1, o2), true);

        });

    });

    // }}}
    // {{{ each

    describe("each", function() {

        var each = CLI.Object.each;

        // {{{ scope/params

        describe("scope/params", function() {

            it("should execute using the passed scope", function() {

                var scope = {},
                    actual;

                each({
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, function() {
                    actual = this;
                }, scope);

                assert.equal(actual, scope);

            });

            it("should default the scope to the object", function() {

                var o = {
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, actual;

                each(o, function() {
                    actual = this;
                });

                assert.equal(actual, o);

            });

            it("should execute passing the key value and object", function() {

                var keys = [],
                    values = [],
                    data = {
                        foo: 1,
                        bar: 'value',
                        baz: false
                    },
                    obj;

                each(data, function(key, value, o){
                    keys.push(key);
                    values.push(value);
                    obj = o;
                });


                assert.deepEqual(keys, ['foo', 'bar', 'baz']);
                assert.deepEqual(values, [1, 'value', false]);
                assert.equal(obj, data);

            });

        });

        // }}}
        // {{{ stopping

        describe("stopping", function() {

            it("should not stop by default", function() {

                var count = 0;

                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function() {
                    ++count;
                });

                assert.equal(count, 4);

            });

            it("should only stop if the function returns false", function() {

                var count = 0;

                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function() {
                    ++count;
                    return null;
                });

                assert.equal(count, 4);

            });

            it("should stop immediately when false is returned", function() {

                var count = 0;

                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(key){
                    ++count;
                    return key != 'b';
                });

                assert.equal(count, 2);

            });

        });

        // }}}

    });

    // }}}
    // {{{ toQueryString

    describe("toQueryString", function() {

        var toQueryString = CLI.Object.toQueryString;

        // {{{ defaults

        describe("defaults", function() {

            it("should return an empty string for a null object", function() {

                assert.equal(toQueryString(null), '');

            });

            it("should return an empty string for an empty object", function() {

                assert.equal(toQueryString({}), '');

            });

        });

        // }}}
        // {{{ simple values

        describe("simple values", function() {

            // {{{ empty values

            describe("empty values", function() {

                it("undefined", function() {

                    assert.equal(toQueryString({
                        foo: undefined
                    }), 'foo=');

                });

                it("null", function() {

                    assert.equal(toQueryString({
                        foo: null
                    }), 'foo=');

                });

                it("empty string", function() {

                    assert.equal(toQueryString({
                        foo: ''
                    }), 'foo=');

                });

                it("empty array", function() {

                    assert.equal(toQueryString({
                        foo: ''
                    }), 'foo=');

                });

                it("should join empty values correctly", function() {

                    assert.equal(toQueryString({
                        foo: '',
                        bar: 'baz'
                    }), 'foo=&bar=baz');

                });
            });

            // }}}

            it("should separate a property/value by an =", function() {

                assert.equal(toQueryString({
                    foo: 1
                }), 'foo=1');

            });

            it("should separate pairs by an &", function() {

                assert.equal(toQueryString({
                    foo: 1,
                    bar: 2
                }), 'foo=1&bar=2');

            });

            it("should encode dates", function() {

                var d = new Date(2011, 0, 1);

                assert.equal(toQueryString({
                    foo: d
                }), 'foo=2011-01-01T00%3A00%3A00');

            });

            it("should url encode the key", function() {

                assert.equal(toQueryString({
                    'a prop': 1
                }), 'a%20prop=1');

            });

            it("should url encode the value", function() {

                assert.equal(toQueryString({
                    prop: '$300 & 5 cents'
                }), 'prop=%24300%20%26%205%20cents');

            });

            it("should encode both key and value at the same time", function() {

                assert.equal(toQueryString({
                    'a prop': '$300'
                }), 'a%20prop=%24300');

            });

        });

        // }}}
        // {{{ arrays

        describe("arrays", function() {

            it("should support an array value", function() {

                assert.equal(toQueryString({
                    foo: [1, 2, 3]
                }), 'foo=1&foo=2&foo=3');

            });

            it("should be able to support multiple arrays", function() {

                assert.equal(toQueryString({
                    foo: [1, 2],
                    bar: [3, 4]
                }), 'foo=1&foo=2&bar=3&bar=4');

            });

            it("should be able to mix arrays and normal values", function() {

                assert.equal(toQueryString({
                    foo: 'val1',
                    bar: ['val2', 'val3'],
                    baz: 'val4'
                }), 'foo=val1&bar=val2&bar=val3&baz=val4');

            });

        });

        // }}}
        // {{{ recursive

        describe("recursive", function() {

            it("should support both nested arrays and objects", function() {

                assert.equal(decodeURIComponent(CLI.Object.toQueryString({
                    username: 'Jacky',
                    dateOfBirth: {
                        day: 1,
                        month: 2,
                        year: 1911
                    },
                    hobbies: ['coding', 'eating', 'sleeping', [1,2]]
                }, true)), 'username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=1&hobbies[3][1]=2');

            });

        });

        // }}}

    });

    // }}}
    // {{{ merge

    describe("merge", function() {

        var merge = CLI.Object.merge;

        // {{{ complex values

        describe("complex values", function() {

            it("should copy a simple object but not have the same reference", function() {

                var o = {
                    foo: 'prop',
                    tada: {
                        blah: 'bleh'
                    }
                },
                result = merge({}, o);

                assert.deepEqual(result, {
                    foo: 'prop',
                    tada: {
                        blah: 'bleh'
                    }
                });
                assert.deepEqual(result, o);

            });

            it("should NOT merge an instance (the constructor of which is not Object)", function() {

                var instance = new CLI.Base(),
                    o = {
                        foo: instance
                    },
                    result = merge({}, o);

                assert.equal(result.foo, instance);

            });

        });

        // }}}
        // {{{ overwriting properties

        describe("overwriting properties", function() {

            it("should merge objects if an object exists on the source and the passed value is an object literal", function() {

                assert.deepEqual(merge({
                    prop: {
                        foo: 1
                    }
                }, {
                    prop: {
                        bar: 2
                    }
                }), {
                    prop: {
                        foo: 1,
                        bar: 2
                    }
                });

            });

            it("should replace the value of the target object if it is not an object", function() {

                var o = new CLI.Base(),
                    result = merge({
                        prop: 1
                    }, {
                        prop: o
                    });

                assert.equal(result.prop, o);

            });

            it("should overwrite simple values", function() {

                assert.deepEqual(merge({
                    prop: 1
                }, {
                    prop: 2
                }), {
                    prop: 2
                });

            });

        });

        // }}}
        // {{{ merging objects

        describe("merging objects", function() {

            it("should merge objects", function() {

                assert.deepEqual(merge({}, {
                    foo: 1
                }), {
                    foo: 1
                });

            });

            it("should merge right to left", function() {

                assert.deepEqual(merge({}, {
                    foo: 1
                }, {
                    foo: 2
                }, {
                    foo: 3
                }), {
                    foo: 3
                });

            });

        });

        // }}}

        it("should modify and return the source", function() {

            var o = {},
                result = merge(o, {
                    foo: 'bar'
                });

            assert.equal(result.foo, 'bar');
            assert.deepEqual(result, o);

        });

    });

    // }}}
    // {{{ toQueryObjects

    describe("toQueryObjects", function() {

        var object = {
            username: 'Jacky',
            dateOfBirth: {
                day: 1,
                month: 2,
                year: 1911
            },
            hobbies: ['coding', 'eating', 'sleeping', [1,2,3]]
        };

        it("simple key value", function() {

            assert.deepEqual(CLI.Object.toQueryObjects('username', 'Jacky'), [{
                name: 'username',
                value: 'Jacky'
            }]);

        });

        it("non-recursive array", function() {

            assert.deepEqual(CLI.Object.toQueryObjects('hobbies', ['eating', 'sleeping', 'coding']), [{
                name: 'hobbies',
                value: 'eating'
            }, {
                name: 'hobbies',
                value: 'sleeping'
            }, {
                name: 'hobbies',
                value: 'coding'
            }]);

        });

        it("recursive object", function() {

            assert.deepEqual(CLI.Object.toQueryObjects('dateOfBirth', {
                day: 1,
                month: 2,
                year: 1911,
                somethingElse: {
                    nested: {
                        very: 'very',
                        deep: {
                            inHere: true
                        }
                    }
                }
            }, true), [{
                name: 'dateOfBirth[day]',
                value: 1
            }, {
                name: 'dateOfBirth[month]',
                value: 2
            }, {
                name: 'dateOfBirth[year]',
                value: 1911
            }, {
                name: 'dateOfBirth[somethingElse][nested][very]',
                value: 'very'
            }, {
                name: 'dateOfBirth[somethingElse][nested][deep][inHere]',
                value: true
            }]);

        });

        it("recursive array", function() {

            assert.deepEqual(CLI.Object.toQueryObjects('hobbies', [
                'eating', 'sleeping', 'coding', ['even', ['more']]
            ], true), [{
                name: 'hobbies[0]',
                value: 'eating'
            }, {
                name: 'hobbies[1]',
                value: 'sleeping'
            }, {
                name: 'hobbies[2]',
                value: 'coding'
            }, {
                name: 'hobbies[3][0]',
                value: 'even'
            }, {
                name: 'hobbies[3][1][0]',
                value: 'more'
            }]);

        });

    });

    // }}}
    // {{{ fromQueryString

    describe("fromQueryString", function() {

        console.log("==============");
        console.log(Object.defineProperty);

        var fromQueryString = CLI.Object.fromQueryString;

        // {{{ standard mode

        describe("standard mode", function() {

            it("empty string", function() {

                assert.deepEqual(fromQueryString(''), {});

            });

            it("simple single key value pair", function() {

                assert.deepEqual(fromQueryString('name=Jacky'), {name: 'Jacky'});

            });

            it("simple single key value pair with empty value", function() {

                assert.deepEqual(fromQueryString('name='), {name: ''});

            });

            it("multiple key value pairs", function() {

                assert.deepEqual(fromQueryString('name=Jacky&loves=food'), {name: 'Jacky', loves: 'food'});

            });

            it("multiple key value pairs with URI encoded component", function() {

                assert.deepEqual(fromQueryString('a%20property=%24300%20%26%205%20cents'), {'a property': '$300 & 5 cents'});

            });

            it("simple array", function() {

                assert.deepEqual(fromQueryString('foo=1&foo=2&foo=3'), {foo: ['1', '2', '3']});

            });

        });

        // }}}
        // {{{ recursive mode

        describe("recursive mode", function() {

            it("empty string", function() {

                assert.deepEqual(fromQueryString('', true), {});

            });

            it("simple single key value pair", function() {

                assert.deepEqual(fromQueryString('name=Jacky', true), {name: 'Jacky'});

            });

            it("simple single key value pair with empty value", function() {

                assert.deepEqual(fromQueryString('name=', true), {name: ''});

            });

            it("multiple key value pairs", function() {

                assert.deepEqual(fromQueryString('name=Jacky&loves=food', true), {name: 'Jacky', loves: 'food'});

            });

            it("multiple key value pairs with URI encoded component", function() {

                assert.deepEqual(fromQueryString('a%20property=%24300%20%26%205%20cents', true), {'a property': '$300 & 5 cents'});

            });

            it("simple array (last value with the same name will overwrite previous value)", function() {

                assert.deepEqual(fromQueryString('foo=1&foo=2&foo=3', true), {foo: '3'});

            });

            it("simple array with empty brackets", function() {

                assert.deepEqual(fromQueryString('foo[]=1&foo[]=2&foo[]=3', true), {foo: ['1', '2', '3']});

            });

            it("simple array with non-empty brackets", function() {

                assert.deepEqual(fromQueryString('foo[0]=1&foo[1]=2&foo[2]=3', true), {foo: ['1', '2', '3']});

            });

            it("simple array with non-empty brackets and non sequential keys", function() {

                assert.deepEqual(fromQueryString('foo[3]=1&foo[1]=2&foo[2]=3&foo[0]=0', true), {foo: ['0', '2', '3', '1']});

            });

            it("simple array with non-empty brackets and non sequential keys and holes", function() {

                assert.deepEqual(fromQueryString('foo[3]=1&foo[1]=2&foo[2]=3', true), { foo: [ , '2', '3', '1' ] });

            });

            it("nested array", function() {

                assert.deepEqual(fromQueryString('some[0][0]=stuff&some[0][1]=morestuff&some[0][]=otherstuff&some[1]=thingelse', true), {
                    some: [
                        ['stuff', 'morestuff', 'otherstuff'],
                        'thingelse'
                    ]
                });

            });

            it("nested object", function() {

                assert.deepEqual(fromQueryString('dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&dateOfBirth[extra][hour]=4&dateOfBirth[extra][minute]=30', true), {
                    dateOfBirth: {
                        day: '1',
                        month: '2',
                        year: '1911',
                        extra: {
                            hour: '4',
                            minute: '30'
                        }
                    }
                });

            });

            it("nested mixed types", function() {

                assert.deepEqual(fromQueryString('username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff', true), {
                    username: 'Jacky',
                    dateOfBirth: {
                        day: '1',
                        month: '2',
                        year: '1911'
                    },
                    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
                });

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
