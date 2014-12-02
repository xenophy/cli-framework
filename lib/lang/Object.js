/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Object
 *
 * A collection of useful static methods to deal with objects.
 *
 * @singleton
 */

(function() {

    "use strict";

    // {{{ CLI.Object

    (function() {

        // The "constructor" for chain:
        var CLIObject = CLI.Object = {

            // {{{ chain

            /**
             * Returns a new object with the given object as the prototype chain. This method is
             * designed to mimic the ECMA standard `Object.create` method and is assigned to that
             * function when it is available.
             * 
             * **NOTE** This method does not support the property definitions capability of the
             * `Object.create` method. Only the first argument is supported.
             * 
             * @param {Object} object The prototype chain for the new object.
             */
            chain: Object.create,

            // }}}
            // {{{ clear

            /**
             * This method removes all keys from the given object.
             * @param {Object} object The object from which to remove all keys.
             * @return {Object} The given object.
             */
            clear: function (object) {

                // Safe to delete during iteration
                for (var key in object) {
                    delete object[key];
                }

                return object;
            },

            // }}}
            // {{{ freeze

            /**
             * Freezes the given object making it immutable. This operation is by default shallow
             * and does not effect objects referenced by the given object.
             *
             * @method
             * @param {Object} obj The object to freeze.
             * @param {Boolean} [deep=false] Pass `true` to freeze sub-objects recursively.
             * @return {Object} The given object `obj`.
             */
            freeze: function (obj, deep) {

                if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {

                    Object.freeze(obj);

                    if (deep) {

                        for (var name in obj) {

                            CLIObject.freeze(obj[name], deep);

                        }

                    }

                }

                return obj;

            },

            // }}}
            // {{{ toQueryObjects

            /**
             * Converts a `name` - `value` pair to an array of objects with support for nested structures. Useful to construct
             * query strings. For example:
             *
             *     var objects = CLI.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
             *
             *     // objects then equals:
             *     [
             *         { name: 'hobbies', value: 'reading' },
             *         { name: 'hobbies', value: 'cooking' },
             *         { name: 'hobbies', value: 'swimming' },
             *     ];
             *
             *     var objects = CLI.Object.toQueryObjects('dateOfBirth', {
             *         day: 3,
             *         month: 8,
             *         year: 1987,
             *         extra: {
             *             hour: 4
             *             minute: 30
             *         }
             *     }, true); // Recursive
             *
             *     // objects then equals:
             *     [
             *         { name: 'dateOfBirth[day]', value: 3 },
             *         { name: 'dateOfBirth[month]', value: 8 },
             *         { name: 'dateOfBirth[year]', value: 1987 },
             *         { name: 'dateOfBirth[extra][hour]', value: 4 },
             *         { name: 'dateOfBirth[extra][minute]', value: 30 },
             *     ];
             *
             * @param {String} name
             * @param {Object/Array} value
             * @param {Boolean} [recursive=false] True to traverse object recursively
             * @return {Array}
             */
            toQueryObjects: function(name, value, recursive) {

                var self = CLIObject.toQueryObjects,
                    objects = [],
                    i, ln;

                if (CLI.isArray(value)) {

                    for (i = 0, ln = value.length; i < ln; i++) {

                        if (recursive) {

                            objects = objects.concat(self(name + '[' + i + ']', value[i], true));

                        } else {

                            objects.push({
                                name: name,
                                value: value[i]
                            });

                        }

                    }

                } else if (CLI.isObject(value)) {

                    for (i in value) {

                        if (value.hasOwnProperty(i)) {

                            if (recursive) {

                                objects = objects.concat(self(name + '[' + i + ']', value[i], true));

                            } else {

                                objects.push({
                                    name: name,
                                    value: value[i]
                                });

                            }

                        }

                    }

                } else {

                    objects.push({
                        name: name,
                        value: value
                    });

                }

                return objects;
            },

            // }}}
            // {{{ toQueryString

            /**
             * Takes an object and converts it to an encoded query string.
             *
             * Non-recursive:
             *
             *     CLI.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
             *     CLI.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
             *     CLI.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
             *     CLI.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
             *     CLI.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"
             *
             * Recursive:
             *
             *     CLI.Object.toQueryString({
             *         username: 'Jacky',
             *         dateOfBirth: {
             *             day: 1,
             *             month: 2,
             *             year: 1911
             *         },
             *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
             *     }, true); // returns the following string (broken down and url-decoded for ease of reading purpose):
             *     // username=Jacky
             *     //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
             *     //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
             *
             * @param {Object} object The object to encode
             * @param {Boolean} [recursive=false] Whether or not to interpret the object in recursive format.
             * (PHP / Ruby on Rails servers and similar).
             * @return {String} queryString
             */
            toQueryString: function(object, recursive) {

                var paramObjects = [],
                    params = [],
                    i, j, ln, paramObject, value;

                for (i in object) {
                    if (object.hasOwnProperty(i)) {
                        paramObjects = paramObjects.concat(CLIObject.toQueryObjects(i, object[i], recursive));
                    }
                }

                for (j = 0, ln = paramObjects.length; j < ln; j++) {
                    paramObject = paramObjects[j];
                    value = paramObject.value;

                    if (CLI.isEmpty(value)) {
                        value = '';
                    } else if (CLI.isDate(value)) {
                        value = CLI.Date.toString(value);
                    }

                    params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
                }

                return params.join('&');
            },

            // }}}
            // {{{ fromQueryString

            /**
             * Converts a query string back into an object.
             *
             * Non-recursive:
             *
             *     CLI.Object.fromQueryString("foo=1&bar=2"); // returns {foo: '1', bar: '2'}
             *     CLI.Object.fromQueryString("foo=&bar=2"); // returns {foo: null, bar: '2'}
             *     CLI.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
             *     CLI.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
             *
             * Recursive:
             *
             *     CLI.Object.fromQueryString(
             *         "username=Jacky&"+
             *         "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
             *         "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
             *         "hobbies[3][0]=nested&hobbies[3][1]=stuff", true);
             *
             *     // returns
             *     {
             *         username: 'Jacky',
             *         dateOfBirth: {
             *             day: '1',
             *             month: '2',
             *             year: '1911'
             *         },
             *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
             *     }
             *
             * @param {String} queryString The query string to decode
             * @param {Boolean} [recursive=false] Whether or not to recursively decode the string. This format is supported by
             * PHP / Ruby on Rails servers and similar.
             * @return {Object}
             */
            fromQueryString: function(queryString, recursive) {

                var parts = queryString.replace(/^\?/, '').split('&'),
                    object = {},
                    temp, components, name, value, i, ln,
                    part, j, subLn, matchedKeys, matchedName,
                    keys, key, nextKey;

                for (i = 0, ln = parts.length; i < ln; i++) {

                    part = parts[i];

                    if (part.length > 0) {

                        components = part.split('=');
                        name = decodeURIComponent(components[0]);
                        value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                        if (!recursive) {

                            if (object.hasOwnProperty(name)) {

                                if (!CLI.isArray(object[name])) {

                                    object[name] = [object[name]];

                                }

                                object[name].push(value);

                            } else {

                                object[name] = value;

                            }

                        } else {

                            matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                            matchedName = name.match(/^([^\[]+)/);

                            if (!matchedName) {
                                throw new Error('[CLI.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                            }

                            name = matchedName[0];
                            keys = [];

                            if (matchedKeys === null) {
                                object[name] = value;
                                continue;
                            }

                            for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                                key = matchedKeys[j];
                                key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                                keys.push(key);
                            }

                            keys.unshift(name);

                            temp = object;

                            for (j = 0, subLn = keys.length; j < subLn; j++) {

                                key = keys[j];

                                if (j === subLn - 1) {

                                    if (CLI.isArray(temp) && key === '') {

                                        temp.push(value);

                                    } else {

                                        temp[key] = value;

                                    }

                                } else {

                                    if (temp[key] === undefined || typeof temp[key] === 'string') {

                                        nextKey = keys[j+1];

                                        temp[key] = (CLI.isNumeric(nextKey) || nextKey === '') ? [] : {};
                                    }

                                    temp = temp[key];
                                }

                            }

                        }

                    }

                }

                return object;
            },

            // }}}
            // {{{ each

            /**
             * Iterates through an object and invokes the given callback function for each iteration.
             * The iteration can be stopped by returning `false` in the callback function. For example:
             *
             *     var person = {
             *         name: 'Jacky'
             *         hairColor: 'black'
             *         loves: ['food', 'sleeping', 'wife']
             *     };
             *
             *     CLI.Object.each(person, function(key, value, myself) {
             *         console.log(key + ":" + value);
             *
             *         if (key === 'hairColor') {
             *             return false; // stop the iteration
             *         }
             *     });
             *
             * @param {Object} object The object to iterate
             * @param {Function} fn The callback function.
             * @param {String} fn.key
             * @param {Object} fn.value
             * @param {Object} fn.object The object itself
             * @param {Object} [scope] The execution scope (`this`) of the callback function
             */
            each: function(object, fn, scope) {

                var i, property;

                scope = scope || object;

                for (property in object) {

                    if (object.hasOwnProperty(property)) {

                        if (fn.call(scope, property, object[property], object) === false) {

                            return;

                        }

                    }

                }

            },

            // }}}
            // {{{ eachValue

            /**
             * Iterates through an object and invokes the given callback function for each iteration.
             * The iteration can be stopped by returning `false` in the callback function. For example:
             *
             *     var items = {
             *         1: 'Hello',
             *         2: 'World'
             *     };
             *
             *     CLI.Object.eachValue(items, function (value) {
             *         console.log("Value: " + value);
             *     });
             *
             * This will log 'Hello' and 'World' in no particular order. This method is useful
             * in cases where the keys are not important to the processing, just the values.
             *
             * @param {Object} object The object to iterate
             * @param {Function} fn The callback function.
             * @param {Object} fn.value The value of
             * @param {Object} [scope] The execution scope (`this`) of the callback function
             */
            eachValue: function(object, fn, scope) {

                var enumerables = CLI.enumerables,
                    i, property;

                scope = scope || object;

                for (property in object) {

                    if (object.hasOwnProperty(property)) {

                        if (fn.call(scope, object[property]) === false) {

                            return;

                        }

                    }

                }

            },

            // }}}
            // {{{ merge

            /**
             * Merges any number of objects recursively without referencing them or their children.
             *
             *     var extjs = {
             *         companyName: 'CLI Framework',
             *         products: ['Product A', 'Product B', 'Product C'],
             *         isSuperCool: true,
             *         office: {
             *             size: 2000,
             *             location: 'Sapporo',
             *             isFun: true
             *         }
             *     };
             *
             *     var newStuff = {
             *         companyName: 'Xenophy.CO.,LTD',
             *         products: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
             *         office: {
             *             size: 40000,
             *             location: 'Tokyo'
             *         }
             *     };
             *
             *     var sencha = CLI.Object.merge(extjs, newStuff);
             *
             *     // extjs and sencha then equals to
             *     {
             *         companyName: 'Xenophy.CO.,LTD',
             *         products: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
             *         isSuperCool: true,
             *         office: {
             *             size: 40000,
             *             location: 'Tokyo',
             *             isFun: true
             *         }
             *     }
             *
             * @param {Object} destination The object into which all subsequent objects are merged.
             * @param {Object...} object Any number of objects to merge into the destination.
             * @return {Object} merged The destination object with all passed objects merged in.
             */
            merge: function(destination) {

                var i = 1,
                    ln = arguments.length,
                    mergeFn = CLIObject.merge,
                    cloneFn = CLI.clone,
                    object, key, value, sourceKey;

                for (; i < ln; i++) {

                    object = arguments[i];

                    for (key in object) {

                        value = object[key];

                        if (value && value.constructor === Object) {

                            sourceKey = destination[key];

                            if (sourceKey && sourceKey.constructor === Object) {

                                mergeFn(sourceKey, value);

                            } else {

                                destination[key] = cloneFn(value);

                            }

                        } else {

                            destination[key] = value;

                        }

                    }

                }

                return destination;
            },

            // }}}
            // {{{ mergeIf

            /**
             * @private
             * @param destination
             */
            mergeIf: function(destination) {

                var i = 1,
                    ln = arguments.length,
                    cloneFn = CLI.clone,
                    object, key, value;

                for (; i < ln; i++) {

                    object = arguments[i];

                    for (key in object) {

                        if (!(key in destination)) {

                            value = object[key];

                            if (value && value.constructor === Object) {

                                destination[key] = cloneFn(value);

                            } else {

                                destination[key] = value;

                            }

                        }

                    }

                }

                return destination;
            },

            // }}}
            // {{{ getKey

            /**
             * Returns the first matching key corresponding to the given value.
             * If no matching value is found, null is returned.
             *
             *     var person = {
             *         name: 'Jacky',
             *         loves: 'food'
             *     };
             *
             *     alert(CLI.Object.getKey(person, 'food')); // alerts 'loves'
             *
             * @param {Object} object
             * @param {Object} value The value to find
             */
            getKey: function(object, value) {

                for (var property in object) {

                    if (object.hasOwnProperty(property) && object[property] === value) {

                        return property;

                    }

                }

                return null;
            },

            // }}}
            // {{{ getValues

            /**
             * Gets all values of the given object as an array.
             *
             *     var values = CLI.Object.getValues({
             *         name: 'Jacky',
             *         loves: 'food'
             *     }); // ['Jacky', 'food']
             *
             * @param {Object} object
             * @return {Array} An array of values from the object
             */
            getValues: function(object) {

                var values = [],
                    property;

                for (property in object) {

                    if (object.hasOwnProperty(property)) {

                        values.push(object[property]);

                    }

                }

                return values;
            },

            // }}}
            // {{{ getKeys

            /**
             * Gets all keys of the given object as an array.
             *
             *     var values = CLI.Object.getKeys({
             *         name: 'Jacky',
             *         loves: 'food'
             *     }); // ['name', 'loves']
             *
             * @param {Object} object
             * @return {String[]} An array of keys from the object
             * @method
             */
            getKeys: function(object) {

                if (!object) {
                    return [];
                }

                return Object.keys(object);
            },

            // }}}
            // {{{ getSize

            /**
             * Gets the total number of this object's own properties
             *
             *     var size = CLI.Object.getSize({
             *         name: 'Jacky',
             *         loves: 'food'
             *     }); // size equals 2
             *
             * @param {Object} object
             * @return {Number} size
             */
            getSize: function(object) {

                var size = 0,
                    property;

                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        size++;
                    }
                }

                return size;
            },

            // }}}
            // {{{ isEmpty

            /**
             * Checks if there are any properties on this object.
             * @param {Object} object
             * @return {Boolean} `true` if there no properties on the object.
             */
            isEmpty: function(object){

                for (var key in object) {

                    if (object.hasOwnProperty(key)) {

                        return false;

                    }
                }

                return true;
            },

            // }}}
            // {{{ equals

            /**
             * Shallow compares the contents of 2 objects using strict equality. Objects are
             * considered equal if they both have the same set of properties and the
             * value for those properties equals the other in the corresponding object.
             *
             *     // Returns true
             *     CLI.Object.equals({
             *         foo: 1,
             *         bar: 2
             *     }, {
             *         foo: 1,
             *         bar: 2
             *     });
             *
             * @param {Object} object1
             * @param {Object} object2
             * @return {Boolean} `true` if the objects are equal.
             */
            equals: (function() {

                var check = function(o1, o2) {

                    var key;

                    for (key in o1) {

                        if (o1.hasOwnProperty(key)) {

                            if (o1[key] !== o2[key]) {

                                return false;

                            }

                        }

                    }

                    return true;
                };

                return function(object1, object2) {

                    // Short circuit if the same object is passed twice
                    if (object1 === object2) {

                        return true;

                    } if (object1 && object2) {

                        // Do the second check because we could have extra keys in
                        // object2 that don't exist in object1.
                        return check(object1, object2) && check(object2, object1);  

                    } else if (!object1 && !object2) {

                        return object1 === object2;

                    } else {

                        return false;

                    }

                };

            })(),

            // }}}
            // {{{ fork

            /**
             * @private
             */
            fork: function (obj) {

                var CLIArray = CLI.Array,
                    ret, key, value;

                if (obj && obj.constructor === Object) {

                    ret = CLIObject.chain(obj);

                    for (key in obj) {

                        value = obj[key];

                        if (value) {

                            if (value.constructor === Object) {

                                ret[key] = CLIObject.fork(value);

                            } else if (value instanceof Array) {

                                ret[key] = CLI.Array.clone(value);

                            }

                        }

                    }

                } else {

                    ret = obj;

                }

                return ret;
            },

            // }}}
            // {{{ defineProperty

            defineProperty: Object.defineProperty,

            // }}}
            // {{{ classify

            /**
             * @private
             */
            classify: function(object) {

                var prototype = object,
                    objectProperties = [],
                    propertyClassesMap = {},
                    objectClass = function() {
                        var i = 0,
                        ln = objectProperties.length,
                        property;

                        for (; i < ln; i++) {
                            property = objectProperties[i];
                            this[property] = new propertyClassesMap[property]();
                        }
                    },
                    key, value;

                for (key in object) {

                    if (object.hasOwnProperty(key)) {

                        value = object[key];

                        if (value && value.constructor === Object) {

                            objectProperties.push(key);
                            propertyClassesMap[key] = CLIObject.classify(value);

                        }

                    }

                }

                objectClass.prototype = prototype;

                return objectClass;
            }

            // }}}

        };

        // {{{ CLI.merge

        /**
         * A convenient alias method for {@link CLI.Object#merge}.
         *
         * @member CLI
         * @method merge
         * @inheritdoc CLI.Object#merge
         */
        CLI.merge = CLI.Object.merge;

        // }}}
        // {{{ CLI.mergeIf

        /**
         * @private
         * @member CLI
         */
        CLI.mergeIf = CLI.Object.mergeIf;

        // }}}

    }());

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
