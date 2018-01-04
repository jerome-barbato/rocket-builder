'use strict';

gulp.task('clean', function () {
    return del([config.paths.dist + gpath.sep + 'bundle' + gpath.sep + '*', config.paths.views + gpath.sep + '*'], {force: true});
});
