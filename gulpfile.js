const gulp = require('gulp');

const watch = require('gulp-watch');
// let source = require("vinyl-source-stream")
// let watchify = require("watchify")
// let gutil = require("gulp-util")

const less = require('gulp-less');
const fileUtil = require('./server/util/fileInfo');

gulp.task('less', () => gulp
  .src('less/**/*.less')
  .pipe(less())
  .pipe(gulp.dest('dist/static/css')));

watch('course/**/**', (event) => {
  console.log(`File ${event.path} was ${event}, running tasks...`);
  fileUtil.buildPostByFile(event.path);
});


gulp.task('default', gulp.series('less'));

gulp.watch(['less/**/*.less'], gulp.series('less'));
