'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var css2js = require("gulp-css2js");

gulp.task('sass', function () {
  gulp.src('./src/scss/styleguide.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css2js', function () {
  gulp.src("./dist/css/**/*.css")
    .pipe(css2js({
        prefix: "module.exports = \"",
        suffix: "\";\n"
    }))
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});