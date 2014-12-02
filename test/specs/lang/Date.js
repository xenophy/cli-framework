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
// {{{ CLI.Date

describe("CLI.Date", function() {

    // {{{ Elapsed time between dates

    describe('Elapsed time between dates', function () {

        var dateValue = 0,
            increment = 3,
            OriginalDate = Date,
            originalNow = CLI.Date.now,
            PredictableDate = function() {
                return {
                    getTime: function() {
                    },
                    valueOf: function() {
                        return PredictableDate.now();
                    }
                };
            };

        function mockDate() {
            Date = PredictableDate;
        }

        beforeEach(function () {

            CLI.Date.now = PredictableDate.now = function () {
                dateValue = dateValue + increment;
                return dateValue;
            };

        });

        afterEach(function() {

            CLI.Date.now    = originalNow;
            Date            = OriginalDate;
            increment       += 16;

        });

        it("should get time elapsed in millisecond between date instantiation", function () {

            mockDate();

            var dateA = new PredictableDate();

            assert.equal(CLI.Date.getElapsed(dateA), 3);

        });

        it("should get time elapsed in millisecond between two dates", function () {

            mockDate();

            var dateA = new PredictableDate(),
                dateB = new PredictableDate();

            assert.equal(CLI.Date.getElapsed(dateA, dateB), 19);

        });

    });

    // }}}
    // {{{ now

    describe("now", function() {

        it("should return the current timestamp", function() {

            var millisBeforeCall = +new Date(),
                millisAtCall = CLI.Date.now(),
                millisAfterCall = +new Date();

            assert.equal(millisAtCall <= millisBeforeCall, true);
            assert.equal(millisAtCall >= millisAfterCall, true);

        });

    });

    // }}}
    // {{{ getShortMonthName

    describe("getShortMonthName", function() {

       it("should return 3 letter abbreviation for the corresponding month [0-11]", function() {

           assert.equal(CLI.Date.getShortMonthName(0), "Jan");
           assert.equal(CLI.Date.getShortMonthName(1), "Feb");
           assert.equal(CLI.Date.getShortMonthName(2), "Mar");
           assert.equal(CLI.Date.getShortMonthName(3), "Apr");
           assert.equal(CLI.Date.getShortMonthName(4), "May");
           assert.equal(CLI.Date.getShortMonthName(5), "Jun");
           assert.equal(CLI.Date.getShortMonthName(6), "Jul");
           assert.equal(CLI.Date.getShortMonthName(7), "Aug");
           assert.equal(CLI.Date.getShortMonthName(8), "Sep");
           assert.equal(CLI.Date.getShortMonthName(9), "Oct");
           assert.equal(CLI.Date.getShortMonthName(10), "Nov");
           assert.equal(CLI.Date.getShortMonthName(11), "Dec");

       });

    });

    // }}}
    // {{{ getShortDayName

    describe("getShortDayName", function() {

        it("should return 3 letter abbreviation for the corresponding weekday [0-6]", function() {

            assert.equal(CLI.Date.getShortDayName(0), "Sun");
            assert.equal(CLI.Date.getShortDayName(1), "Mon");
            assert.equal(CLI.Date.getShortDayName(2), "Tue");
            assert.equal(CLI.Date.getShortDayName(3), "Wed");
            assert.equal(CLI.Date.getShortDayName(4), "Thu");
            assert.equal(CLI.Date.getShortDayName(5), "Fri");
            assert.equal(CLI.Date.getShortDayName(6), "Sat");

        });

    });

    // }}}
    // {{{ getMonthNumber

    describe("getMonthNumber", function() {

        it("should return the month number [0-11] for the corresponding short month name", function() {

            assert.equal(CLI.Date.getMonthNumber("jan"), 0);
            assert.equal(CLI.Date.getMonthNumber("feb"), 1);
            assert.equal(CLI.Date.getMonthNumber("mar"), 2);
            assert.equal(CLI.Date.getMonthNumber("apr"), 3);
            assert.equal(CLI.Date.getMonthNumber("MAY"), 4);
            assert.equal(CLI.Date.getMonthNumber("JUN"), 5);
            assert.equal(CLI.Date.getMonthNumber("JUL"), 6);
            assert.equal(CLI.Date.getMonthNumber("AUG"), 7);
            assert.equal(CLI.Date.getMonthNumber("Sep"), 8);
            assert.equal(CLI.Date.getMonthNumber("Oct"), 9);
            assert.equal(CLI.Date.getMonthNumber("Nov"), 10);
            assert.equal(CLI.Date.getMonthNumber("Dec"), 11);

        });

        it("should return the month number [0-11] for the corresponding full month name", function() {

            assert.equal(CLI.Date.getMonthNumber("january"), 0);
            assert.equal(CLI.Date.getMonthNumber("february"), 1);
            assert.equal(CLI.Date.getMonthNumber("march"), 2);
            assert.equal(CLI.Date.getMonthNumber("april"), 3);
            assert.equal(CLI.Date.getMonthNumber("MAY"), 4);
            assert.equal(CLI.Date.getMonthNumber("JUNE"), 5);
            assert.equal(CLI.Date.getMonthNumber("JULY"), 6);
            assert.equal(CLI.Date.getMonthNumber("AUGUST"), 7);
            assert.equal(CLI.Date.getMonthNumber("September"), 8);
            assert.equal(CLI.Date.getMonthNumber("October"), 9);
            assert.equal(CLI.Date.getMonthNumber("November"), 10);
            assert.equal(CLI.Date.getMonthNumber("December"), 11);

        });

    });

    // }}}
    // {{{ formatContainsHourInfo

    describe("formatContainsHourInfo", function() {

        it("should return true when format contains hour info", function() {
            assert.equal(CLI.Date.formatContainsHourInfo("d/m/Y H:i:s"), true);
        });

        it("should return false when format doesn't contains hour info", function() {
            assert.equal(CLI.Date.formatContainsHourInfo("d/m/Y"), false);
        });

    });

    // }}}
    // {{{ formatContainsDateInfo

    describe("formatContainsDateInfo", function() {

        it("should return true when format contains date info", function() {
            assert.equal(CLI.Date.formatContainsDateInfo("d/m/Y H:i:s"), true);
        });

        it("should return false when format doesn't contains date info", function() {
            assert.equal(CLI.Date.formatContainsDateInfo("H:i:s"), false);
        });

    });

    // }}}
    // {{{ isValid

    describe("isValid", function() {

        it("should return true for valid dates", function() {
            assert.equal(CLI.Date.isValid(1981, 10, 15, 16, 30, 1, 2), true);
        });

        it("should return false for invalid dates", function() {

            assert.equal(CLI.Date.isValid(999999, 10, 15, 16, 30, 1, 2), false);
            assert.equal(CLI.Date.isValid(1981, 13, 15, 16, 30, 1, 2), false);
            assert.equal(CLI.Date.isValid(1981, 10, 32, 16, 30, 1, 2), false);
            assert.equal(CLI.Date.isValid(1981, 10, 15, 25, 30, 1, 2), false);
            assert.equal(CLI.Date.isValid(1981, 10, 15, 16, 60, 1, 2), false);
            assert.equal(CLI.Date.isValid(1981, 10, 15, 16, 30, 60, 2), false);
            assert.equal(CLI.Date.isValid(1981, 10, 15, 16, 30, 1, 100000), false);

        });

    });

    // }}}
    // {{{ parse

    describe("parse", function() {

        it("should parse year-only", function() {

            var date = CLI.Date.parse("2011", "Y"), 
                expectedDate = new Date();

            expectedDate.setFullYear(2011);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);

            assert.deepEqual(date, expectedDate);
        });

        it("should parse year-month-date", function() {

            var date = CLI.Date.parse("2011-01-20", "Y-m-d"),
                expectedDate = new Date();

            expectedDate.setFullYear(2011);
            expectedDate.setMonth(0);
            expectedDate.setDate(20);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);

            assert.deepEqual(date, expectedDate);

        });

        it("should parse year-month-date hour:minute:second am/pm", function() {

            var date = CLI.Date.parse("2011-01-20 6:28:33 PM", "Y-m-d g:i:s A"),
                expectedDate = new Date();

            expectedDate.setFullYear(2011);
            expectedDate.setMonth(0);
            expectedDate.setDate(20);
            expectedDate.setHours(18);
            expectedDate.setMinutes(28);
            expectedDate.setSeconds(33);
            expectedDate.setMilliseconds(0);

            assert.deepEqual(date, expectedDate);

        });

        it("should return null when parsing an invalid date like Feb 31st in strict mode", function() {

            assert.equal(CLI.Date.parse("2011-02-31", "Y-m-d", true), null);

        });

        it("should read am/pm", function() {

            var date = CLI.Date.parse('2010/01/01 12:45 am', 'Y/m/d G:i a'),
                expectedDate = new Date();

            expectedDate.setFullYear(2010);
            expectedDate.setMonth(0);
            expectedDate.setDate(1);
            expectedDate.setHours(0);
            expectedDate.setMinutes(45);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);

            assert.deepEqual(date, expectedDate);

        });

        it("should allow am/pm before minutes", function() {

            var date = CLI.Date.parse('2010/01/01 am 12:45', 'Y/m/d a G:i'),
                expectedDate = new Date();

            expectedDate.setFullYear(2010);
            expectedDate.setMonth(0);
            expectedDate.setDate(1);
            expectedDate.setHours(0);
            expectedDate.setMinutes(45);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);

            assert.deepEqual(date, expectedDate);

        });

        it("should parse time format", function() {

            // Can't use a static date because the timezone of the
            // local machine will change the result
            var expectedDate = new Date(2010, 0, 1, 13, 45, 32, 4),
                date = CLI.Date.parse(expectedDate.getTime().toString(), 'time');

            assert.deepEqual(date, expectedDate);

        });

        it("should parse timestamp format", function() {

            // Can't use a static date because the timezone of the
            // local machine will change the result
            // Drop the ms since we don't go to that resolution
            var expectedDate = new Date(2010, 0, 1, 13, 45, 32, 0),
                stamp = Math.floor(expectedDate.getTime() / 1000),
                date = CLI.Date.parse(stamp.toString(), 'timestamp');

            assert.deepEqual(date, expectedDate);

        });

        // {{{ using separators

        describe("using separators", function() {

            it("should work with hyphen separators", function() {

                var date = CLI.Date.parse('2010-03-04', 'Y-m-d'),
                    expectedDate = new Date();

                expectedDate.setFullYear(2010);
                expectedDate.setMonth(2);
                expectedDate.setDate(4);
                expectedDate.setHours(0);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);

                assert.deepEqual(date, expectedDate);

            });

            it("should work with slash separators", function() {

                var date = CLI.Date.parse('2010/03/04', 'Y/m/d'),
                    expectedDate = new Date();

                expectedDate.setFullYear(2010);
                expectedDate.setMonth(2);
                expectedDate.setDate(4);
                expectedDate.setHours(0);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);

                assert.deepEqual(date, expectedDate);

            });

            it("should work with space separators", function() {

                var date = CLI.Date.parse('2010 03 04', 'Y m d'),
                    expectedDate = new Date();

                expectedDate.setFullYear(2010);
                expectedDate.setMonth(2);
                expectedDate.setDate(4);
                expectedDate.setHours(0);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);

                assert.deepEqual(date, expectedDate);

            });

        });

        // }}}
        // {{{ week/year

        describe("week/year", function() {

            var d;

            function expectDate(year, month, day) {
                assert.equal(d.getFullYear(), year);
                assert.equal(d.getMonth(), month);
                assert.equal(d.getDate(), day);
            }

            // {{{ first week of year

            describe("first week of year", function() {

                it("should return the correct date for 2013", function() {

                    d = CLI.Date.parse('01/2013', 'W/Y');
                    expectDate(2012, 11, 31);

                });

                it("should return the correct date for 2014", function() {

                    d = CLI.Date.parse('01/2014', 'W/Y');
                    expectDate(2013, 11, 30);

                });

                it("should return the correct date for 2015", function() {

                    d = CLI.Date.parse('01/2015', 'W/Y');
                    expectDate(2014, 11, 29);

                });

                it("should return the correct date for 2016", function() {

                    d = CLI.Date.parse('01/2016', 'W/Y');
                    expectDate(2016, 0, 4);

                });

            });

            it("should always be a Monday", function() {

                var i, j;

                for (i = 2012; i <= 2020; ++i) {
                    for (j = 1; j < 53; ++j) {
                        assert.deepEqual(CLI.Date.parse(i + '-' + CLI.String.leftPad(j, 2, '0'), 'Y-W').getDay(), 1);
                    }
                }

            });

            // }}}

        });

        // }}}

    });

    // }}}
    // {{{ isEqual

    describe("isEqual", function() {

        it("should return true if both dates are exactly the same", function() {

            var date1 = new Date(2011, 0, 20, 18, 37, 15, 0),
                date2 = new Date(2011, 0, 20, 18, 37, 15, 0);

            assert.equal(CLI.Date.isEqual(date1, date2), true);

        });

        it("should return true if there is at least 1 millisecond difference between both dates", function() {

            var date1 = new Date(2011, 0, 20, 18, 37, 15, 0),
                date2 = new Date(2011, 0, 20, 18, 37, 15, 1);

            assert.equal(CLI.Date.isEqual(date1, date2), false);

        });

        it("should return false if one one of the dates is null/undefined", function() {

            assert.equal(CLI.Date.isEqual(new Date(), undefined), false);
            assert.equal(CLI.Date.isEqual(new Date(), null), false);
            assert.equal(CLI.Date.isEqual(undefined, new Date()), false);
            assert.equal(CLI.Date.isEqual(null, new Date()), false);

        });

        it("should return true if both dates are null/undefined", function() {

            assert.equal(CLI.Date.isEqual(null, null), true);
            assert.equal(CLI.Date.isEqual(null, undefined), true);
            assert.equal(CLI.Date.isEqual(undefined, null), true);
            assert.equal(CLI.Date.isEqual(undefined, undefined), true);

        });

    });

    // }}}
    // {{{ getDayOfYear

    describe("getDayOfYear", function() {

        it("should return the day of year between 0 and 364 for non-leap years", function() {

            assert.equal(CLI.Date.getDayOfYear(new Date(2001, 0, 1)), 0);
            assert.equal(CLI.Date.getDayOfYear(new Date(2001, 11, 31)), 364);

        });

        it("should return the day of year between 0 and 365 for leap years", function() {

            assert.equal(CLI.Date.getDayOfYear(new Date(2000, 0, 1)), 0);
            assert.equal(CLI.Date.getDayOfYear(new Date(2000, 11, 31)), 365);

        });

    });

    // }}}
    // {{{ getFirstDayOfMonth

    describe("getFirstDayOfMonth", function() {

        it("should return the number [0-6] of the first day of month of the given date", function() {

            assert.equal(CLI.Date.getFirstDayOfMonth(new Date(2007, 0, 1)), 1);
            assert.equal(CLI.Date.getFirstDayOfMonth(new Date(2000, 0, 2)), 6);
            assert.equal(CLI.Date.getFirstDayOfMonth(new Date(2011, 0, 3)), 6);
            assert.equal(CLI.Date.getFirstDayOfMonth(new Date(2011, 6, 4)), 5);
            assert.equal(CLI.Date.getFirstDayOfMonth(new Date(2011, 11, 5)), 4);

        });

    });

    // }}}
    // {{{ getLastDayOfMonth

    describe("getLastDayOfMonth", function() {

        it("should return the number [0-6] of the last day of month of the given date", function() {

            assert.equal(CLI.Date.getLastDayOfMonth(new Date(2007, 0, 1)), 3);
            assert.equal(CLI.Date.getLastDayOfMonth(new Date(2000, 0, 2)), 1);
            assert.equal(CLI.Date.getLastDayOfMonth(new Date(2011, 0, 3)), 1);
            assert.equal(CLI.Date.getLastDayOfMonth(new Date(2011, 6, 4)), 0);
            assert.equal(CLI.Date.getLastDayOfMonth(new Date(2011, 11, 5)), 6);

        });

    });

    // }}}
    // {{{ getFirstDateOfMonth

    describe("getFirstDateOfMonth", function() {

        it("should return the date corresponding to the first day of month of the given date", function() {

            assert.deepEqual(CLI.Date.getFirstDateOfMonth(new Date(2007, 0, 1)), new Date(2007, 0, 1));
            assert.deepEqual(CLI.Date.getFirstDateOfMonth(new Date(2000, 0, 2)), new Date(2000, 0, 1));
            assert.deepEqual(CLI.Date.getFirstDateOfMonth(new Date(2011, 0, 3)), new Date(2011, 0, 1));
            assert.deepEqual(CLI.Date.getFirstDateOfMonth(new Date(2011, 6, 4)), new Date(2011, 6, 1));
            assert.deepEqual(CLI.Date.getFirstDateOfMonth(new Date(2011, 11, 5)), new Date(2011, 11, 1));

        });

    });

    // }}}
    // {{{ getLastDateOfMonth

    describe("getLastDateOfMonth", function() {

        it("should return the date corresponding to the last day of month of the given date", function() {

            assert.deepEqual(CLI.Date.getLastDateOfMonth(new Date(2007, 1, 1)), new Date(2007, 1, 28));
            assert.deepEqual(CLI.Date.getLastDateOfMonth(new Date(2000, 1, 2)), new Date(2000, 1, 29));
            assert.deepEqual(CLI.Date.getLastDateOfMonth(new Date(2011, 0, 3)), new Date(2011, 0, 31));
            assert.deepEqual(CLI.Date.getLastDateOfMonth(new Date(2011, 5, 4)), new Date(2011, 5, 30));
            assert.deepEqual(CLI.Date.getLastDateOfMonth(new Date(2011, 11, 5)), new Date(2011, 11, 31));

        });

    });

    // }}}
    // {{{ getSuffix

    describe("getSuffix", function() {

        it("should return st for 1, 21 and 31", function() {

            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 1)), "st");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 21)), "st");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 31)), "st");

        });

        it("should return nd for 2 and, 22", function() {

            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 2)), "nd");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 22)), "nd");

        });

        it("should return rd for 3 and, 23", function() {

            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 3)), "rd");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 23)), "rd");

        });

        it("should return th for days [11-13] and days ending in [4-0]", function() {

            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 4)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 5)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 6)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 7)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 8)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 9)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 10)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 11)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 12)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 13)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 14)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 15)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 16)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 17)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 18)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 19)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 20)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 24)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 25)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 26)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 27)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 28)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 29)), "th");
            assert.equal(CLI.Date.getSuffix(new Date(2011, 0, 30)), "th");

        });

    });

    // }}}
    // {{{ clone

    describe("clone", function() {

        it("should return a copy of the given date", function() {

            var originalDate = new Date(),
                clonedDate;

            clonedDate = CLI.Date.clone(originalDate);

            assert.notEqual(clonedDate, originalDate);
            assert.deepEqual(clonedDate, originalDate);
        });

    });

    // }}}
    // {{{ isDST

    describe("isDST", function() {

        // DST detection relies on the locale of the browser running the test as different countries having different
        // versions of DST. Most countries don't observe it at all. Europe has standardized dates for switching times
        // but it differs from the dates used in the USA and Canada.
        //
        // These tests are quite loose but should pass in Europe and North America. Other countries may vary.
        //
        // Early March - USA & Canada enter DST
        // Late March - EU enters DST
        // Late October - EU leaves DST
        // Early November - USA & Canada leave DST

        // This test is disabled because it fails on the Eye but it should pass on most developer machines
        xit("should return true from the end of March till the middle of October", function() {

            assert.equal(CLI.Date.isDST(new Date(2010, 2, 31)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 3, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 4, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 5, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 6, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 7, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 8, 15)), true);
            assert.equal(CLI.Date.isDST(new Date(2010, 9, 15)), true);

        });

        it("should return false from the middle of November till the start of March", function() {

            assert.equal(CLI.Date.isDST(new Date(2010, 10, 15)), false);
            assert.equal(CLI.Date.isDST(new Date(2010, 11, 15)), false);
            assert.equal(CLI.Date.isDST(new Date(2010, 0, 15)), false);
            assert.equal(CLI.Date.isDST(new Date(2010, 1, 15)), false);
            assert.equal(CLI.Date.isDST(new Date(2010, 2, 1)), false);

        });

    });

    // }}}
    // {{{ clearTime

    describe("clearTime", function() {

        it("should reset hrs/mins/secs/millis to 0", function() {

            var date = new Date(2012, 11, 21, 21, 21, 21, 21);

            CLI.Date.clearTime(date);

            assert.equal(date.getHours(), 0);
            assert.equal(date.getMinutes(), 0);
            assert.equal(date.getSeconds(), 0);
            assert.equal(date.getMilliseconds(), 0);

        });

        it("should return a clone with hrs/mins/secs/millis reseted to 0 when clone option is selected", function() {

            var date = new Date(2012, 11, 21, 21, 21, 21, 21),

            clearedTimeDate;
            clearedTimeDate = CLI.Date.clearTime(date, true);

            assert.equal(date.getHours(), 21);
            assert.equal(date.getMinutes(), 21);
            assert.equal(date.getSeconds(), 21);
            assert.equal(date.getMilliseconds(), 21);
            assert.equal(clearedTimeDate.getHours(), 0);
            assert.equal(clearedTimeDate.getMinutes(), 0);
            assert.equal(clearedTimeDate.getSeconds(), 0);
            assert.equal(clearedTimeDate.getMilliseconds(), 0);

        });

    });

    // }}}
    // {{{ add

    describe("add", function() {

        var date = new Date(2000, 0, 1, 0, 0, 0, 0);

        it("should add milliseconds", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.MILLI, 1), new Date(2000, 0, 1, 0, 0, 0, 1));

        });

        it("should add seconds", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.SECOND, 1), new Date(2000, 0, 1, 0, 0, 1, 0));

        });

        it("should add minutes", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.MINUTE, 1), new Date(2000, 0, 1, 0, 1, 0, 0));

        });

        it("should add hours", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.HOUR, 1), new Date(2000, 0, 1, 1, 0, 0, 0));

        });

        it("should add days", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.DAY, 1), new Date(2000, 0, 2, 0, 0, 0, 0));

        });

        it("should add months", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.MONTH, 1), new Date(2000, 1, 1, 0, 0, 0, 0));

        });

        it("should add years", function() {

            assert.deepEqual(CLI.Date.add(date, CLI.Date.YEAR, 1), new Date(2001, 0, 1, 0, 0, 0, 0));

        });

        it("should consider last day of month when adding months", function() {

            assert.deepEqual(CLI.Date.add(new Date(2001, 0, 29), CLI.Date.MONTH, 1), new Date(2001, 1, 28));
            assert.deepEqual(CLI.Date.add(new Date(2001, 0, 30), CLI.Date.MONTH, 1), new Date(2001, 1, 28));
            assert.deepEqual(CLI.Date.add(new Date(2001, 0, 31), CLI.Date.MONTH, 1), new Date(2001, 1, 28));
            assert.deepEqual(CLI.Date.add(new Date(2000, 0, 29), CLI.Date.MONTH, 1), new Date(2000, 1, 29));
            assert.deepEqual(CLI.Date.add(new Date(2000, 0, 30), CLI.Date.MONTH, 1), new Date(2000, 1, 29));
            assert.deepEqual(CLI.Date.add(new Date(2000, 0, 31), CLI.Date.MONTH, 1), new Date(2000, 1, 29));

        });

        it("should consider last day of month when adding years", function() {

            assert.deepEqual(CLI.Date.add(new Date(2000, 1, 29), CLI.Date.YEAR, 1), new Date(2001, 1, 28));

        });

    });

    // }}}
    // {{{ between

    describe("between", function() {

        var startDate = new Date(2000, 0, 1),
            endDate = new Date(2000, 0, 31);

        it("should return true if the date is equal to the start date", function() {

            assert.equal(CLI.Date.between(new Date(2000, 0, 1), startDate, endDate), true);

        });

        it("should return true if the date is equal to the end date", function() {

            assert.equal(CLI.Date.between(new Date(2000, 0, 31), startDate, endDate), true);

        });

        it("should return true if date is between start and end dates", function() {

            assert.equal(CLI.Date.between(new Date(2000, 0, 15), startDate, endDate), true);

        });

        it("should return false if date is before start date", function() {

            assert.equal(CLI.Date.between(new Date(1999, 11, 31, 23, 59, 59), startDate, endDate), false);

        });

        it("should return false if date is after end date", function() {

            assert.equal(CLI.Date.between(new Date(2000, 0, 31, 0, 0, 1), startDate, endDate), false);

        });

    });

    // }}}
    // {{{ formatting

    describe("formatting", function() {

        var date = new Date(2010, 0, 1, 13, 45, 32, 4),
            format = CLI.Date.format;

        it("should format with the d option", function() {

            assert.equal(format(date, 'd'), '01');

        });

        it("should format with the D option", function() {

            assert.equal(format(date, 'D'), 'Fri');

        });

        it("should format with the j option", function() {

            assert.equal(format(date, 'j'), '1');

        });

        it("should format with the l option", function() {

            assert.equal(format(date, 'l'), 'Friday');

        });

        it("should format with the N option", function() {

            assert.equal(format(date, 'N'), '5');

        });

        it("should format with the S option", function() {

            assert.equal(format(date, 'S'), 'st');

        });

        it("should format with the w option", function() {

            assert.equal(format(date, 'w'), '5');

        });

        it("should format with the z option", function() {

            assert.equal(format(date, 'z'), '0');

        });

        it("should format with the W option", function() {

            assert.equal(format(date, 'W'), '53');

        });

        it("should format with the F option", function() {

            assert.equal(format(date, 'F'), 'January');

        });

        it("should format with the m option", function() {

            assert.equal(format(date, 'm'), '01');

        });

        it("should format with the M option", function() {

            assert.equal(format(date, 'M'), 'Jan');

        });

        it("should format with the n option", function() {

            assert.equal(format(date, 'n'), '1');

        });

        it("should format with the t option", function() {

            assert.equal(format(date, 't'), '31');

        });

        it("should format with the L option", function() {

            assert.equal(format(date, 'L'), '0');

        });

        it("should format with the o option", function() {

            assert.equal(format(date, 'o'), '2009');

        });

        it("should format with the Y option", function() {

            assert.equal(format(date, 'Y'), '2010');

        });

        it("should format with the y option", function() {

            assert.equal(format(date, 'y'), '10');

        });

        it("should format with the a option", function() {

            assert.equal(format(date, 'a'), 'pm');

        });

        it("should format with the A option", function() {

            assert.equal(format(date, 'A'), 'PM');

        });

        it("should format with the g option", function() {

            assert.equal(format(date, 'g'), '1');

        });

        it("should format with the G option", function() {

            assert.equal(format(date, 'G'), '13');

        });

        it("should format with the h option", function() {

            assert.equal(format(date, 'h'), '01');

        });

        it("should format with the H option", function() {

            assert.equal(format(date, 'H'), '13');

        });

        it("should format with the i option", function() {

            assert.equal(format(date, 'i'), '45');

        });

        it("should format with the s option", function() {

            assert.equal(format(date, 's'), '32');

        });

        it("should format with the u option", function() {

            assert.equal(format(date, 'u'), '004');

        });

        // can't be static, relies on TZ
        it("should format with the O option", function() {

            var value = CLI.Date.getGMTOffset(date, false);

            assert.equal(format(date, 'O'), value);

        });

        // can't be static, relies on TZ
        it("should format with the P option", function() {

            var value = CLI.Date.getGMTOffset(date, true);

            assert.equal(format(date, 'P'), value);

        });

        // can't be static, relies on TZ
        it("should format with the T option", function() {

            var value = CLI.Date.getTimezone(date);

            assert.equal(format(date, 'T'), value);

        });

        // can't be static, relies on TZ
        it("should format with the Z option", function() {

            var value = (date.getTimezoneOffset() * -60) + '';

            assert.equal(format(date, 'Z'), value);

        });

        // can't be static, relies on TZ
        it("should format with the c option", function() {

            var value = '2010-01-01T13:45:32' + CLI.Date.getGMTOffset(date, true);

            assert.equal(format(date, 'c'), value);

        });

        it("should format with the U option", function() {

            var value = Math.round((date.getTime() / 1000)) + '';

            assert.equal(format(date, 'U'), value);

        });

        it("should format with the MS option", function() {

            var value = '\\/Date(' + date.getTime() + ')\\/';

            assert.equal(format(date, 'MS'), value);

        });

        it("should format the time option", function() {

            // Can't use a static date because the timezone of the
            // local machine will change the result
            var value = date.getTime().toString();

            assert.equal(format(date, 'time'), value);

        });

        it("should format the timestamp option", function() {

            // Can't use a static date because the timezone of the
            // local machine will change the result
            var stamp = Math.floor(date.getTime() / 1000),
                value = stamp.toString();

            assert.equal(format(date, 'timestamp'), value);

        });

        it("should return an empty string", function() {

            assert.equal(format(undefined, 'd'), '');
            assert.equal(format(null, 'd'), '');
            assert.equal(format({}, 'd'), '');
            assert.equal(format([], 'd'), '');
            assert.equal(format('', 'd'), '');
            assert.equal(format(true, 'd'), '');
            assert.equal(format(1992, 'd'), '');

        });

        it("should not return an empty string", function() {

            assert.notEqual(format(new Date(), 'd'), '');

        });

    });

    // }}}
    // {{{ ISO-8601


    describe("ISO-8601", function () {

        var CLIDate = CLI.Date;

        // {{{ dates

        describe("dates", function () {

            // {{{ W - week

            describe("W - week", function () {

                it("should parse with the W option", function () {

                    assert.notEqual(CLIDate.parse('40', 'W'), undefined);

                });

                it("should only parse weeks 1 - 9 when prefixed by a zero (0)", function () {

                    assert.notEqual(CLIDate.parse('01', 'W'), undefined);

                });

                it("should not parse weeks 1 - 9 when not prefixed by a zero (0)", function () {

                    assert.equal(CLIDate.parse('1', 'W'), undefined);

                });

                it("should start with Monday", function () {

                    // getDay() ... Monday === 1
                    assert.equal(CLIDate.parse('01', 'W').getDay(), 1);

                });

            });

            // }}}
            // {{{ o - year

            describe("o - year", function () {

                it("should parse with the o option", function () {

                    assert.notEqual(CLIDate.parse('2012', 'o'), undefined);

                });

                it("should behave the same as Y when not parsed with another option", function() {

                    assert.equal(CLIDate.parse('2012', 'o').getTime(), CLIDate.parse('2012', 'Y').getTime());

                });

            });

            // }}}
            // {{{ can be part of year not same as the 'o' parse code

            describe("can be part of year not same as the 'o' parse code", function () {

                it("should be the previous year than 'o' parse code", function () {

                    assert.equal(CLIDate.parse('2008-01', 'o-W').getFullYear(), 2007);

                });

                it("should set the same year if required", function () {

                    assert.equal(CLIDate.parse('2009-53', 'o-W').getFullYear(), 2009);

                });

            });

            // }}}

        });

        // }}}
        // {{{ times

        describe("times", function () {

            it("should correctly parse ISO format", function() {

                var date = CLI.Date.parse('2012-01-13T01:00:00', 'c'),
                    expectedDate = new Date();

                expectedDate.setFullYear(2012);
                expectedDate.setMonth(0);
                expectedDate.setDate(13);
                expectedDate.setHours(1);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);
                assert.deepEqual(date, expectedDate);

                date = CLI.Date.parse('2012-01-13T13:00:00', 'c');

                expectedDate.setFullYear(2012);
                expectedDate.setMonth(0);
                expectedDate.setDate(13);
                expectedDate.setHours(13);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);
                assert.deepEqual(date, expectedDate);

            });

            // {{{ time zones

            describe("time zones", function() {

                it("should evaluate as equal dates with the same time zone", function() {

                    var date, expectedDate;

                    date = CLI.Date.parse("2012-10-03T20:29:24+12:00", "c");

                    expectedDate = new Date("2012-10-03T20:29:24+12:00");

                    assert.equal(expectedDate.getTime(), date.getTime());

                });

                it("should evaluate as equal dates with different time zones", function() {

                    // NOTE one hour difference between these times.
                    var date, expectedDate,
                        oneHourInMs = 1000 * 60 * 60; // 3,600,000

                    date = CLI.Date.parse("2012-10-03T20:29:24+12:00", "c");

                    expectedDate = new Date("2012-10-03T20:29:24+13:00");

                    assert.equal(expectedDate.getTime() + oneHourInMs, date.getTime());

                });

                it("should evaluate as not equal dates with different time zones", function() {

                    var date = CLI.Date.parse("2012-10-03T20:29:24+12:00", "c"),
                        expectedDate = new Date("2012-10-03T20:29:24+13:00");

                    assert.notEqual(expectedDate.getTime(), date.getTime());

                });

            });

            // }}}

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
