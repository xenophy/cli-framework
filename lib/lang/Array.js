/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* jshint supernew:true */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Array
 * @singleton
 *
 * A set of useful static methods to deal with arrays
 */

(function() {

    "use strict";

    // {{{ CLI.Array

    CLI.Array = new (function() {

        var arrayPrototype = Array.prototype,
            slice = arrayPrototype.slice,
            erase, replace, splice;

        // {{{ stableSort

        // Sort an array using the comparator, but if the comparator returns zero, use the objects' original indices to tiebreak
        // This results in a stable sort.
        function stableSort(array, userComparator) {

            var len = array.length,
                indices = new Array(len),
                result = new Array(len),
                i;

            // generate 0-n index map from original array
            for (i = 0; i < len; i++) {
                indices[i] = i;
            }

            // Sort indices array using a comparator which compares the original values at the two indices, and uses those indices as a tiebreaker
            indices.sort(function(index1, index2) {
                return userComparator(array[index1], array[index2]) || (index1 - index2);
            });

            // Reconsitute a sorted array using the array that the indices have been sorted into
            for (i = 0; i < len; i++) {
                result[i] = array[indices[i]];
            }

            // Rebuild the original array
            for (i = 0; i < len; i++) {
                array[i] = result[i];
            }

            return array;
        }

        // }}}
        // {{{ erase

        erase = function (array, index, removeCount) {

            array.splice(index, removeCount);
            return array;
        };

        // }}}
        // {{{ replace

        replace = function(array, index, removeCount, insert) {

            if (insert && insert.length) {

                // Inserting at index zero with no removing: use unshift
                if (index === 0 && !removeCount) {
                    array.unshift.apply(array, insert);
                }

                // Inserting/replacing in middle of array
                else if (index < array.length) {
                    array.splice.apply(array, [index, removeCount].concat(insert));
                }

                // Appending to array
                else {
                    array.push.apply(array, insert);
                }

            } else {

                array.splice(index, removeCount);

            }

            return array;

        };

        // }}}
        // {{{ splice

        splice = function (array) {

            return array.splice.apply(array, slice.call(arguments, 1));

        };

        // }}}
        // {{{ CLIArray

        // NOTE: from here on, use erase, replace or splice (not native methods)...

        var CLIArray = {

            // {{{ binarySearch

            /**
             * This method returns the index that a given item would be inserted into the
             * given (sorted) `array`. Note that the given `item` may or may not be in the
             * array. This method will return the index of where the item *should* be.
             *
             * For example:
             *
             *      var array = [ 'A', 'D', 'G', 'K', 'O', 'R', 'X' ];
             *      var index = CLI.Array.binarySearch(array, 'E');
             *
             *      console.log('index: ' + index);
             *      // logs "index: 2"
             *
             *      array.splice(index, 0, 'E');
             *
             *      console.log('array : ' + array.join(''));
             *      // logs "array: ADEGKORX"
             *
             * @param {Object[]} array The array to search.
             * @param {Object} item The item that you want to insert into the `array`.
             * @param {Number} [begin=0] The first index in the `array` to consider.
             * @param {Number} [end=array.length] The index that marks the end of the range
             * to consider. The item at this index is *not* considered.
             * @param {Function} [compareFn] The comparison function that matches the sort
             * order of the `array`. The default `compareFn` compares items using less-than
             * and greater-than operators.
             * @return {Number} The index for the given item in the given array based on
             * the current sorters.
             */
            binarySearch: function (array, item, begin, end, compareFn) {

                var length = array.length,
                    middle, comparison;

                if (begin instanceof Function) {

                    compareFn = begin;
                    begin = 0;
                    end = length;

                } else if (end instanceof Function) {

                    compareFn = end;
                    end = length;

                } else {

                    if (begin === undefined) {
                        begin = 0;
                    }

                    if (end === undefined) {
                        end = length;
                    }

                    compareFn = compareFn || CLIArray.lexicalCompare;

                }

                --end;

                while (begin <= end) {

                    middle = (begin + end) >> 1;
                    comparison = compareFn(item, array[middle]);

                    if (comparison >= 0) {

                        begin = middle + 1;

                    } else if (comparison < 0) {

                        end = middle - 1;

                    }

                }

                return begin;
            },

            // }}}
            // {{{ lexicalCompare

            // Default comparatyor to use when no comparator is specified for the sort method.
            // Javascript sort does LEXICAL comparison.
            lexicalCompare: function (lhs, rhs) {

                lhs = String(lhs);
                rhs = String(rhs);

                return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
            },

            // }}}
            // {{{ each

            /**
             * Iterates an array or an iterable value and invoke the given callback function for each item.
             *
             *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
             *
             *     CLI.Array.each(countries, function(name, index, countriesItSelf) {
             *         console.log(name);
             *     });
             *
             *     var sum = function() {
             *         var sum = 0;
             *
             *         CLI.Array.each(arguments, function(value) {
             *             sum += value;
             *         });
             *
             *         return sum;
             *     };
             *
             *     sum(1, 2, 3); // returns 6
             *
             * The iteration can be stopped by returning false in the function callback.
             *
             *     CLI.Array.each(countries, function(name, index, countriesItSelf) {
             *         if (name === 'Singapore') {
             *             return false; // break here
             *         }
             *     });
             *
             * {@link CLI#each CLI.each} is alias for {@link CLI.Array#each CLI.Array.each}
             *
             * @param {Array/NodeList/Object} iterable The value to be iterated. If this
             * argument is not iterable, the callback function is called once.
             * @param {Function} fn The callback function. If it returns `false`, the iteration
             * stops and this method returns the current `index`.
             * @param {Object} fn.item The item at the current `index` in the passed `array`
             * @param {Number} fn.index The current `index` within the `array`
             * @param {Array} fn.allItems The `array` itself which was passed as the first argument
             * @param {Boolean} fn.return Return false to stop iteration.
             * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
             * @param {Boolean} [reverse=false] Reverse the iteration order (loop from the end to the beginning).
             * @return {Boolean} See description for the `fn` parameter.
             */
            each: function(array, fn, scope, reverse) {

                array = CLIArray.from(array);

                var i,
                    ln = array.length;

                if (reverse !== true) {

                    for (i = 0; i < ln; i++) {

                        if (fn.call(scope || array[i], array[i], i, array) === false) {

                            return i;

                        }

                    }

                } else {

                    for (i = ln - 1; i > -1; i--) {

                        if (fn.call(scope || array[i], array[i], i, array) === false) {

                            return i;

                        }

                    }

                }

                return true;
            },

            // }}}
            // {{{ forEach

            /**
             * Iterates an array and invoke the given callback function for each item. Note that this will simply
             * delegate to the native `Array.prototype.forEach` method if supported. It doesn't support stopping the
             * iteration by returning `false` in the callback function like {@link CLI.Array#each}. However, performance
             * could be much better in modern browsers comparing with {@link CLI.Array#each}
             *
             * @param {Array} array The array to iterate.
             * @param {Function} fn The callback function.
             * @param {Object} fn.item The item at the current `index` in the passed `array`.
             * @param {Number} fn.index The current `index` within the `array`.
             * @param {Array}  fn.allItems The `array` itself which was passed as the first argument.
             * @param {Object} scope (Optional) The execution scope (`this`) in which the
             * specified function is executed.
             */
            forEach: function(array, fn, scope) {

                return array.forEach(fn, scope);

            },

            // }}}
            // {{{ indexOf

            /**
             * Get the index of the provided `item` in the given `array`, a supplement for the
             * missing arrayPrototype.indexOf in Internet Explorer.
             *
             * @param {Array} array The array to check.
             * @param {Object} item The item to find.
             * @param {Number} from (Optional) The index at which to begin the search.
             * @return {Number} The index of item in the array (or -1 if it is not found).
             */
            indexOf: function(array, item, from) {

                return arrayPrototype.indexOf.call(array, item, from);

            },

            // }}}
            // {{{ contains

            /**
             * Checks whether or not the given `array` contains the specified `item`.
             *
             * @param {Array} array The array to check.
             * @param {Object} item The item to find.
             * @return {Boolean} `true` if the array contains the item, `false` otherwise.
             */
            contains: function(array, item) {

                return arrayPrototype.indexOf.call(array, item) !== -1;

            },

            // }}}
            // {{{ toArray

            /**
             * Converts any iterable (numeric indices and a length property) into a true array.
             *
             *     function test() {
             *         var args = CLI.Array.toArray(arguments),
             *             fromSecondToLastArgs = CLI.Array.toArray(arguments, 1);
             *
             *         alert(args.join(' '));
             *         alert(fromSecondToLastArgs.join(' '));
             *     }
             *
             *     test('just', 'testing', 'here'); // alerts 'just testing here';
             *                                      // alerts 'testing here';
             *
             *     CLI.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
             *     CLI.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
             *     CLI.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l']
             *
             * {@link CLI#toArray CLI.toArray} is alias for {@link CLI.Array#toArray CLI.Array.toArray}
             *
             * @param {Object} iterable the iterable object to be turned into a true Array.
             * @param {Number} [start=0] a zero-based index that specifies the start of extraction.
             * @param {Number} [end=-1] a 1-based index that specifies the end of extraction.
             * @return {Array}
             */
            toArray: function(iterable, start, end) {

                if (!iterable || !iterable.length) {
                    return [];
                }

                if (typeof iterable === 'string') {
                    iterable = iterable.split('');
                }

                var array = [],
                    i;

                start = start || 0;
                end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

                for (i = start; i < end; i++) {
                    array.push(iterable[i]);
                }

                return array;
            },

            // }}}
            // {{{ pluck

            /**
             * Plucks the value of a property from each item in the Array. Example:
             *
             *     CLI.Array.pluck(CLI.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
             *
             * @param {Array/NodeList} array The Array of items to pluck the value from.
             * @param {String} propertyName The property name to pluck from each element.
             * @return {Array} The value from each item in the Array.
             */
            pluck: function(array, propertyName) {

                var ret = [],
                    i, ln, item;

                for (i = 0, ln = array.length; i < ln; i++) {

                    item = array[i];

                    ret.push(item[propertyName]);
                }

                return ret;
            },

            // }}}
            // {{{ map

            /**
             * Creates a new array with the results of calling a provided function on every element in this array.
             *
             * @param {Array} array
             * @param {Function} fn Callback function for each item.
             * @param {Mixed} fn.item Current item.
             * @param {Number} fn.index Index of the item.
             * @param {Array} fn.array The whole array that's being iterated.
             * @param {Object} [scope] Callback function scope
             * @return {Array} results
             */
            map: function(array, fn, scope) {

                CLI.Assert.isFunction(fn, 'CLI.Array.map must have a callback function passed as second argument.');

                return array.map(fn, scope);
            },

            // }}}
            // {{{

            /**
             * Executes the specified function for each array element until the function returns a falsy value.
             * If such an item is found, the function will return `false` immediately.
             * Otherwise, it will return `true`.
             *
             * @param {Array} array
             * @param {Function} fn Callback function for each item.
             * @param {Mixed} fn.item Current item.
             * @param {Number} fn.index Index of the item.
             * @param {Array} fn.array The whole array that's being iterated.
             * @param {Object} scope Callback function scope.
             * @return {Boolean} `treu` if no false value is returned by the callback function.
             */
            every: function(array, fn, scope) {

                CLI.Assert.isFunction(fn, 'CLI.Array.every must have a callback function passed as second argument.');

                return array.every(fn, scope);
            },

            // }}}
            // {{{ some

            /**
             * Executes the specified function for each array element until the function returns a truthy value.
             * If such an item is found, the function will return `true` immediately. Otherwise, it will return `false`.
             *
             * @param {Array} array
             * @param {Function} fn Callback function for each item.
             * @param {Mixed} fn.item Current item.
             * @param {Number} fn.index Index of the item.
             * @param {Array} fn.array The whole array that's being iterated.
             * @param {Object} scope Callback function scope.
             * @return {Boolean} `true` if the callback function returns a truthy value.
             */
            some: function(array, fn, scope) {

                CLI.Assert.isFunction(fn, 'CLI.Array.some must have a callback function passed as second argument.');

                return array.some(fn, scope);
            },

            // }}}
            // {{{ equals

            /**
             * Shallow compares the contents of 2 arrays using strict equality.
             *
             * @param {Array} array1
             * @param {Array} array2
             * @return {Boolean} `true` if the arrays are equal.
             */
            equals: function(array1, array2) {

                var len1 = array1.length,
                    len2 = array2.length,
                    i;

                // Short circuit if the same array is passed twice
                if (array1 === array2) {
                    return true;
                }

                if (len1 !== len2) {
                    return false;
                }

                for (i = 0; i < len1; ++i) {

                    if (array1[i] !== array2[i]) {

                        return false;

                    }

                }

                return true;
            },

            // }}}
            // {{{ clean

            /**
             * Filter through an array and remove empty item as defined in {@link CLI#isEmpty CLI.isEmpty}.
             *
             * See {@link CLI.Array#filter}
             *
             * @param {Array} array
             * @return {Array} results
             */
            clean: function(array) {

                var results = [],
                    i = 0,
                    ln = array.length,
                    item;

                for (; i < ln; i++) {

                    item = array[i];

                    if (!CLI.isEmpty(item)) {

                        results.push(item);

                    }

                }

                return results;
            },

            // }}}
            // {{{ unique

            /**
             * Returns a new array with unique items.
             *
             * @param {Array} array
             * @return {Array} results
             */
            unique: function(array) {

                var clone = [],
                    i = 0,
                    ln = array.length,
                    item;

                for (; i < ln; i++) {

                    item = array[i];

                    if (CLIArray.indexOf(clone, item) === -1) {

                        clone.push(item);

                    }

                }

                return clone;
            },

            // }}}
            // {{{ filter

            /**
             * Creates a new array with all of the elements of this array for which
             * the provided filtering function returns true.
             *
             * @param {Array} array
             * @param {Function} fn Callback function for each item.
             * @param {Mixed} fn.item Current item.
             * @param {Number} fn.index Index of the item.
             * @param {Array} fn.array The whole array that's being iterated.
             * @param {Object} scope Callback function scope.
             * @return {Array} results
             */
            filter: function(array, fn, scope) {

                CLI.Assert.isFunction(fn, 'CLI.Array.filter must have a filter function passed as second argument.');

                return array.filter(fn, scope);
            },

            // }}}
            // {{{ findBy

            /**
             * Returns the first item in the array which elicits a truthy return value from the
             * passed selection function.
             *
             * @param {Array} array     The array to search
             * @param {Function} fn     The selection function to execute for each item.
             * @param {Mixed} fn.item   The array item.
             * @param {String} fn.index The index of the array item.
             * @param {Object} scope    (optional) The scope (<code>this</code> reference) in which the
             *                          function is executed. Defaults to the array
             * @return {Object}         The first item in the array which returned true from the selection
             *                          function, or null if none was found.
             */
            findBy : function(array, fn, scope) {

                var i = 0,
                    len = array.length;

                for (; i < len; i++) {

                    if (fn.call(scope || array, array[i], i)) {

                        return array[i];

                    }

                }

                return null;
            },

            // }}}
            // {{{ from

            /**
             * Converts a value to an array if it's not already an array; returns:
             *
             * - An empty array if given value is `undefined` or `null`
             * - Itself if given value is already an array
             * - An array copy if given value is {@link CLI#isIterable iterable} (arguments, NodeList and alike)
             * - An array with one item which is the given value, otherwise
             *
             * @param {Object} value The value to convert to an array if it's not already is an array.
             * @param {Boolean} [newReference] `true` to clone the given array and return a new reference if necessary.
             * @return {Array} array
             */
            from: function(value, newReference) {

                if (value === undefined || value === null) {
                    return [];
                }

                if (CLI.isArray(value)) {

                    return (newReference) ? slice.call(value) : value;

                }

                var type = typeof value;

                // Both strings and functions will have a length property. In phantomJS, NodeList
                // instances report typeof=='function' but don't have an apply method...
                if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {

                    return CLIArray.toArray(value);

                }

                return [value];
            },

            // }}}
            // {{{ remove

            /**
             * Removes the specified item from the array if it exists
             *
             * @param {Array} array The array
             * @param {Object} item The item to remove
             * @return {Array} The passed array itself
             */
            remove: function(array, item) {

                var index = CLIArray.indexOf(array, item);

                if (index !== -1) {
                    erase(array, index, 1);
                }

                return array;
            },

            // }}}
            // {{{ include

            /**
             * Push an item into the array only if the array doesn't contain it yet.
             *
             * @param {Array} array The array.
             * @param {Object} item The item to include.
             */
            include: function(array, item) {

                if (!CLIArray.contains(array, item)) {

                    array.push(item);

                }

            },

            // }}}
            // {{{ clone

            /**
             * Clone a flat array without referencing the previous one. Note that this is different
             * from `CLI.clone` since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
             * for `Array.prototype.slice.call(array)`.
             *
             * @param {Array} array The array.
             * @return {Array} The clone array.
             */
            clone: function(array) {

                return slice.call(array);

            },

            // }}}
            // {{{ merge

            /**
             * Merge multiple arrays into one with unique items.
             *
             * {@link CLI.Array#union} is alias for {@link CLI.Array#merge}
             *
             * @param {Array} array1
             * @param {Array} array2
             * @param {Array} etc
             * @return {Array} merged
             */
            merge: function() {

                var args = slice.call(arguments),
                    array = [],
                    i, ln;

                for (i = 0, ln = args.length; i < ln; i++) {

                    array = array.concat(args[i]);

                }

                return CLIArray.unique(array);
            },

            // }}}
            // {{{ intersect

            /**
             * Merge multiple arrays into one with unique items that exist in all of the arrays.
             *
             * @param {Array} array1
             * @param {Array} array2
             * @param {Array} etc
             * @return {Array} intersect
             */
            intersect: function() {

                var intersection = [],
                    arrays = slice.call(arguments),
                    arraysLength,
                    array,
                    arrayLength,
                    minArray,
                    minArrayIndex,
                    minArrayCandidate,
                    minArrayLength,
                    element,
                    elementCandidate,
                    elementCount,
                    i, j, k;

                if (!arrays.length) {
                    return intersection;
                }

                // Find the smallest array
                arraysLength = arrays.length;

                for (i = minArrayIndex = 0; i < arraysLength; i++) {

                    minArrayCandidate = arrays[i];

                    if (!minArray || minArrayCandidate.length < minArray.length) {

                        minArray = minArrayCandidate;
                        minArrayIndex = i;

                    }
                }

                minArray = CLIArray.unique(minArray);
                erase(arrays, minArrayIndex, 1);

                // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
                // an item in the small array, we're likely to find it before reaching the end
                // of the inner loop and can terminate the search early.
                minArrayLength = minArray.length;
                arraysLength = arrays.length;

                for (i = 0; i < minArrayLength; i++) {

                    element = minArray[i];
                    elementCount = 0;

                    for (j = 0; j < arraysLength; j++) {

                        array = arrays[j];
                        arrayLength = array.length;

                        for (k = 0; k < arrayLength; k++) {

                            elementCandidate = array[k];

                            if (element === elementCandidate) {

                                elementCount++;
                                break;

                            }

                        }

                    }

                    if (elementCount === arraysLength) {

                        intersection.push(element);

                    }
                }

                return intersection;
            },

            // }}}
            // {{{ difference

            /**
             * Perform a set difference A-B by subtracting all items in array B from array A.
             *
             * @param {Array} arrayA
             * @param {Array} arrayB
             * @return {Array} difference
             */
            difference: function(arrayA, arrayB) {

                var clone = slice.call(arrayA),
                    ln = clone.length,
                    i, j, lnB;

                for (i = 0,lnB = arrayB.length; i < lnB; i++) {

                    for (j = 0; j < ln; j++) {

                        if (clone[j] === arrayB[i]) {

                            erase(clone, j, 1);
                            j--;
                            ln--;

                        }

                    }

                }

                return clone;
            },

            // }}}
            // {{{ slice

            /**
             * Returns a shallow copy of a part of an array. This is equivalent to the native
             * call `Array.prototype.slice.call(array, begin, end)`. This is often used when "array"
             * is "arguments" since the arguments object does not supply a slice method but can
             * be the context object to `Array.prototype.slice`.
             *
             * @param {Array} array     The array (or arguments object).
             * @param {Number} begin    The index at which to begin. Negative values are offsets from
             *                          the end of the array.
             * @param {Number} end      The index at which to end. The copied items do not include
             *                          end. Negative values are offsets from the end of the array. If end is omitted,
             *                          all items up to the end of the array are copied.
             * @return {Array}          The copied piece of the array.
             * @method slice
             */
            slice: function (array, begin, end) {

                return slice.call(array, begin, end);

            },

            // }}}
            // {{{ sort

            /**
             * Sorts the elements of an Array in a stable manner (equivalently keyed values do not move relative to each other).
             * By default, this method sorts the elements alphabetically and ascending.
             * **Note:** This method modifies the passed array, in the same manner as the
             * native javascript Array.sort.
             *
             * @param {Array} array The array to sort.
             * @param {Function} [sortFn] The comparison function.
             * @param {Mixed} sortFn.a The first item to compare.
             * @param {Mixed} sortFn.b The second item to compare.
             * @param {Number} sortFn.return `-1` if a < b, `1` if a > b, otherwise `0`.
             * @return {Array} The sorted array.
             */
            sort: function(array, sortFn) {
                return stableSort(array, sortFn || CLIArray.lexicalCompare);
            },

            // }}}
            // {{{ flatten

            /**
             * Recursively flattens into 1-d Array. Injects Arrays inline.
             *
             * @param {Array} array The array to flatten
             * @return {Array} The 1-d array.
             */
            flatten: function(array) {

                var worker = [];

                function rFlatten(a) {

                    var i, ln, v;

                    for (i = 0, ln = a.length; i < ln; i++) {

                        v = a[i];

                        if (CLI.isArray(v)) {

                            rFlatten(v);

                        } else {

                            worker.push(v);
                        }
                    }

                    return worker;
                }

                return rFlatten(array);
            },

            // }}}
            // {{{ min

            /**
             * Returns the minimum value in the Array.
             *
             * @param {Array/NodeList} array The Array from which to select the minimum value.
             * @param {Function} comparisonFn (optional) a function to perform the comparison which determines minimization.
             * If omitted the "<" operator will be used.
             * __Note:__ gt = 1; eq = 0; lt = -1
             * @param {Mixed} comparisonFn.min Current minimum value.
             * @param {Mixed} comparisonFn.item The value to compare with the current minimum.
             * @return {Object} minValue The minimum value.
             */
            min: function(array, comparisonFn) {

                var min = array[0],
                    i, ln, item;

                for (i = 0, ln = array.length; i < ln; i++) {

                    item = array[i];

                    if (comparisonFn) {

                        if (comparisonFn(min, item) === 1) {

                            min = item;

                        }

                    } else {

                        if (item < min) {

                            min = item;

                        }

                    }

                }

                return min;
            },

            // }}}
            // {{{ max

            /**
             * Returns the maximum value in the Array.
             *
             * @param {Array/NodeList} array The Array from which to select the maximum value.
             * @param {Function} comparisonFn (optional) a function to perform the comparison which determines maximization.
             * If omitted the ">" operator will be used.
             * __Note:__ gt = 1; eq = 0; lt = -1
             * @param {Mixed} comparisonFn.max Current maximum value.
             * @param {Mixed} comparisonFn.item The value to compare with the current maximum.
             * @return {Object} maxValue The maximum value.
             */
            max: function(array, comparisonFn) {

                var max = array[0],
                    i, ln, item;

                for (i = 0, ln = array.length; i < ln; i++) {

                    item = array[i];

                    if (comparisonFn) {

                        if (comparisonFn(max, item) === -1) {

                            max = item;

                        }

                    } else {

                        if (item > max) {

                            max = item;

                        }

                    }

                }

                return max;
            },

            // }}}
            // {{{ mean

            /**
             * Calculates the mean of all items in the array.
             *
             * @param {Array} array The Array to calculate the mean value of.
             * @return {Number} The mean.
             */
            mean: function(array) {
                return array.length > 0 ? CLIArray.sum(array) / array.length : undefined;
            },

            // }}}
            // {{{ sum

            /**
             * Calculates the sum of all items in the given array.
             *
             * @param {Array} array The Array to calculate the sum value of.
             * @return {Number} The sum.
             */
            sum: function(array) {

                var sum = 0,
                    i, ln, item;

                for (i = 0,ln = array.length; i < ln; i++) {
                    item = array[i];

                    sum += item;
                }

                return sum;
            },

            // }}}
            // {{{ toMap

            /**
             * Creates a map (object) keyed by the elements of the given array. The values in
             * the map are the index+1 of the array element. For example:
             *
             *      var map = CLI.Array.toMap(['a','b','c']);
             *
             *      // map = { a: 1, b: 2, c: 3 };
             *
             * Or a key property can be specified:
             *
             *      var map = CLI.Array.toMap([
             *              { name: 'a' },
             *              { name: 'b' },
             *              { name: 'c' }
             *          ], 'name');
             *
             *      // map = { a: 1, b: 2, c: 3 };
             *
             * Lastly, a key extractor can be provided:
             *
             *      var map = CLI.Array.toMap([
             *              { name: 'a' },
             *              { name: 'b' },
             *              { name: 'c' }
             *          ], function (obj) { return obj.name.toUpperCase(); });
             *
             *      // map = { A: 1, B: 2, C: 3 };
             *
             * @param {Array} array The Array to create the map from.
             * @param {String/Function} [getKey] Name of the object property to use
             * as a key or a function to extract the key.
             * @param {Object} [scope] Value of this inside callback.
             * @return {Object} The resulting map.
             */
            toMap: function(array, getKey, scope) {

                var map = {},
                    i = array.length;

                if (!getKey) {

                    while (i--) {

                        map[array[i]] = i+1;

                    }

                } else if (typeof getKey === 'string') {

                    while (i--) {

                        map[array[i][getKey]] = i+1;

                    }

                } else {

                    while (i--) {

                        map[getKey.call(scope, array[i])] = i+1;

                    }

                }

                return map;
            },

            // }}}
            // {{{ toValueMap

            /**
             * Creates a map (object) keyed by a property of elements of the given array. The values in
             * the map are the array element. For example:
             *
             *      var map = CLI.Array.toMap(['a','b','c']);
             *
             *      // map = { a: 'a', b: 'b', c: 'c' };
             *
             * Or a key property can be specified:
             *
             *      var map = CLI.Array.toMap([
             *              { name: 'a' },
             *              { name: 'b' },
             *              { name: 'c' }
             *          ], 'name');
             *
             *      // map = { a: {name: 'a'}, b: {name: 'b'}, c: {name: 'c'} };
             *
             * Lastly, a key extractor can be provided:
             *
             *      var map = CLI.Array.toMap([
             *              { name: 'a' },
             *              { name: 'b' },
             *              { name: 'c' }
             *          ], function (obj) { return obj.name.toUpperCase(); });
             *
             *      // map = { A: {name: 'a'}, B: {name: 'b'}, C: {name: 'c'} };
             *
             * @param {Array} array The Array to create the map from.
             * @param {String/Function} [getKey] Name of the object property to use
             * as a key or a function to extract the key.
             * @param {Object} [scope] Value of this inside callback. This parameter is only
             * passed when `getKey` is a function. If `getKey` is not a function, the 3rd
             * argument is `arrayify`.
             * @param {Number} [arrayify] Pass `1` to create arrays for all map entries
             * or `2` to create arrays for map entries that have 2 or more items with the
             * same key. This only applies when `getKey` is specified. By default the map will
             * hold the last entry with a given key.
             * @return {Object} The resulting map.
             */
            toValueMap: function(array, getKey, scope, arrayify) {

                var map = {},
                    i = array.length,
                    autoArray, alwaysArray, entry, fn, key, value;

                if (!getKey) {

                    while (i--) {

                        value = array[i];
                        map[value] = value;

                    }

                } else {

                    if (!(fn = (typeof getKey !== 'string'))) {

                        arrayify = scope;

                    }

                    alwaysArray = arrayify === 1;
                    autoArray = arrayify === 2;

                    while (i--) {

                        value = array[i];
                        key = fn ? getKey.call(scope, value) : value[getKey];

                        if (alwaysArray) {

                            if (key in map) {

                                map[key].push(value);

                            } else {

                                map[key] = [ value ];

                            }

                        } else if (autoArray && (key in map)) {

                            if ((entry = map[key]) instanceof Array) {

                                entry.push(value);

                            } else {

                                map[key] = [ entry, value ];

                            }

                        } else {

                            map[key] = value;

                        }

                    }

                }

                return map;
            },

            // }}}
            // {{{ erase

            /**
             * Removes items from an array. This is functionally equivalent to the splice method
             * of Array, but works around bugs in IE8's splice method and does not copy the
             * removed elements in order to return them (because very often they are ignored).
             *
             * @param {Array} array The Array on which to replace.
             * @param {Number} index The index in the array at which to operate.
             * @param {Number} removeCount The number of items to remove at index.
             * @return {Array} The array passed.
             * @method
             */
            erase: erase,

            // }}}
            // {{{ insert

            /**
             * Inserts items in to an array.
             *
             * @param {Array} array The Array in which to insert.
             * @param {Number} index The index in the array at which to operate.
             * @param {Array} items The array of items to insert at index.
             * @return {Array} The array passed.
             */
            insert: function (array, index, items) {

                return replace(array, index, 0, items);

            },

            // }}}
            // {{{ replace

            /**
             * Replaces items in an array. This is functionally equivalent to the splice method
             * of Array, but works around bugs in IE8's splice method and is often more convenient
             * to call because it accepts an array of items to insert rather than use a variadic
             * argument list.
             *
             * @param {Array} array The Array on which to replace.
             * @param {Number} index The index in the array at which to operate.
             * @param {Number} removeCount The number of items to remove at index (can be 0).
             * @param {Array} insert (optional) An array of items to insert at index.
             * @return {Array} The array passed.
             * @method
             */
            replace: replace,

            // }}}
            // {{{ splice

            /**
             * Replaces items in an array. This is equivalent to the splice method of Array, but
             * works around bugs in IE8's splice method. The signature is exactly the same as the
             * splice method except that the array is the first argument. All arguments following
             * removeCount are inserted in the array at index.
             *
             * @param {Array} array The Array on which to replace.
             * @param {Number} index The index in the array at which to operate.
             * @param {Number} removeCount The number of items to remove at index (can be 0).
             * @param {Object...} elements The elements to add to the array. If you don't specify
             * any elements, splice simply removes elements from the array.
             * @return {Array} An array containing the removed items.
             * @method
             */
            splice: splice,

            // }}}
            // {{{ push

            /**
             * Pushes new items onto the end of an Array.
             *
             * Passed parameters may be single items, or arrays of items. If an Array is found in the argument list, all its
             * elements are pushed into the end of the target Array.
             *
             * @param {Array} target The Array onto which to push new items
             * @param {Object...} elements The elements to add to the array. Each parameter may
             * be an Array, in which case all the elements of that Array will be pushed into the end of the
             * destination Array.
             * @return {Array} An array containing all the new items push onto the end.
             *
             */
            push: function(target) {

                var len = arguments.length,
                    i = 1,
                    newItem;

                if (target === undefined) {

                    target = [];

                } else if (!CLI.isArray(target)) {

                    target = [target];

                }

                for (; i < len; i++) {

                    newItem = arguments[i];
                    Array.prototype.push[CLI.isIterable(newItem) ? 'apply' : 'call'](target, newItem);

                }

                return target;
            },

            // }}}
            // {{{ numericSortFn

            /**
             * A function used to sort an array by numeric value. By default, javascript array values
             * are coerced to strings when sorting, which can be problematic when using numeric values. To
             * ensure that the values are sorted numerically, this method can be passed to the sort method:
             *
             *     CLI.Array.sort(myArray, CLI.Array.numericSortFn);
             */
            numericSortFn: function(a, b) {
                return a - b;
            }

            // }}}

        };

        // }}}
        // {{{ CLI.each

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Array#each
         */
        CLI.each = CLIArray.each;

        // }}}
        // {{{ CLIArray.union

        /**
         * @method
         * @member CLI.Array
         * @inheritdoc CLI.Array#merge
         */
        CLIArray.union = CLIArray.merge;

        // }}}
        // {{{ CLI.toArray

        /**
         * @method
         * @member CLI
         * @inheritdoc CLI.Array#toArray
         */
        CLI.toArray = function() {

            return CLIArray.toArray.apply(CLIArray, arguments);

        };

        // }}}

        return CLIArray;

    });

    // }}}

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
