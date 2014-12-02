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
// {{{ CLI.Version

describe("CLI.Version", function() {

    var version = new CLI.Version("1.2.3beta");

    // {{{ toString

    describe("toString", function() {

        it("should cast to string", function() {

            assert.equal(version+"", "1.2.3beta");

        });

    });

    // }}}
    // {{{ getMajor

    describe("getMajor", function() {

        it("should return 1", function() {

            assert.equal(version.getMajor(), 1);

        });

    });

    // }}}
    // {{{ getMinor

    describe("getMinor", function() {

        it("should return 2", function() {

            assert.equal(version.getMinor(), 2);

        });

    });

    // }}}
    // {{{ getPatch

    describe("getPatch", function() {

        it("should return 3", function() {

            assert.equal(version.getPatch(), 3);

        });

    });

    // }}}
    // {{{ getBuild

    describe("getBuild", function() {

        it("should return 0", function() {

            assert.equal(version.getBuild(), 0);

        });

    });

    // }}}
    // {{{ getRelease

    describe("getRelease", function() {

        it("should return beta", function() {

            assert.equal(version.getRelease(), "beta");

        });

    });

    // }}}
    // {{{ getShortVersion

    describe("getShortVersion", function() {

        it("should return 123", function() {

            assert.equal(version.getShortVersion(), "123");

        });

    });

    // }}}
    // {{{ toArray

    describe("toArray", function() {

        it("should return [1, 2, 3, 0, 'beta']", function() {

            assert.deepEqual(version.toArray(), [1, 2, 3, 0, 'beta']);

        });

    });

    // }}}
    // {{{ isGreaterThan

    describe("isGreaterThan", function() {

        it("should be greater than 1.2.3alpha", function() {

            assert.equal(version.isGreaterThan("1.2.3alpha"), true);

        });

        it("should not be greater than 1.2.3RC", function() {

            assert.equal(version.isGreaterThan("1.2.3RC"), false);

        });

    });

    // }}}
    // {{{ isLessThan

    describe("isLessThan", function() {

        it("should not be smaller than 1.2.3alpha", function() {

            assert.equal(version.isLessThan("1.2.3alpha"), false);

        });

        it("should be smaller than 1.2.3RC", function() {

            assert.equal(version.isLessThan("1.2.3RC"), true);

        });

    });

    // }}}
    // {{{ equals

    describe("equals", function() {

        it("should equals 1.2.3beta", function() {

            assert.equal(version.equals("1.2.3beta"), true);

        });

    });

    // }}}
    // {{{ compareTo

    describe("compareTo", function () {

        function compareTo(v1, v2, expected) {

            var v = new CLI.Version(v1);
            var c = v.compareTo(v2);

            if (c !== expected) {

                // give a better failure message than "expected 1 to be 0":
                assert.equal('new Version('+v1+').compareTo('+v2+') == ' + c, expected);

            } else {

                assert.equal(c, expected);

            }
        }

        // {{{ Zero padding vs

        describe("Zero padding vs", function () {

            // {{{ Upper bound

            describe("Upper bound", function () {

                it('should be less than', function () {
                    compareTo('2.3', '^2.3.0', -1);
                    compareTo('2.3', '^2.3', -1);
                    compareTo('2.3', '^2', -1);
                });

                it('should be greater than', function () {
                    compareTo('2.3', '^2.2', 1);
                    compareTo('2.3', '^1', 1);
                });

            });

            // }}}
            // {{{ Prefix match

            describe("Prefix match", function () {

                it('should be less than', function () {
                    compareTo('2.3', '~2.3.1', -1);
                    compareTo('2.3', '~2.4', -1);
                    compareTo('2.3', '~3', -1);
                });

                it('should be equal', function () {
                    compareTo('2.3', '~2', 0);
                    compareTo('2.3', '~2.3', 0);
                    compareTo('2.3', '~2.3.0', 0);
                });

                it('should be greater than', function () {
                    compareTo('2.3', '~2.2', 1);
                    compareTo('2.3', '~1', 1);
                });

            });

            // }}}

        });

        // }}}
        // {{{ Upper bound vs

        describe("Upper bound vs", function () {

            // {{{ Zero padding

            describe("Zero padding", function () {

                it('should be less than', function () {
                    compareTo('^2.3', '2.4', -1);
                    compareTo('^2.3', '3', -1);
                });

                it('should be greater than', function () {
                    compareTo('^2.3', '1', 1);
                    compareTo('^2.3', '2', 1);
                    compareTo('^2.3', '2.3', 1);
                    compareTo('^2.3', '2.2', 1);
                    compareTo('^2.3', '2.3.9', 1);
                });

            });

            // }}}
            // {{{ Upper bound

            describe("Upper bound", function () {

                it('should be less than', function () {
                    compareTo('^2.3', '^2.4', -1);
                    compareTo('^2.3', '^3', -1);
                });

                it('should be equal', function () {
                    compareTo('^2.3', '^2.3', 0);
                });

                it('should be greater than', function () {
                    compareTo('^2.3', '^2.2', 1);
                    compareTo('^2.3', '^1', 1);
                });

            });

            // }}}
            // {{{ Prefix match

            describe("Prefix match", function () {

                it('should be less than', function () {
                    compareTo('^2.3', '~2.4', -1);
                    compareTo('^2.3', '~3', -1);
                });

                it('should be equal', function () {
                    compareTo('^2.3', '~2.3', 0);
                    compareTo('^2.3', '~2', 0);
                });

                it('should be greater than', function () {
                    compareTo('^2.3', '~2.2', 1);
                    compareTo('^2.3', '~1', 1);
                });

            });

            // }}}

        }); // Upper bound

        // }}}
        // {{{ Prefix match vs

        describe("Prefix match vs", function () {

            // {{{ Zero padding

            describe("Zero padding", function () {

                it('should be less than', function () {
                    compareTo('~2.3', '2.4', -1);
                    compareTo('~2.3', '3', -1);
                });

                it('should be equal', function () {
                    compareTo('~2.3', '2.3.4.5', 0);
                    compareTo('~2.3', '2.3.4', 0);
                    compareTo('~2.3', '2.3', 0);
                });

                it('should be greater than', function () {
                    compareTo('~2.3', '2.2', 1);
                    compareTo('~2.3', '2', 1);
                    compareTo('~2.3', '1', 1);
                });

            });

            // }}}
            // {{{ Upper bound

            describe("Upper bound", function () {

                it('should be less than', function () {
                    compareTo('~2.3', '^2.4', -1);
                    compareTo('~2.3', '^2', -1);
                });

                it('should be equal', function () {
                    compareTo('~2.3', '^2.3.4', 0);
                    compareTo('~2.3', '^2.3', 0);
                });

                it('should be greater than', function () {
                    compareTo('~2.3', '^2.2', 1);
                    compareTo('~2.3', '^2.1', 1);
                    compareTo('~2.3', '^1', 1);
                });

            });

            // }}}
            // {{{ Prefix match

            describe("Prefix match", function () {

                it('should be less than', function () {
                    compareTo('~2.3', '~2.4', -1);
                    compareTo('~2.3', '~3', -1);
                });

                it('should be equal', function () {
                    compareTo('~2.3', '~2.3.4', 0);
                    compareTo('~2.3', '~2.3', 0);
                    compareTo('~2.3', '~2', 0);
                });

                it('should be greater than', function () {
                    compareTo('~2.3', '~2.2', 1);
                    compareTo('~2.3', '~1', 1);
                });

            });

            // }}}

        }); // Prefix match

        // }}}

    }); // compareTo

    // }}}
    // {{{ match

    describe("match", function() {

        it("should match integer 1", function() {

            assert.equal(version.match(1), true);

        });

        it("should match float 1.2", function() {

            assert.equal(version.match(1.2), true);

        });

        it("should match string 1.2.3", function() {

            assert.equal(version.match("1.2.3"), true);

        });

        it("should not match string 1.2.3alpha", function() {

            assert.equal(version.match("1.2.3alpha"), false);

        });

    });

    // }}}
    // {{{ setVersion

    describe("setVersion", function() {

        it("should return an instance of CLI.Version", function() {

            CLI.setVersion("test", "1.0.1");

            assert.equal(CLI.getVersion("test") instanceof CLI.Version, true);

        });

    });

    // }}}
    // {{{ statics

    describe("statics", function() {

        // {{{ getComponentValue

        describe("getComponentValue", function() {

            it("should return 0", function() {

                assert.equal(CLI.Version.getComponentValue(undefined), 0);
            });

            it("should return -2", function() {

                assert.equal(CLI.Version.getComponentValue(-2), -2);

            });

            it("should return 2", function() {

                assert.equal(CLI.Version.getComponentValue("2"), 2);
            });

            it("should return -5", function() {

                assert.equal(CLI.Version.getComponentValue("alpha"), -5);
            });

            it("should return unknown", function() {

                assert.equal(CLI.Version.getComponentValue("unknown"), "unknown");

            });

        });

        // }}}
        // {{{ compare

        describe("compare", function() {

            it("should return 1", function() {

                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.2"), 1);
                assert.equal(CLI.Version.compare("1.2.3beta", 1), 1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3dev"), 1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3alpha"), 1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3a"), 1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3alpha"), 1);

            });

            it("should return -1", function() {

                assert.equal(CLI.Version.compare("1.2.3beta", 2), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.4"), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3RC"), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3rc"), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3#"), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3pl"), -1);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3p"), -1);

            });

            it("should return 0", function() {

                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3b"), 0);
                assert.equal(CLI.Version.compare("1.2.3beta", "1.2.3beta"), 0);

            });

        });

        // }}}

    });

    // }}}
    // {{{ checkVersion

    describe('checkVersion', function () {

        var oldVers = CLI.versions,
            versions1 = {
                // we specify full versions here because this is what Cmd will generate
                // for us *and* we need to be sure our checks properly match on prefix:
                //
                ext: new CLI.Version('4.2.2.900'), // <== this is used for unnamed versions
                foo: new CLI.Version('3.0.2.123'),
                bar: new CLI.Version('1.5'), // special case here
                jazz: new CLI.Version('5.2.2.456')
            };

        afterEach(function () {
            CLI.versions = oldVers;
        });

        beforeEach(function () {
            CLI.versions = versions1;
        });

        // {{{ Default package

        describe('Default package', function () {

            // {{{ simple versions check

            describe('simple versions check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion('4.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion('4.2.1');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ simple version range check

            describe('simple version range check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion('4.2.0-4.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion('3.4-4.2.1');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ no lower bound version range check

            describe('no lower bound version range check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion(' - 4.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion(' -4.2.1');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ no upper bound version range check

            describe('no upper bound version range check', function () {

                it('should handle match using "-"', function () {

                    var result = CLI.checkVersion('4.2.0 -');

                    assert.equal(result, true);
                });

                it('should handle match using "+"', function () {

                    var result = CLI.checkVersion('4.2.0 + ');

                    assert.equal(result, true);

                });

                it('should handle mismatch using "-"', function () {

                    var result = CLI.checkVersion('4.4-');

                    assert.equal(result, false);

                });

                it('should handle mismatch using "+"', function () {

                    var result = CLI.checkVersion('4.4+');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ matchAny compound version check

            describe('matchAny compound version check', function () {

                it('should find matching version', function () {

                    var result = CLI.checkVersion(['4.2.1', '4.2.2']);

                    assert.equal(result, true);

                });

                it('should find matching version in range', function () {

                    var result = CLI.checkVersion(['4.2.0', '4.2.1 - 4.3']);

                    assert.equal(result, true);

                });

                it('should find mismatching version', function () {

                    var result = CLI.checkVersion(['4.2.1', '4.2.3']);

                    assert.equal(result, false);

                });

                it('should find mismatching version not in range', function () {

                    var result = CLI.checkVersion(['4.2.1', '4.2.3 - 4.5']);

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ matchAll compound version check

            describe('matchAll compound version check', function () {

                it('should find matching version', function () {

                    var result = CLI.checkVersion(['4.2.2', '4.2.2'], true);

                    assert.equal(result, true);

                });

                it('should find matching version in range', function () {

                    var result = CLI.checkVersion(['4.2.2', '4.2.1 - 4.3'], true);

                    assert.equal(result, true);

                });

                it('should find mismatching version', function () {

                    var result = CLI.checkVersion(['4.2.2', '4.2.3'], true);

                    assert.equal(result, false);

                });

                it('should find mismatching version not in range', function () {

                    var result = CLI.checkVersion(['4.2.2', '4.2.3 - 4.5'], true);

                    assert.equal(result, false);

                });

            });

            // }}}

        }); // Default package

        // }}}
        // {{{ Named package

        describe('Named package', function () {

            // {{{ simple versions check

            describe('simple versions check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion('jazz@5.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion('jazz @ 5.2.1');

                    assert.equal(result, false);

                });

                it('should handle mismatch on unknown package', function () {

                    var result = CLI.checkVersion('zip@1.2');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ simple version range check

            describe('simple version range check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion('jazz @5.2.0 -5.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion('jazz@3.4-5.2.1');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ no lower bound version range check

            describe('no lower bound version range check', function () {

                it('should handle match', function () {

                    var result = CLI.checkVersion('jazz@-5.2.2');

                    assert.equal(result, true);

                });

                it('should handle mismatch', function () {

                    var result = CLI.checkVersion('jazz@-5.2.1');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ no upper bound version range check

            describe('no upper bound version range check', function () {

                it('should handle match using "-"', function () {

                    var result = CLI.checkVersion('jazz@5.2.0-');

                    assert.equal(result, true);

                });

                it('should handle match using "+"', function () {

                    var result = CLI.checkVersion('jazz@5.2.0+');

                    assert.equal(result, true);

                });

                it('should handle mismatch using "-"', function () {

                    var result = CLI.checkVersion('jazz@5.4-');

                    assert.equal(result, false);

                });

                it('should handle mismatch using "+"', function () {

                    var result = CLI.checkVersion('jazz@5.4+');

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ matchAny compound version check

            describe('matchAny compound version check', function () {

                it('should find matching version', function () {

                    var result = CLI.checkVersion(['jazz@5.2.1', 'jazz@5.2.2']);

                    assert.equal(result, true);

                });

                it('should find matching version in range', function () {

                    var result = CLI.checkVersion(['jazz@5.2.0', 'jazz@5.2.1-5.3']);

                    assert.equal(result, true);

                });

                it('should find mismatching version', function () {

                    var result = CLI.checkVersion(['jazz@5.2.1', 'jazz@5.2.3']);

                    assert.equal(result, false);

                });

                it('should find mismatching version not in range', function () {

                    var result = CLI.checkVersion(['jazz@5.2.1', 'jazz@5.2.3-5.5']);

                    assert.equal(result, false);

                });

            });

            // }}}
            // {{{ matchAll compound version check

            describe('matchAll compound version check', function () {

                it('should find matching version', function () {

                    var result = CLI.checkVersion(['jazz@5.2.2', 'jazz@5.2.2'], true);

                    assert.equal(result, true);

                });

                it('should find matching version in range', function () {

                    var result = CLI.checkVersion(['jazz@5.2.2', 'jazz@5.2.1-5.3'], true);

                    assert.equal(result, true);

                });

                it('should find mismatching version', function () {

                    var result = CLI.checkVersion(['jazz@5.2.2', 'jazz@5.2.3'], true);

                    assert.equal(result, false);

                });

                it('should find mismatching version not in range', function () {

                    var result = CLI.checkVersion(['jazz@5.2.2', 'jazz@5.2.3-5.5'], true);

                    assert.equal(result, false);

                });

            });

            // }}}

        }); // Named package

        // }}}
        // {{{ Multiple packages

        describe('Multiple packages', function () {

            // {{{ matchAny

            describe('matchAny', function () {

                it('should find basic match', function () {

                    var result = CLI.checkVersion(['4.2.2', 'jazz@5.2.2']);

                    assert.equal(result, true);

                });

                it('should find AND match', function () {

                    var result = CLI.checkVersion({
                        and: ['4.2.2', 'jazz@5.2.2']
                    });

                    assert.equal(result, true);

                });

            });

            // }}}
            // {{{ matchAll

            describe('matchAll', function () {

                it('should find basic match', function () {

                    var result = CLI.checkVersion(['4.2.2', 'jazz@5.2.2'], true);

                    assert.equal(result, true);

                });

            });

        }); // Multiple packages

        // }}}
        // {{{ Complex criteria

        describe('Complex criteria', function () {

            it('should find basic "and" match', function () {

                var result = CLI.checkVersion({
                    and: [
                        '4.2.2', // T
                        'jazz@5.2.2' // T
                    ]
                });

                assert.equal(result, true);

            });

            it('should find basic "and" match with "not"', function () {

                var result = CLI.checkVersion({
                    not: true,
                    and: [
                        '4.2.2', // T
                        'jazz@5.2.2' // T
                    ]
                });

                assert.equal(result, false);

            });

            it('should find basic "or" match', function () {

                var result = CLI.checkVersion({
                    or: [
                        '4.2.1', // F
                        'jazz@5.2.2' // T
                    ]
                }, true);

                assert.equal(result, true);

            });

            it('should find basic "or" match with "not"', function () {

                var result = CLI.checkVersion({
                    not: true,
                    or: [
                        '4.2.1', // F
                        'jazz@5.2.2' // T
                    ]
                }, true);

                assert.equal(result, false);

            });

            it('should handle nested matches', function () {

                //foo: new CLI.Version('3.0.2.123'),
                //bar: new CLI.Version('1.5'),
                //jazz: new CLI.Version('5.2.2.456')
                var result = CLI.checkVersion([
                    '4.2.1', // F
                    {
                        and: [
                            'jazz@5.2.2', // T
                            {
                                or: [
                                    'foo@3.2-4.1', // F
                                    'bar@1.2.2-2', // T
                                ]
                            },
                            'foo@2.2-3.0.1' // F
                        ]
                    },
                    {
                        or: [
                            'foo@3.2-4.1', // F
                            'bar@1.2.2-2', // T
                        ]
                    }
                ]);

                assert.equal(result, true);

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
