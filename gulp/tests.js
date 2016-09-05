/**
 * Run Karma Server with Jasmin Test Framework for core sources testing.
 */
var gulp        = require('gulp');
var Server      = require('karma').Server;

gulp.task('test', function (done) {
    new Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});