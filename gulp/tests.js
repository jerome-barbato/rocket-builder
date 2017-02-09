/**
 * Run Karma Server with Jasmin Test Framework for core sources testing.
 */

try {
    var gulp   = require('gulp');
    var Server = require('karma').Server;

    gulp.task('test', function (done) {
        new Server.start({
            configFile: __dirname + '/../config/karma.conf.js',
            singleRun : true
        }, function () {
            done();
        });
    });
} catch (ex) {
    console.warn('Optional dependencies are not installed, if you want to test, please update.');
}
