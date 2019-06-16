let gulp = require('gulp');
let fileUtil = require('./server/util/fileInfo');

const watch = require('gulp-watch');
// let source = require("vinyl-source-stream")
// let watchify = require("watchify")
// let gutil = require("gulp-util")

const less = require('gulp-less');

gulp.task('less', function() {
  return gulp
    .src('less/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist/static/css'));
});

watch('md/**/**', function(event) {
  console.log(
    'File ' + event.path + ' was ' + event.type + ', running tasks...'
  );
  fileUtil.buildPostByFile(event.path);
});

gulp.task('default', gulp.series('less'));

gulp.watch(['less/**/*.less'], gulp.series('less'));
