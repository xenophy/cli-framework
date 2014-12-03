/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */

(function() {

    "use strict";

    var org_console = {};

    global.beginSilent = function() {

        org_console.log = global.console.log;
        org_console.info = global.console.info;
        org_console.warn = global.console.warn;
        org_console.error = global.console.error;
        org_console.dir = global.console.dir;
        org_console.time = global.console.time;
        org_console.timeEnd = global.console.timeEnd;
        org_console.trace = global.console.trace;
        org_console.assert = global.console.assert;

        CLI.global.console.log = CLI.emptyFn;
        CLI.global.console.info = CLI.emptyFn;
        CLI.global.console.warn = CLI.emptyFn;
        CLI.global.console.error = CLI.emptyFn;
        CLI.global.console.dir = CLI.emptyFn;
        CLI.global.console.time = CLI.emptyFn;
        CLI.global.console.timeEnd = CLI.emptyFn;
        CLI.global.console.trace = CLI.emptyFn;
        CLI.global.console.assert = CLI.emptyFn;

        CLI.global.console.suspended = true;

    };

    global.endSilent = function() {

        global.console.log = org_console.log;
        global.console.info = org_console.info;
        global.console.warn = org_console.warn;
        global.console.error = org_console.error;
        global.console.dir = org_console.dir;
        global.console.time = org_console.time;
        global.console.timeEnd = org_console.timeEnd;
        global.console.trace = org_console.trace;
        global.console.assert = org_console.assert;

        CLI.global.console.suspended = false;
    };

    global.fakeScope = {
        id: "fakeScope",
        fakeScope: true
    };

    global.waitsFor = function(latchFunction, callback) {

        var timer = setInterval(function() {

            if (latchFunction() === true) {

                clearInterval(timer);

                callback();
            }

        }, 1);

    };

    global.getMostRecentCall = function(spy) {

        var result = {};

        spy.getCalls().forEach(function(cl) {

            result[cl.callId] = result[cl.callId] || 0;
            result[cl.callId]++;

        });

        var maxCnt = 0;
        var maxKey;

        CLI.iterate(result, function(key, cnt) {
            if (maxCnt < cnt) {
                maxCnt = cnt;
                maxKey = key;
            }
        });

        var mostRecentCall = null;
        spy.getCalls().forEach(function(cl) {
            if (cl.callId == maxKey) {
                mostRecentCall = cl;
            }
        });

        return mostRecentCall;

    };

})();

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
