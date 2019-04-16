let gulp = require("gulp");

// let source = require("vinyl-source-stream")
// let watchify = require("watchify")
// let gutil = require("gulp-util")

const less = require("gulp-less");

gulp.task("less", function() {
  return gulp
    .src("less/**/*.less")
    .pipe(less())
    .pipe(gulp.dest("dist/css"));
});

gulp.task("default", gulp.series("less"));

gulp.watch(["less/**/*.less"], gulp.series("less"));
