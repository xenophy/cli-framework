/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/*!
 * This file is part of CLI Framework
 */
CLI.define('CLI.Fs', {

    // {{{ singleton

    singleton: true,

    // }}}
    // {{{ remove

    remove: function(target, callback, progress) {

        var fs      = require('fs'),
            path    = require('path'),
            async   = require('async');

        if (!CLI.isFunction(progress)) {
            progress = CLI.emptyFn;
        }

        fs.exists(target, function(exists) {

            if (exists) {

                fs.stat(target, function(err, stat) {

                    // ディレクトリチェック
                    if(!stat.isDirectory()) {

                        // ファイル削除
                        fs.unlink(target, function() {
                            progress(target);
                            callback();
                        });

                    };

                    var rmdir = function(target, callback) {

                        fs.readdir(target, function(err, list) {

                            var series = [];

                            for(var i = 0; i < list.length; i++) {

                                var item = list[i];

                                series.push((function(item) {

                                    return function(next) {

                                        var filename = path.join(target, item);

                                        fs.stat(filename, function(err, stat) {

                                            if(filename == "." || filename == "..") {

                                            } else if(stat.isDirectory()) {

                                                // 再帰処理
                                                rmdir(filename, function(err) {
                                                    progress(filename);
                                                    next();
                                                });

                                            } else {

                                                // ファイル削除
                                                fs.unlink(filename, function(err) {
                                                    progress(filename);
                                                    next();
                                                });

                                            }

                                        });

                                    };

                                })(item));

                            };

                            series.push(function(next) {

                                // ディレクトリ削除
                                fs.rmdir(target, function(err) {
                                    progress(target);
                                    next();
                                });

                            });

                            async.series(series, function() {
                                callback();
                            });

                        });

                    };

                    // 削除処理実行
                    rmdir(target, callback);

                });

            } else {

                callback();

            }

        });

    }

    // }}}

});

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
