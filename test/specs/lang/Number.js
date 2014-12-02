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
// {{{ CLI.Number

describe("CLI.Number", function() {

    var EN = CLI.Number;

    // {{{ constraining a number

    describe("constraining a number", function() {

        // {{{ integers

        describe("integers", function() {

            // {{{ if the number is within the constaints

            describe("if the number is within the constaints", function() {

                it("should leave the number alone if it is equal to the min and the max", function() {

                    assert.equal(EN.constrain(1, 1, 1), 1);

                });

                it("should leave the number alone if it is equal to the min", function() {

                    assert.equal(EN.constrain(1, 1, 5), 1);

                });

                it("should leave the number alone if it is equal to the max", function() {

                    assert.equal(EN.constrain(5, 1, 5), 5);

                });

                it("should leave the number alone if it is within the min and the max", function() {

                    assert.equal(EN.constrain(3, 1, 5), 3);

                });

                it("should leave a negative number alone if it is within the min and the max", function() {

                    assert.equal(EN.constrain(-3, -5, -1), -3);

                });

            });

            // }}}
            // {{{ if the number is not within the constraints

            describe("if the number is not within the constraints", function() {

                it("should make the number equal to the min value", function() {

                    assert.equal(EN.constrain(1, 3, 5), 3);

                });

                it("should make the number equal to the max value", function() {

                    assert.equal(EN.constrain(100, 1, 5), 5);

                });

                // {{{ and the number is negative

                describe("and the number is negative", function() {

                    it("should make the number equal to the min value", function() {

                        assert.equal(EN.constrain(-10, -50, -30), -30);

                    });

                    it("should make the number equal to the max value", function() {

                        assert.equal(EN.constrain(-100, -50, -30), -50);

                    });

                });

                // }}}

            });

            // }}}
            // {{{ constrain NaN

            describe("constrain NaN", function() {

                it("should never constrain a NaN between two numbers", function() {

                    assert.equal(isNaN(EN.constrain(NaN, 3, 5)), true);

                });

                it("should never constrain a NaN between zero and undefined", function() {

                    assert.equal(isNaN(EN.constrain(NaN, 0, undefined)), true);

                });

                it("should never constrain a NaN between undefined and zero", function() {

                    assert.equal(isNaN(EN.constrain(NaN, undefined, 0)), true);

                });

                it("should never constrain a NaN between a number and undefined", function() {

                    assert.equal(isNaN(EN.constrain(NaN, 10, undefined)), true);

                });

                it("should never constrain a NaN between undefined and a number", function() {

                    assert.equal(isNaN(EN.constrain(NaN, undefined, 10)), true);

                });

                it("should never constrain a NaN between two undefined values", function() {

                    assert.equal(isNaN(EN.constrain(NaN, undefined, undefined)), true);

                });

            });

            // }}}
            // {{{ constrain with NaN/undefined max

            describe("constrain with NaN/undefined max", function() {

                it("should ignore NaN max", function() {

                    assert.equal(EN.constrain(2, 1, NaN), 2);

                });

                it("should ignore NaN max and limit to min", function() {

                    assert.equal(EN.constrain(2, 5, NaN), 5);

                });

                it("should ignore undefined max", function() {

                    assert.equal(EN.constrain(2, 1, undefined), 2);

                });

                it("should ignore undefined max and limit to min", function() {

                    assert.equal(EN.constrain(2, 5, undefined), 5);

                });

            });

            // }}}
            // {{{ constrain with NaN/undefined min

            describe("constrain with NaN/undefined min", function() {

                it("should ignore NaN min", function() {

                    assert.equal(EN.constrain(2, NaN, 5), 2);

                });

                it("should ignore NaN min and limit to max", function() {

                    assert.equal(EN.constrain(20, NaN, 5), 5);

                });

                it("should ignore undefined min", function() {

                    assert.equal(EN.constrain(2, undefined, 5), 2);

                });

                it("should ignore undefined min and limit to max", function() {

                    assert.equal(EN.constrain(20, undefined, 5), 5);

                });

            });

            // }}}
            // {{{ constrain with NaN/undefined min/max

            describe("constrain with NaN/undefined min/max", function() {

                it("should ignore NaN min/max", function() {

                    assert.equal(EN.constrain(2, NaN, NaN), 2);

                });

                it("should ignore undefined min/max", function() {

                    assert.equal(EN.constrain(2, undefined, undefined), 2);

                });

                it("should ignore NaN min and undefined max", function() {

                    assert.equal(EN.constrain(2, NaN, undefined), 2);

                });

                it("should ignore undefined min and NaN max", function() {

                    assert.equal(EN.constrain(2, undefined, NaN), 2);

                });

            });

            // }}}

        });

        // }}}
        // {{{ floating point numbers

        describe("floating point numbers", function() {

            // {{{ if the number is within the constaints

            describe("if the number is within the constaints", function() {

                it("should leave the number alone", function() {

                    assert.equal(EN.constrain(3.3, 3.1, 3.5), 3.3);

                });

                it("should leave a negative number alone", function() {

                    assert.equal(EN.constrain(-3.3, -3.5, -3.1), -3.3);

                });

            });

            // }}}
            // {{{ and the number is negative

            describe("and the number is negative", function() {

                it("should make the number equal to the min value", function() {

                    assert.equal(EN.constrain(-3.3, -3.1, -3), -3.1);

                });

                it("should make the number equal to the max value", function() {

                    assert.equal(EN.constrain(-2.1, -3.1, -3), -3);

                });

            });

            // }}}

        });

        // }}}
        // {{{ null constraints

        describe("null constraints", function() {

            it("should constrain when the max is null and the number is less than min", function() {

                assert.equal(EN.constrain(5, 10, null), 10);

            });

            it("should constrain when the max is null and the number is equal to min", function() {

                assert.equal(EN.constrain(5, 5, null), 5);

            });

            it("should not constrain when the max is null and the number is greater than min", function() {

                assert.equal(EN.constrain(5, 2, null), 5);

            });

            it("should constrain when the min is null and the number is greater than max", function() {

                assert.equal(EN.constrain(5, null, 2), 2);

            });

            it("should constrain when the min is null and the number is equal to max", function() {

                assert.equal(EN.constrain(5, null, 5), 5);

            });

            it("should not constrain when the min is null and the number is less than max", function() {

                assert.equal(EN.constrain(5, null, 10), 5);

            });

            it("should not constrain when min and max are both null", function() {

                assert.equal(EN.constrain(5, null, null), 5);

            });

        });

        // }}}

    });

    // }}}
    // {{{ toFixed

    describe("toFixed", function() {

        var f = EN.toFixed;

        it("should return a string", function() {

            assert.equal(typeof f(1), 'string');

        });

        it("should default precision to 0", function() {

            assert.equal(f(1.23456), '1');

        });

        it("should output the correct number of decimal places", function() {

            assert.equal(f(1, 3), '1.000');

        });

        it("should round correctly", function() {

            assert.equal(f(1.9834657, 1), '2.0');

        });

        it("should round with negative numbers", function() {

            assert.equal(f(-3.4265, 2), '-3.43');

        });

    });

    // }}}
    // {{{ snap

    describe("snap", function() {

        // Params are (value, snapincrement, minValue, maxValue)
        var snap = EN.snap;

        it("should enforce minValue if increment is zero", function() {

            assert.equal(snap(40, 0, 50, 100), 50);

        });

        it("should enforce maxValue if increment is zero", function() {

            assert.equal(snap(5000, 0, 0, 100), 100);

        });

        it("should enforce minValue if passed", function() {

            assert.equal(snap(0, 2, 1, 100), 1);

        });

        it("should not enforce a minimum if no minValue passed", function() {

            assert.equal(snap(21, 2, undefined, 100), 22);

        });

        it("should enforce maxValue if passed", function() {

            assert.equal(snap(1000, 2, undefined, 100), 100);

        });

        it("should not enforce a maximum if no maxValue passed", function() {

            assert.equal(snap(21, 2, undefined, undefined), 22);

        });

        it("should snap to a snap point based upon zero", function() {

            assert.equal(snap(56, 2, 55, 65), 56);
            assert.equal(snap(100, 2, 55, 66), 66);

        });

        it("should enforce the minValue", function() {

            assert.equal(snap(20, 2, 55, 65), 55);

        });

        it("should round to the nearest snap point", function() {

            assert.equal(snap(4, 5, 0, 100), 5);

        });

        it("should snap negative numbers", function() {

            assert.equal(snap(-9, 10, -100, 0), -10);
            assert.equal(snap(-1, 10, -100, 0), 0);

        });

    });

    // }}}
    // {{{ snapInRange

    describe("snapInRange", function() {

        // Params are (value, snapincrement, minValue, maxValue)
        var snapInRange = EN.snapInRange;

        it("should enforce minValue if increment is zero", function() {

            assert.equal(snapInRange(50, 0, 0, 100), 50);

        });

        it("should enforce maxValue if increment is zero", function() {

            assert.equal(snapInRange(5000, 0, 0, 100), 100);

        });

        it("should enforce minValue if passed", function() {

            assert.equal(snapInRange(0, 2, 1, 100), 1);

        });

        it("should not enforce a minimum if no minValue passed", function() {

            assert.equal(snapInRange(21, 2, undefined, 100), 22);

        });

        it("should enforce maxValue if passed", function() {

            assert.equal(snapInRange(1000, 2, undefined, 100), 100);

        });

        it("should not enforce a maximum if no maxValue passed", function() {

            assert.equal(snapInRange(21, 2, undefined, undefined), 22);

        });

        // Valid values are 55, 57, 59, 61, 63, 65
        it("should snap to a snap point based upon the minValue", function() {

            assert.equal(snapInRange(56, 2, 55, 65), 57);

        });

        it("should enforce the minValue", function() {

            assert.equal(snapInRange(20, 2, 55, 65), 55);

        });

        // Valid values are still 55, 57, 59, 61, 63, 65
        it("should snap to a snap point based upon the minValue even if maxValue is not on a snap point", function() {

            assert.equal(snapInRange(100, 2, 55, 66), 67);

        });

        it("should round to the nearest snap point", function() {

            assert.equal(snapInRange(4, 5, 0, 100), 5);
            assert.equal(snapInRange(10, 10, 1, 101), 11);
            assert.equal(snapInRange(11, 10, 1, 101), 11);
            assert.equal(snapInRange(12, 10, 1, 101), 11);
            assert.equal(snapInRange(20, 10, 1, 101), 21);
            assert.equal(snapInRange(21, 10, 1, 101), 21);
            assert.equal(snapInRange(22, 10, 1, 101), 21);

        });

        it("should handle negative ranges", function() {

            assert.equal(snapInRange(-10, 10, -101, -1), -11);
            assert.equal(snapInRange(-11, 10, -101, -1), -11);
            assert.equal(snapInRange(-12, 10, -101, -1), -11);
            assert.equal(snapInRange(-20, 10, -101, -1), -21);
            assert.equal(snapInRange(-21, 10, -101, -1), -21);
            assert.equal(snapInRange(-22, 10, -101, -1), -21);

        });

    });

    // }}}
    // {{{ from

    describe("from", function() {

        var from = EN.from;

        it("should handle numbers", function() {

            assert.equal(from(2, 1), 2);
            assert.equal(from(-2, 1), -2);
            assert.equal(from(999999, 1), 999999);
            assert.equal(from(-999999, 1), -999999);
            assert.equal(from(999999.999, 1), 999999.999);
            assert.equal(from(-999999.999, 1), -999999.999);

        });

        it("should handle strings that represent numbers", function() {

            assert.equal(from("2", 1), 2);
            assert.equal(from("-2", 1), -2);
            assert.equal(from("999999", 1), 999999);
            assert.equal(from("-999999", 1), -999999);
            assert.equal(from("999999.999", 1), 999999.999);
            assert.equal(from("-999999.999", 1), -999999.999);

        });

        it("should handle infinity", function() {

            assert.equal(from(1/0, 1), global.Number.POSITIVE_INFINITY);
            assert.equal(from(-1/0, 1), global.Number.NEGATIVE_INFINITY);

        });

        it("should return default value if value is not a number or numeric string", function() {

            assert.equal(from("", 100), 100);
            assert.equal(from(true, 100), 100);
            assert.equal(from(false, 100), 100);
            assert.equal(from("I would like to be a number", 100), 100);
            assert.equal(from("12345ImAlmostANumber", 100), 100);

        });

    });

    // }}}
    // {{{ randomInt

    describe("randomInt", function() {

        var randomInt = EN.randomInt;

        it("should return a random integer within the specified range", function() {

            assert.equal(randomInt(0, 100) >= 0, true);
            assert.equal(randomInt(0, 100) > 100, false);
            assert.equal(randomInt(-100, 0) < -100, false);
            assert.equal(randomInt(-100, 0) > 0, false);
            assert.equal(randomInt(1, 1), 1);
            assert.equal(randomInt(1, 1), 1);

        });

    });

    // }}}
    // {{{ correctFloat

    describe("correctFloat", function() {

        var correctFloat = EN.correctFloat;

        it("should correct a small positive overflow", function() {

            assert.equal(correctFloat(0.1 + 0.2), 0.3);

        });

        it("should correct a small negative overflow", function() {

            assert.equal(correctFloat(-0.1 + -0.2), -0.3);

        });

        it("should correct large overflows", function() {

            assert.equal(correctFloat(10000000.12300000000001), 10000000.123);

        });

    });

    // }}}
    // {{{ clipIndices

    describe('clipIndices', function () {

        function encode (value) {
            if (value === undefined) {
                return undefined;
            }
            return CLI.encode(value);
        }

        var testSuites = [
            { length: 0, indices: [0],   options: null, expect: [0,0] },
            { length: 0, indices: [3],   options: null, expect: [0,0] },
            { length: 0, indices: [-1],  options: null, expect: [0,0] },
            { length: 0, indices: [-5],  options: null, expect: [0,0] },
            { length: 0, indices: [],    options: null, expect: [0,0] },
            { length: 0, indices: null,  options: null, expect: [0,0] },
            { length: 0,                 options: null, expect: [0,0] },

            { length: 8, indices: [],    options: null, expect: [0,8] },
            { length: 8, indices: null,  options: null, expect: [0,8] },
            { length: 8,                 options: null, expect: [0,8] },

            { length: 8, indices: [0],   options: null, expect: [0,8] },
            { length: 8, indices: [3],   options: null, expect: [3,8] },
            { length: 8, indices: [8],   options: null, expect: [8,8] },
            { length: 8, indices: [9],   options: null, expect: [8,8] },
            { length: 8, indices: [-1],  options: null, expect: [7,8] },
            { length: 8, indices: [-3],  options: null, expect: [5,8] },
            { length: 8, indices: [-7],  options: null, expect: [1,8] },
            { length: 8, indices: [-8],  options: null, expect: [0,8] },
            { length: 8, indices: [-9],  options: null, expect: [0,8] },
            { length: 8, indices: [-10], options: null, expect: [0,8] },

            { length: 8, indices: [0,0],   options: null, expect: [0,0] },
            { length: 8, indices: [0,3],   options: null, expect: [0,3] },
            { length: 8, indices: [0,8],   options: null, expect: [0,8] },
            { length: 8, indices: [0,9],   options: null, expect: [0,8] },
            { length: 8, indices: [0,-1],  options: null, expect: [0,7] },
            { length: 8, indices: [0,-3],  options: null, expect: [0,5] },
            { length: 8, indices: [0,-7],  options: null, expect: [0,1] },
            { length: 8, indices: [0,-8],  options: null, expect: [0,0] },
            { length: 8, indices: [0,-9],  options: null, expect: [0,0] },
            { length: 8, indices: [0,-10], options: null, expect: [0,0] },

            { length: 8, indices: [1,0],   options: null, expect: [1,1] },
            { length: 8, indices: [1,3],   options: null, expect: [1,3] },
            { length: 8, indices: [1,8],   options: null, expect: [1,8] },
            { length: 8, indices: [1,9],   options: null, expect: [1,8] },
            { length: 8, indices: [1,-1],  options: null, expect: [1,7] },
            { length: 8, indices: [1,-3],  options: null, expect: [1,5] },
            { length: 8, indices: [1,-7],  options: null, expect: [1,1] },
            { length: 8, indices: [1,-8],  options: null, expect: [1,1] },
            { length: 8, indices: [1,-9],  options: null, expect: [1,1] },
            { length: 8, indices: [1,-10], options: null, expect: [1,1] },

            { length: 8, indices: [3,0],   options: null, expect: [3,3] },
            { length: 8, indices: [3,3],   options: null, expect: [3,3] },
            { length: 8, indices: [3,8],   options: null, expect: [3,8] },
            { length: 8, indices: [3,9],   options: null, expect: [3,8] },
            { length: 8, indices: [3,-1],  options: null, expect: [3,7] },
            { length: 8, indices: [3,-3],  options: null, expect: [3,5] },
            { length: 8, indices: [3,-7],  options: null, expect: [3,3] },
            { length: 8, indices: [3,-8],  options: null, expect: [3,3] },
            { length: 8, indices: [3,-9],  options: null, expect: [3,3] },
            { length: 8, indices: [3,-10], options: null, expect: [3,3] },

            { length: 8, indices: [7,0],   options: null, expect: [7,7] },
            { length: 8, indices: [7,3],   options: null, expect: [7,7] },
            { length: 8, indices: [7,8],   options: null, expect: [7,8] },
            { length: 8, indices: [7,9],   options: null, expect: [7,8] },
            { length: 8, indices: [7,-1],  options: null, expect: [7,7] },
            { length: 8, indices: [7,-3],  options: null, expect: [7,7] },
            { length: 8, indices: [7,-7],  options: null, expect: [7,7] },
            { length: 8, indices: [7,-8],  options: null, expect: [7,7] },
            { length: 8, indices: [7,-9],  options: null, expect: [7,7] },
            { length: 8, indices: [7,-10], options: null, expect: [7,7] },

            { length: 8, indices: [-1,0],   options: null, expect: [7,7] },
            { length: 8, indices: [-1,3],   options: null, expect: [7,7] },
            { length: 8, indices: [-1,8],   options: null, expect: [7,8] },
            { length: 8, indices: [-1,9],   options: null, expect: [7,8] },
            { length: 8, indices: [-1,-1],  options: null, expect: [7,7] },
            { length: 8, indices: [-1,-3],  options: null, expect: [7,7] },
            { length: 8, indices: [-1,-7],  options: null, expect: [7,7] },
            { length: 8, indices: [-1,-8],  options: null, expect: [7,7] },
            { length: 8, indices: [-1,-9],  options: null, expect: [7,7] },
            { length: 8, indices: [-1,-10], options: null, expect: [7,7] },

            { length: 8, indices: [-5,0],   options: null, expect: [3,3] },
            { length: 8, indices: [-5,3],   options: null, expect: [3,3] },
            { length: 8, indices: [-5,8],   options: null, expect: [3,8] },
            { length: 8, indices: [-5,9],   options: null, expect: [3,8] },
            { length: 8, indices: [-5,-1],  options: null, expect: [3,7] },
            { length: 8, indices: [-5,-3],  options: null, expect: [3,5] },
            { length: 8, indices: [-5,-7],  options: null, expect: [3,3] },
            { length: 8, indices: [-5,-8],  options: null, expect: [3,3] },
            { length: 8, indices: [-5,-9],  options: null, expect: [3,3] },
            { length: 8, indices: [-5,-10], options: null, expect: [3,3] },

            { length: 8, indices: [-7,0],   options: null, expect: [1,1] },
            { length: 8, indices: [-7,3],   options: null, expect: [1,3] },
            { length: 8, indices: [-7,8],   options: null, expect: [1,8] },
            { length: 8, indices: [-7,9],   options: null, expect: [1,8] },
            { length: 8, indices: [-7,-1],  options: null, expect: [1,7] },
            { length: 8, indices: [-7,-3],  options: null, expect: [1,5] },
            { length: 8, indices: [-7,-7],  options: null, expect: [1,1] },
            { length: 8, indices: [-7,-8],  options: null, expect: [1,1] },
            { length: 8, indices: [-7,-9],  options: null, expect: [1,1] },
            { length: 8, indices: [-7,-10], options: null, expect: [1,1] },

            { length: 8, indices: [-8,0],   options: null, expect: [0,0] },
            { length: 8, indices: [-8,3],   options: null, expect: [0,3] },
            { length: 8, indices: [-8,8],   options: null, expect: [0,8] },
            { length: 8, indices: [-8,9],   options: null, expect: [0,8] },
            { length: 8, indices: [-8,-1],  options: null, expect: [0,7] },
            { length: 8, indices: [-8,-3],  options: null, expect: [0,5] },
            { length: 8, indices: [-8,-7],  options: null, expect: [0,1] },
            { length: 8, indices: [-8,-8],  options: null, expect: [0,0] },
            { length: 8, indices: [-8,-9],  options: null, expect: [0,0] },
            { length: 8, indices: [-8,-10], options: null, expect: [0,0] },

            { length: 8, indices: [0,0],   options: 'COUNT', expect: [0,0] },
            { length: 8, indices: [0,3],   options: 'COUNT', expect: [0,3] },
            { length: 8, indices: [0,8],   options: 'COUNT', expect: [0,8] },
            { length: 8, indices: [0,9],   options: 'COUNT', expect: [0,8] },
            { length: 8, indices: [0,-1],  options: 'COUNT', expect: [0,0] },
            { length: 8, indices: [0,-3],  options: 'COUNT', expect: [0,0] },

            { length: 8, indices: [1,0],   options: 'COUNT', expect: [1,1] },
            { length: 8, indices: [1,3],   options: 'COUNT', expect: [1,4] },
            { length: 8, indices: [1,6],   options: 'COUNT', expect: [1,7] },
            { length: 8, indices: [1,8],   options: 'COUNT', expect: [1,8] },
            { length: 8, indices: [1,9],   options: 'COUNT', expect: [1,8] },
            { length: 8, indices: [1,-1],  options: 'COUNT', expect: [1,1] },

            { length: 8, indices: [3,0],   options: 'COUNT', expect: [3,3] },
            { length: 8, indices: [3,3],   options: 'COUNT', expect: [3,6] },
            { length: 8, indices: [3,4],   options: 'COUNT', expect: [3,7] },
            { length: 8, indices: [3,8],   options: 'COUNT', expect: [3,8] },
            { length: 8, indices: [3,9],   options: 'COUNT', expect: [3,8] },
            { length: 8, indices: [3,-1],  options: 'COUNT', expect: [3,3] },

            { length: 8, indices: [7,0],   options: 'COUNT', expect: [7,7] },
            { length: 8, indices: [7,3],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [7,8],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [7,9],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [7,-1],  options: 'COUNT', expect: [7,7] },

            { length: 8, indices: [-1,0],   options: 'COUNT', expect: [7,7] },
            { length: 8, indices: [-1,3],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [-1,8],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [-1,9],   options: 'COUNT', expect: [7,8] },
            { length: 8, indices: [-1,-1],  options: 'COUNT', expect: [7,7] },

            { length: 8, indices: [-5,0],   options: 'COUNT', expect: [3,3] },
            { length: 8, indices: [-5,3],   options: 'COUNT', expect: [3,6] },
            { length: 8, indices: [-5,4],   options: 'COUNT', expect: [3,7] },
            { length: 8, indices: [-5,8],   options: 'COUNT', expect: [3,8] },
            { length: 8, indices: [-5,9],   options: 'COUNT', expect: [3,8] },
            { length: 8, indices: [-5,-1],  options: 'COUNT', expect: [3,3] },

            { length: 8, indices: [-7,0],   options: 'COUNT', expect: [1,1] },
            { length: 8, indices: [-7,3],   options: 'COUNT', expect: [1,4] },
            { length: 8, indices: [-7,6],   options: 'COUNT', expect: [1,7] },
            { length: 8, indices: [-7,7],   options: 'COUNT', expect: [1,8] },
            { length: 8, indices: [-7,8],   options: 'COUNT', expect: [1,8] },
            { length: 8, indices: [-7,9],   options: 'COUNT', expect: [1,8] },
            { length: 8, indices: [-7,-1],  options: 'COUNT', expect: [1,1] },

            { length: 8, indices: [-8,0],   options: 'COUNT', expect: [0,0] },
            { length: 8, indices: [-8,3],   options: 'COUNT', expect: [0,3] },
            { length: 8, indices: [-8,7],   options: 'COUNT', expect: [0,7] },
            { length: 8, indices: [-8,8],   options: 'COUNT', expect: [0,8] },
            { length: 8, indices: [-8,9],   options: 'COUNT', expect: [0,8] },
            { length: 8, indices: [-8,-1],  options: 'COUNT', expect: [0,0] },

            { length: 8, indices: [0,0],   options: 'INCLUSIVE', expect: [0,1] },
            { length: 8, indices: [0,3],   options: 'INCLUSIVE', expect: [0,4] },
            { length: 8, indices: [0,6],   options: 'INCLUSIVE', expect: [0,7] },
            { length: 8, indices: [0,7],   options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [0,8],   options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [0,-1],  options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [0,-3],  options: 'INCLUSIVE', expect: [0,6] },
            { length: 8, indices: [0,-7],  options: 'INCLUSIVE', expect: [0,2] },
            { length: 8, indices: [0,-8],  options: 'INCLUSIVE', expect: [0,1] },
            { length: 8, indices: [0,-9],  options: 'INCLUSIVE', expect: [0,0] },
            { length: 8, indices: [0,-10], options: 'INCLUSIVE', expect: [0,0] },

            { length: 8, indices: [1,0],   options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [1,3],   options: 'INCLUSIVE', expect: [1,4] },
            { length: 8, indices: [1,8],   options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [1,9],   options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [1,-1],  options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [1,-3],  options: 'INCLUSIVE', expect: [1,6] },
            { length: 8, indices: [1,-7],  options: 'INCLUSIVE', expect: [1,2] },
            { length: 8, indices: [1,-8],  options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [1,-9],  options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [1,-10], options: 'INCLUSIVE', expect: [1,1] },

            { length: 8, indices: [3,0],   options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [3,3],   options: 'INCLUSIVE', expect: [3,4] },
            { length: 8, indices: [3,6],   options: 'INCLUSIVE', expect: [3,7] },
            { length: 8, indices: [3,7],   options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [3,8],   options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [3,-1],  options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [3,-3],  options: 'INCLUSIVE', expect: [3,6] },
            { length: 8, indices: [3,-7],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [3,-8],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [3,-9],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [3,-10], options: 'INCLUSIVE', expect: [3,3] },

            { length: 8, indices: [7,0],   options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,3],   options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,8],   options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [7,9],   options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [7,-1],  options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [7,-3],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,-7],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,-8],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,-9],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [7,-10], options: 'INCLUSIVE', expect: [7,7] },

            { length: 8, indices: [-1,0],   options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,3],   options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,8],   options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [-1,9],   options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [-1,-1],  options: 'INCLUSIVE', expect: [7,8] },
            { length: 8, indices: [-1,-3],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,-7],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,-8],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,-9],  options: 'INCLUSIVE', expect: [7,7] },
            { length: 8, indices: [-1,-10], options: 'INCLUSIVE', expect: [7,7] },

            { length: 8, indices: [-5,0],   options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [-5,3],   options: 'INCLUSIVE', expect: [3,4] },
            { length: 8, indices: [-5,8],   options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [-5,9],   options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [-5,-1],  options: 'INCLUSIVE', expect: [3,8] },
            { length: 8, indices: [-5,-3],  options: 'INCLUSIVE', expect: [3,6] },
            { length: 8, indices: [-5,-7],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [-5,-8],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [-5,-9],  options: 'INCLUSIVE', expect: [3,3] },
            { length: 8, indices: [-5,-10], options: 'INCLUSIVE', expect: [3,3] },

            { length: 8, indices: [-7,0],   options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [-7,3],   options: 'INCLUSIVE', expect: [1,4] },
            { length: 8, indices: [-7,8],   options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [-7,9],   options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [-7,-1],  options: 'INCLUSIVE', expect: [1,8] },
            { length: 8, indices: [-7,-3],  options: 'INCLUSIVE', expect: [1,6] },
            { length: 8, indices: [-7,-7],  options: 'INCLUSIVE', expect: [1,2] },
            { length: 8, indices: [-7,-8],  options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [-7,-9],  options: 'INCLUSIVE', expect: [1,1] },
            { length: 8, indices: [-7,-10], options: 'INCLUSIVE', expect: [1,1] },

            { length: 8, indices: [-8,0],   options: 'INCLUSIVE', expect: [0,1] },
            { length: 8, indices: [-8,3],   options: 'INCLUSIVE', expect: [0,4] },
            { length: 8, indices: [-8,8],   options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [-8,9],   options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [-8,-1],  options: 'INCLUSIVE', expect: [0,8] },
            { length: 8, indices: [-8,-3],  options: 'INCLUSIVE', expect: [0,6] },
            { length: 8, indices: [-8,-7],  options: 'INCLUSIVE', expect: [0,2] },
            { length: 8, indices: [-8,-8],  options: 'INCLUSIVE', expect: [0,1] },
            { length: 8, indices: [-8,-9],  options: 'INCLUSIVE', expect: [0,0] },
            { length: 8, indices: [-8,-10], options: 'INCLUSIVE', expect: [0,0] },

            { length: 8, indices: [0],   options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [3],   options: 'NOWRAP', expect: [3,8] },
            { length: 8, indices: [8],   options: 'NOWRAP', expect: [8,8] },
            { length: 8, indices: [9],   options: 'NOWRAP', expect: [8,8] },
            { length: 8, indices: [-1],  options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [-9],  options: 'NOWRAP', expect: [0,8] },

            { length: 8, indices: [0,0],   options: 'NOWRAP', expect: [0,0] },
            { length: 8, indices: [0,3],   options: 'NOWRAP', expect: [0,3] },
            { length: 8, indices: [0,8],   options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [0,9],   options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [0,-1],  options: 'NOWRAP', expect: [0,0] },
            { length: 8, indices: [0,-10], options: 'NOWRAP', expect: [0,0] },

            { length: 8, indices: [1,0],   options: 'NOWRAP', expect: [1,1] },
            { length: 8, indices: [1,3],   options: 'NOWRAP', expect: [1,3] },
            { length: 8, indices: [1,8],   options: 'NOWRAP', expect: [1,8] },
            { length: 8, indices: [1,9],   options: 'NOWRAP', expect: [1,8] },
            { length: 8, indices: [1,-1],  options: 'NOWRAP', expect: [1,1] },
            { length: 8, indices: [1,-10], options: 'NOWRAP', expect: [1,1] },

            { length: 8, indices: [3,0],   options: 'NOWRAP', expect: [3,3] },
            { length: 8, indices: [3,3],   options: 'NOWRAP', expect: [3,3] },
            { length: 8, indices: [3,8],   options: 'NOWRAP', expect: [3,8] },
            { length: 8, indices: [3,9],   options: 'NOWRAP', expect: [3,8] },
            { length: 8, indices: [3,-1],  options: 'NOWRAP', expect: [3,3] },
            { length: 8, indices: [3,-10], options: 'NOWRAP', expect: [3,3] },

            { length: 8, indices: [7,0],   options: 'NOWRAP', expect: [7,7] },
            { length: 8, indices: [7,3],   options: 'NOWRAP', expect: [7,7] },
            { length: 8, indices: [7,8],   options: 'NOWRAP', expect: [7,8] },
            { length: 8, indices: [7,9],   options: 'NOWRAP', expect: [7,8] },
            { length: 8, indices: [7,-1],  options: 'NOWRAP', expect: [7,7] },
            { length: 8, indices: [7,-10], options: 'NOWRAP', expect: [7,7] },

            { length: 8, indices: [-1,0],   options: 'NOWRAP', expect: [0,0] },
            { length: 8, indices: [-1,3],   options: 'NOWRAP', expect: [0,3] },
            { length: 8, indices: [-1,8],   options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [-1,9],   options: 'NOWRAP', expect: [0,8] },
            { length: 8, indices: [-1,-1],  options: 'NOWRAP', expect: [0,0] },
            { length: 8, indices: [-1,-10], options: 'NOWRAP', expect: [0,0] }
        ];

        CLI.each(testSuites, function (suite) {
            it('should produce ' + CLI.encode(suite.expect) +
                ' given length=' + suite.length + ' and indices=' + encode(suite.indices) +
                    (suite.options ? ' options: ' + suite.options : ''),
                function () {

                    var opt = suite.options && CLI.Number.Clip[suite.options];
                    var actual = CLI.Number.clipIndices(suite.length, suite.indices, opt);

                    assert.deepEqual(actual, suite.expect);
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

