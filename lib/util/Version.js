/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

/**
 * @class CLI.Version
 *
 * A utility class that wraps around a version number string and provides convenient methods
 * to perform comparisons. A version number is expressed in the following general format:
 *
 *     major[.minor[.patch[.build[release]]]]
 * 
 * The `Version` instance holds various readonly properties that contain the digested form
 * of the version string. The numeric componnets of `major`, `minor`, `patch` and `build`
 * as well as the textual suffix called `release`.
 * 
 * Not depicted in the above syntax are three possible prefixes used to control partial
 * matching. These are '^' (the default), '>' and '~'. These are discussed below.
 *
 * Examples:
 *
 *     var version = new CLI.Version('1.0.2beta'); // or maybe "1.0" or "1.2.3.4RC"
 *     console.log("Version is " + version); // Version is 1.0.2beta
 *
 *     console.log(version.getMajor()); // 1
 *     console.log(version.getMinor()); // 0
 *     console.log(version.getPatch()); // 2
 *     console.log(version.getBuild()); // 0
 *     console.log(version.getRelease()); // beta
 *
 * The understood values of `release` are assigned numberic equivalents for the sake of
 * comparsion. The order of these from smallest to largest is as follows:
 *
 *  * `"dev"`
 *  * `"alpha"` or `"a"`
 *  * `"beta"` or `"b"`
 *  * `"RC"` or `"rc"`
 *  * `"#"`
 *  * `"pl"` or `"p"`
 *
 * Any other (unrecognized) suffix is consider greater than any of these.
 * 
 * ## Comparisons
 * There are two forms of comparison that are commonly needed: full and partial. Full
 * comparison is simpler and is also the default.
 * 
 * Example:
 *
 *     var version = new CLI.Version('1.0.2beta');
 *
 *     console.log(version.isGreaterThan('1.0.1')); // True
 *     console.log(version.isGreaterThan('1.0.2alpha')); // True
 *     console.log(version.isGreaterThan('1.0.2RC')); // False
 *     console.log(version.isGreaterThan('1.0.2')); // False
 *     console.log(version.isLessThan('1.0.2')); // True
 *
 *     console.log(version.match(1.0)); // True (using a Number)
 *     console.log(version.match('1.0.2')); // True (using a String)
 * 
 * These comparisons are ultimately implemented by {@link CLI.Version#compareTo compareTo}
 * which returns -1, 0 or 1 depending on whether the `Version' instance is less than, equal
 * to, or greater than the given "other" version.
 * 
 * For example:
 * 
 *      var n = version.compareTo('1.0.1');  // == 1  (because 1.0.2beta > 1.0.1)
 *      
 *      n = version.compareTo('1.1');  // == -1
 *      n = version.compareTo(version); // == 0
 * 
 * ### Partial Comparisons
 * By default, unspecified version number fields are filled with 0. In other words, the
 * version number fields are 0-padded on the right or a "lower bound". This produces the
 * most commonly used forms of comparsion:
 * 
 *      var ver = new Version('4.2');
 *
 *      n = ver.compareTo('4.2.1'); // == -1  (4.2 promotes to 4.2.0 and is less than 4.2.1)
 * 
 * There are two other ways to interpret comparisons of versions of different length. The
 * first of these is to change the padding on the right to be a large number (scuh as
 * Infinity) instead of 0. This has the effect of making the version an upper bound. For
 * example:
 * 
 *      var ver = new Version('^4.2'); // NOTE: the '^' prefix used
 *
 *      n = ver.compreTo('4.3'); // == -1  (less than 4.3)
 *      
 *      n = ver.compareTo('4.2'); // == 1   (greater than all 4.2's)
 *      n = ver.compareTo('4.2.1'); // == 1
 *      n = ver.compareTo('4.2.9'); // == 1
 * 
 * The second way to interpret this comparison is to ignore the extra digits, making the
 * match a prefix match. For example:
 * 
 *      var ver = new Version('~4.2'); // NOTE: the '~' prefix used
 *
 *      n = ver.compreTo('4.3'); // == -1
 *      
 *      n = ver.compareTo('4.2'); // == 0
 *      n = ver.compareTo('4.2.1'); // == 0
 * 
 * This final form can be useful when version numbers contain more components than are
 * important for certain comparisons. For example, the full version of CLI 4.2.1 is
 * "4.2.1.883" where 883 is the `build` number.
 * 
 * This is how to create a "partial" `Version` and compare versions to it:
 * 
 *      var version421ish = new Version('~4.2.1');
 *      
 *      n = version421ish.compareTo('4.2.1.883'); // == 0
 *      n = version421ish.compareTo('4.2.1.2'); // == 0
 *      n = version421ish.compareTo('4.2.1'); // == 0
 *
 *      n = version421ish.compareTo('4.2'); // == 1
 *
 * In the above example, '4.2.1.2' compares as equal to '4.2.1' because digits beyond the
 * given "4.2.1" are ignored. However, '4.2' is less than the '4.2.1' prefix; its missing
 * digit is filled with 0.
 */

(function() {

    "use strict";

    (function() {

        var checkVerTemp = [''],
            endOfVersionRe = /([^\d\.])/,
            notDigitsRe = /[^\d]/g,
            plusMinusRe = /[\-+]/g,
            stripRe = /\s/g,
            underscoreRe = /_/g,
            Version;

        CLI.Version = Version = function(version, defaultMode) {

            var me = this,
                padModes = me.padModes,
                ch, i, pad, parts, release, releaseStartIndex, ver;

            if (version.isVersion) {
                version = version.version;
            }

            me.version = ver = String(version).toLowerCase().replace(underscoreRe, '.').replace(plusMinusRe, '');

            ch = ver.charAt(0);

            if (ch in padModes) {

                ver = ver.substring(1);
                pad = padModes[ch];

            } else {

                pad = defaultMode ? padModes[defaultMode] : 0; // careful - NaN is falsey!

            }

            me.pad              = pad;
            releaseStartIndex   = ver.search(endOfVersionRe);
            me.shortVersion     = ver;

            if (releaseStartIndex !== -1) {

                me.release = release = ver.substr(releaseStartIndex, version.length);
                me.shortVersion = ver.substr(0, releaseStartIndex);
                release = Version.releaseValueMap[release] || release;

            }

            me.releaseValue = release || pad;
            me.shortVersion = me.shortVersion.replace(notDigitsRe, '');

            /**
             * @property {Number[]} parts
             * The split array of version number components found in the version string.
             * For example, for "1.2.3", this would be `[1, 2, 3]`.
             * @readonly
             * @private
             */
            me.parts = parts = ver.split('.');

            for (i = parts.length; i--; ) {

                parts[i] = parseInt(parts[i], 10);

            }

            if (pad === Infinity) {

                // have to add this to the end to create an upper bound:
                parts.push(pad);

            }

            /**
             * @property {Number} major
             * The first numeric part of the version number string.
             * @readonly
             */
            me.major = parts[0] || pad;

            /**
             * @property {Number} [minor]
             * The second numeric part of the version number string.
             * @readonly
             */
            me.minor = parts[1] || pad;

            /**
             * @property {Number} [patch]
             * The third numeric part of the version number string.
             * @readonly
             */
            me.patch = parts[2] || pad;

            /**
             * @property {Number} [build]
             * The fourth numeric part of the version number string.
             * @readonly
             */
            me.build = parts[3] || pad;

            return me;

        };

        Version.prototype = {

            // {{{ isVersion

            isVersion: true,

            // }}}
            // {{{ padModes

            padModes: {
                '~': NaN,
                '^': Infinity
            },

            // }}}
            // {{{ release

            /**
             * @property {String} [release=""]
             * The release level. The following values are understood:
             * 
             *  * `"dev"`
             *  * `"alpha"` or `"a"`
             *  * `"beta"` or `"b"`
             *  * `"RC"` or `"rc"`
             *  * `"#"`
             *  * `"pl"` or `"p"`
             * @readonly
             */
            release: '',

            // }}}
            // {{{ compareTo

            /**
             * Compares this version instance to the specified `other` version.
             *
             * @param {String/Number/CLI.Version} other The other version to which to compare.
             * @return {Number} -1 if this version is less than the target version, 1 if this
             * version is greater, and 0 if they are equal.
             */
            compareTo: function (other) {

                // "lhs" == "left-hand-side"
                // "rhs" == "right-hand-side"

                var me = this,
                    lhsPad = me.pad,
                    lhsParts = me.parts,
                    lhsLength = lhsParts.length,
                    rhsVersion = other.isVersion ? other : new Version(other),
                    rhsPad = rhsVersion.pad,
                    rhsParts = rhsVersion.parts,
                    rhsLength = rhsParts.length,
                    length = Math.max(lhsLength, rhsLength),
                    i, lhs, rhs;

                for (i = 0; i < length; i++) {

                    lhs = (i < lhsLength) ? lhsParts[i] : lhsPad;
                    rhs = (i < rhsLength) ? rhsParts[i] : rhsPad;

                    // When one or both of the values are NaN these tests produce false
                    // and we end up treating NaN as equal to anything.
                    if (lhs < rhs) {
                        return -1;
                    }

                    if (lhs > rhs) {
                        return 1;
                    }

                }

                // same comments about NaN apply here...
                lhs = me.releaseValue;
                rhs = rhsVersion.releaseValue;

                if (lhs < rhs) {
                    return -1;
                }

                if (lhs > rhs) {
                    return 1;
                }

                return 0;
            },

            // }}}
            // {{{ toString

            /**
             * Override the native `toString` method
             * @private
             * @return {String} version
             */
            toString: function() {
                return this.version;
            },

            // }}}
            // {{{ valueOf

            /**
             * Override the native `valueOf` method
             * @private
             * @return {String} version
             */
            valueOf: function() {
                return this.version;
            },

            // }}}
            // {{{ getMajor

            /**
             * Returns the major component value.
             * @return {Number}
             */
            getMajor: function() {
                return this.major;
            },

            // }}}
            // {{{ getMinor

            /**
             * Returns the minor component value.
             * @return {Number}
             */
            getMinor: function() {
                return this.minor;
            },

            // }}}
            // {{{ getPatch

            /**
             * Returns the patch component value.
             * @return {Number}
             */
            getPatch: function() {
                return this.patch;
            },

            // }}}
            // {{{ getBuild

            /**
             * Returns the build component value.
             * @return {Number}
             */
            getBuild: function() {
                return this.build;
            },

            // }}}
            // {{{ getRelease

            /**
             * Returns the release component text (e.g., "beta").
             * @return {String}
             */
            getRelease: function() {
                return this.release;
            },

            // }}}
            // {{{ getReleaseValue

            /**
             * Returns the release component value for comparison purposes.
             * @return {Number/String}
             */
            getReleaseValue: function() {
                return this.releaseValue;
            },

            // }}}
            // {{{ isGreaterThan

            /**
             * Returns whether this version if greater than the supplied argument
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version if greater than the target, `false` otherwise
             */
            isGreaterThan: function(target) {
                return this.compareTo(target) > 0;
            },

            // }}}
            // {{{ isGreaterThanOrEqual

            /**
             * Returns whether this version if greater than or equal to the supplied argument
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version if greater than or equal to the target, `false` otherwise
             */
            isGreaterThanOrEqual: function(target) {
                return this.compareTo(target) >= 0;
            },

            // }}}
            // {{{ isLessThan

            /**
             * Returns whether this version if smaller than the supplied argument
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version if smaller than the target, `false` otherwise
             */
            isLessThan: function(target) {
                return this.compareTo(target) < 0;
            },

            // }}}
            // {{{ isLessThanOrEqual

            /**
             * Returns whether this version if less than or equal to the supplied argument
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version if less than or equal to the target, `false` otherwise
             */
            isLessThanOrEqual: function(target) {
                return this.compareTo(target) <= 0;
            },

            // }}}
            // {{{ equals

            /**
             * Returns whether this version equals to the supplied argument
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version equals to the target, `false` otherwise
             */
            equals: function(target) {
                return this.compareTo(target) === 0;
            },

            // }}}
            // {{{ match

            /**
             * Returns whether this version matches the supplied argument. Example:
             *
             *     var version = new CLI.Version('1.0.2beta');
             *     console.log(version.match(1)); // true
             *     console.log(version.match(1.0)); // true
             *     console.log(version.match('1.0.2')); // true
             *     console.log(version.match('1.0.2RC')); // false
             *
             * @param {String/Number} target The version to compare with
             * @return {Boolean} `true` if this version matches the target, `false` otherwise
             */
            match: function(target) {
                target = String(target);
                return this.version.substr(0, target.length) === target;
            },

            // }}}
            // {{{ toArray

            /**
             * Returns this format: [major, minor, patch, build, release]. Useful for comparison.
             * @return {Number[]}
             */
            toArray: function() {
                var me = this;
                return [me.getMajor(), me.getMinor(), me.getPatch(), me.getBuild(), me.getRelease()];
            },

            // }}}
            // {{{ getShortVersion

            /**
             * Returns shortVersion version without dots and release
             * @return {String}
             */
            getShortVersion: function() {
                return this.shortVersion;
            },

            // }}}
            // {{{ gt

            /**
             * Convenient alias to {@link CLI.Version#isGreaterThan isGreaterThan}
             * @param {String/Number/CLI.Version} target
             * @return {Boolean}
             */
            gt: function (target) {
                return this.compareTo(target) > 0;
            },

            // }}}
            // {{{ lt

            /**
             * Convenient alias to {@link CLI.Version#isLessThan isLessThan}
             * @param {String/Number/CLI.Version} target
             * @return {Boolean}
             */
            lt: function (target) {
                return this.compareTo(target) < 0;
            },

            // }}}
            // {{{ gtEq

            /**
             * Convenient alias to {@link CLI.Version#isGreaterThanOrEqual isGreaterThanOrEqual}
             * @param {String/Number/CLI.Version} target
             * @return {Boolean}
             */
            gtEq: function (target) {
                return this.compareTo(target) >= 0;
            },

            // }}}
            // {{{ ltEq

            /**
             * Convenient alias to {@link CLI.Version#isLessThanOrEqual isLessThanOrEqual}
             * @param {String/Number/CLI.Version} target
             * @return {Boolean}
             */
            ltEq: function (target) {
                return this.compareTo(target) <= 0;
            }

            // }}}

        };

        CLI.apply(Version, {

            // {{{ aliases

            aliases: {
                from: {
                    extjs: 'ext',
                    core: 'sencha-core'
                },
                to: {
                    ext: ['extjs'],
                    'sencha-core': ['core']
                }
            },

            // }}}
            // {{{ releaseValueMap

            // @private
            releaseValueMap: {
                dev:   -6,
                alpha: -5,
                a:     -5,
                beta:  -4,
                b:     -4,
                rc:    -3,
                '#':   -2,
                p:     -1,
                pl:    -1
            },

            // }}}
            // {{{ getComponentValue

            /**
             * Converts a version component to a comparable value
             *
             * @static
             * @param {Object} value The value to convert
             * @return {Object}
             */
            getComponentValue: function(value) {
                return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
            },

            // }}}
            // {{{ compare

            /**
             * Compare 2 specified versions by ensuring the first parameter is a `Version`
             * instance and then calling the `compareTo` method.
             *
             * @static
             * @param {String} current The current version to compare to
             * @param {String} target The target version to compare to
             * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent
             */
            compare: function (current, target) {
                var ver = current.isVersion ? current : new Version(current);
                return ver.compareTo(target);
            },

            // }}}
            // {{{ set

            set: function (collection, packageName, version) {

                var aliases = Version.aliases.to[packageName],
                    ver = version.isVersion ? version : new Version(version),
                    i;

                collection[packageName] = ver;

                if (aliases) {
                    for (i = aliases.length; i-- > 0; ) {
                        collection[aliases[i]] = ver;
                    }
                }

                return ver;
            }

            // }}}

        });

        /**
         * @class CLI
         */
        CLI.apply(CLI, {

            // {{{ compatVersions

            /**
             * @private
             */
            compatVersions: {},

            // }}}
            // {{{ versions

            /**
             * @private
             * 
             * Object containing version information for all packages utilized by your 
             * application. 
             * 
             * For a public getter, please see `CLI.getVersion()`.
             */
            versions: {},

            // }}}
            // {{{ lastRegisteredVersion

            /**
             * @private
             */
            lastRegisteredVersion: null,

            // }}}
            // {{{ getCompatVersion

            /**
             * Get the compatibility level (a version number) for the given package name. If
             * none has been registered with `CLI.setCompatVersion` then `CLI.getVersion` is
             * used to get the current version.
             *
             * @param {String} packageName The package name, e.g. 'core', 'touch', 'ext'.
             * @private
             */
            getCompatVersion: function (packageName) {

                var versions = CLI.compatVersions,
                    compat;

                if (!packageName) {

                    compat = versions.ext || versions.touch || versions.core;

                } else {

                    compat = versions[Version.aliases.from[packageName] || packageName];

                }

                return compat || CLI.getVersion(packageName);
            },

            // }}}
            // {{{ setCompatVersion

            /**
             * Set the compatibility level (a version number) for the given package name.
             *
             * @param {String} packageName The package name, e.g. 'core', 'touch', 'ext'.
             * @param {String/CLI.Version} version The version, e.g. '4.2'.
             * @private
             */
            setCompatVersion: function (packageName, version) {
                Version.set(CLI.compatVersions, packageName, version);
            },

            // }}}
            // {{{ setVersion

            /**
             * Set version number for the given package name.
             *
             * @param {String} packageName The package name, e.g. 'core', 'touch', 'ext'.
             * @param {String/CLI.Version} version The version, e.g. '1.2.3alpha', '2.4.0-dev'.
             * @return {CLI}
             */
            setVersion: function (packageName, version) {
                CLI.lastRegisteredVersion = Version.set(CLI.versions, packageName, version);
                return this;
            },

            // }}}
            // {{{ getVersion

            /**
             * Get the version number of the supplied package name; will return the version of
             * the framework.
             *
             * @param {String} [packageName] The package name, e.g., 'core', 'touch', 'ext'.
             * @return {CLI.Version} The version.
             */
            getVersion: function (packageName) {

                var versions = CLI.versions;

                if (!packageName) {
                    return versions.ext || versions.touch || versions.core;
                }

                return versions[Version.aliases.from[packageName] || packageName];
            },

            // }}}
            // {{{ checkVersion

            /**
             * This method checks the registered package versions against the provided version
             * `specs`. A `spec` is either a string or an object indicating a boolean operator.
             * This method accepts either form or an array of these as the first argument. The
             * second argument applies only when the first is an array and indicates whether
             * all `specs` must match or just one.
             * 
             * ## Package Version Specifications
             * The string form of a `spec` is used to indicate a version or range of versions
             * for a particular package. This form of `spec` consists of three (3) parts:
             * 
             *  * Package name followed by "@". If not provided, the framework is assumed.
             *  * Minimum version.
             *  * Maximum version.
             * 
             * At least one version number must be provided. If both minimum and maximum are
             * provided, these must be separated by a "-".
             * 
             * Some examples of package version specifications:
             * 
             *      4.2.2           (exactly version 4.2.2 of the framework)
             *      4.2.2+          (version 4.2.2 or higher of the framework)
             *      4.2.2-          (version 4.2.2 or higher of the framework)
             *      4.2.1 - 4.2.3   (versions from 4.2.1 up to 4.2.3 of the framework)
             *      - 4.2.2         (any version up to version 4.2.1 of the framework)
             *      
             *      foo@1.0         (exactly version 1.0 of package "foo")
             *      foo@1.0-1.3     (versions 1.0 up to 1.3 of package "foo")
             * 
             * **NOTE:** This syntax is the same as that used in Sencha Cmd's package
             * requirements declarations.
             * 
             * ## Boolean Operator Specifications
             * Instead of a string, an object can be used to describe a boolean operation to
             * perform on one or more `specs`. The operator is either **`and`** or **`or`**
             * and can contain an optional **`not`**.
             * 
             * For example:
             * 
             *      {
             *          not: true,  // negates boolean result
             *          and: [
             *              '4.2.2',
             *              'foo@1.0.1 - 2.0.1'
             *          ]
             *      }
             * 
             * Each element of the array can in turn be a string or object spec. In other
             * words, the value is passed to this method (recursively) as the first argument
             * so these two calls are equivalent:
             * 
             *      CLI.checkVersion({
             *          not: true,  // negates boolean result
             *          and: [
             *              '4.2.2',
             *              'foo@1.0.1 - 2.0.1'
             *          ]
             *      });
             *
             *      !CLI.checkVersion([
             *              '4.2.2',
             *              'foo@1.0.1 - 2.0.1'
             *          ], true);
             * 
             * ## Examples
             * 
             *      // A specific framework version
             *      CLI.checkVersion('4.2.2');
             * 
             *      // A range of framework versions:
             *      CLI.checkVersion('4.2.1-4.2.3');
             * 
             *      // A specific version of a package:
             *      CLI.checkVersion('foo@1.0.1');
             * 
             *      // A single spec that requires both a framework version and package
             *      // version range to match:
             *      CLI.checkVersion({
             *          and: [
             *              '4.2.2',
             *              'foo@1.0.1-1.0.2'
             *          ]
             *      });
             * 
             *      // These checks can be nested:
             *      CLI.checkVersion({
             *          and: [
             *              '4.2.2',  // exactly version 4.2.2 of the framework *AND*
             *              {
             *                  // either (or both) of these package specs:
             *                  or: [
             *                      'foo@1.0.1-1.0.2',
             *                      'bar@3.0+'
             *                  ]
             *              }
             *          ]
             *      });
             * 
             * ## Version Comparisons
             * Version comparsions are assumed to be "prefix" based. That is to say, `"foo@1.2"`
             * matches any version of "foo" that has a major version 1 and a minor version of 2.
             * 
             * This also applies to ranges. For example `"foo@1.2-2.2"` matches all versions
             * of "foo" from 1.2 up to 2.2 regardless of the specific patch and build.
             * 
             * ## Use in Overrides
             * This methods primary use is in support of conditional overrides on an
             * `CLI.define` declaration.
             * 
             * @param {String/Array/Object} specs A version specification string, an object
             * containing `or` or `and` with a value that is equivalent to `specs` or an array
             * of either of these.
             * @param {Boolean} [matchAll=false] Pass `true` to require all specs to match.
             * @return {Boolean} True if `specs` matches the registered package versions.
             */
            checkVersion: function (specs, matchAll) {

                var isArray = CLI.isArray(specs),
                    aliases = Version.aliases.from,
                    compat = isArray ? specs : checkVerTemp,
                    length = compat.length,
                    versions = CLI.versions,
                    frameworkVer = versions.ext || versions.touch,
                    i, index, matches, minVer, maxVer, packageName, spec, range, ver;

                if (!isArray) {
                    checkVerTemp[0] = specs;
                }

                for (i = 0; i < length; ++i) {

                    if (!CLI.isString(spec = compat[i])) {

                        matches = CLI.checkVersion(spec.and || spec.or, !spec.or);

                        if (spec.not) {
                            matches = !matches;
                        }

                    } else {

                        if (spec.indexOf(' ') >= 0) {
                            spec = spec.replace(stripRe, '');
                        }

                        // For "name@..." syntax, we need to find the package by the given name
                        // as a registered package.
                        index = spec.indexOf('@');

                        if (index < 0) {

                            range = spec;
                            ver = frameworkVer;

                        } else {

                            packageName = spec.substring(0, index);

                            if (!(ver = versions[aliases[packageName] || packageName])) {

                                // The package is not registered, so if we must matchAll then
                                // we are done - FAIL:
                                if (matchAll) {
                                    return false;
                                }
                                // Otherwise this spec is not a match so we can move on to the
                                // next...
                                continue;
                            }

                            range = spec.substring(index+1);

                        }

                        // Now look for a version, version range or partial range:
                        index = range.indexOf('-');

                        if (index < 0) {

                            // just a version or "1.0+"
                            if (range.charAt(index = range.length - 1) === '+') {

                                minVer = range.substring(0, index);
                                maxVer = null;

                            } else {

                                minVer = maxVer = range;

                            }

                        } else if (index > 0) {

                            // a range like "1.0-1.5" or "1.0-"
                            minVer = range.substring(0, index);
                            maxVer = range.substring(index+1); // may be empty

                        } else {

                            // an upper limit like "-1.5"
                            minVer = null;
                            maxVer = range.substring(index+1);

                        }

                        matches = true;

                        if (minVer) {

                            minVer = new Version(minVer, '~'); // prefix matching
                            matches = minVer.ltEq(ver);

                        }

                        if (matches && maxVer) {

                            maxVer = new Version(maxVer, '~'); // prefix matching
                            matches = maxVer.gtEq(ver);

                        }

                    } // string spec

                    if (matches) {

                        // spec matched and we are looking for any match, so we are GO!
                        if (!matchAll) {
                            return true;
                        }

                    } else if (matchAll) {

                        // spec does not match the registered package version
                        return false;

                    }

                }

                // In the loop above, for matchAll we return FALSE on mismatch, so getting
                // here with matchAll means we had no mismatches. On the other hand, if we
                // are !matchAll, we return TRUE on match and so we get here only if we found
                // no matches.
                return !!matchAll;
            },

            // }}}
            // {{{ deprecate

            /**
             * Create a closure for deprecated code.
             *
             *     // This means CLI.oldMethod is only supported in 4.0.0beta and older.
             *     // If CLI.getVersion('extjs') returns a version that is later than '4.0.0beta', for example '4.0.0RC',
             *     // the closure will not be invoked
             *     CLI.deprecate('extjs', '4.0.0beta', function() {
             *         CLI.oldMethod = CLI.newMethod;
             *
             *         ...
             *     });
             *
             * @param {String} packageName The package name
             * @param {String} since The last version before it's deprecated
             * @param {Function} closure The callback function to be executed with the specified version is less than the current version
             * @param {Object} scope The execution scope (`this`) if the closure
             * @private
             */
            deprecate: function(packageName, since, closure, scope) {

                if (Version.compare(CLI.getVersion(packageName), since) < 1) {
                    closure.call(scope);
                }

            }

            // }}}

        }); // End Versioning

    }());

    (function (manifest){

        var manifest    = manifest || {},
            compat      = manifest && manifest.compatibility;

        CLI.setVersion(manifest.name, manifest.version);

        if (compat) {
            if (CLI.isString(compat)) {
                CLI.setCompatVersion('core', compat);
            } else {
                for (name in compat) {
                    CLI.setCompatVersion(name, compat[name]);
                }
            }
        }

    })(CLI.manifest);

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
