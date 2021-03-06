'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let bower = require('bower-files')();
let dependencies = bower.relative(__dirname).ext('<%= extPreprocessor %>').files;
let inject = require('gulp-inject');
let util = require('util');
let <%= preprocessor %> = require('gulp-<%= preprocessor %>');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let config = require('./gulp.config.js');

let injectTransform = {
	starttag: '/* inject:imports */',
	endtag: '/* endinject */',
  transform: filepath => `@import '../..${filepath}';`,
};

let injectConfig = {
	read: false,
	relative: false
};<% if (preprocessor === 'sass') { %>

let configPreprocessor = {
	outputStyle: 'compressed'
};<% } %><% if (preprocessor === 'less' || preprocessor === 'stylus') { %>
let configPreprocessor = {
	compress: true
};<% } %>

gulp.task('styles', stylesTask);

function stylesTask() {
  return gulp
    .src(config.styles.src)
    .pipe(inject(gulp.src(dependencies, injectConfig), injectTransform))<% if (preprocessor === 'stylus') { %>
    .pipe(plumber({ errorHandler: onError }))<% } %>
    .pipe(sourcemaps.init())<% if (preprocessor === 'sass') { %>
    .pipe(sass(configPreprocessor).on('error', onError))<% } %><% if (preprocessor === 'less') { %>
    .pipe(less(configPreprocessor).on('error', onError))<% } %><% if (preprocessor === 'stylus') { %>
    .pipe(stylus(configPreprocessor))<% } %>
    .pipe(autoprefixer())
    .pipe(sourcemaps.write({sourceRoot: '/client/styles'}))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(config.browserSync.stream({match: '**/*.css'}));
}

function onError(err) {
	let message = new gutil.PluginError(err.plugin, err.message).toString();
	process.stderr.write(message + '\n');
	gutil.beep();
}
