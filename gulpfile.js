'use strict';

var gulp = require('gulp');
var jeditor = require('gulp-json-editor');
var merge = require('merge-stream');
var zip = require('gulp-zip');

var xpiName = 'github-canned-responses.xpi';
var zipName = 'github-canned-responses.zip';

gulp.task('default', function () {
  var files = ['src/*', '!src/manifest.json'];
  var manifest = gulp.src('src/manifest.json');
  var dest = gulp.dest('dest/');

  merge(gulp.src(files), manifest)
    .pipe(zip(zipName))
    .pipe(dest);

  manifest = manifest.pipe(jeditor({
    'applications': {
      'gecko': {
        'id': 'github-canned-responses@example',
        'strict_min_version': '43.0.0'
      }
    }
  }));

  merge(gulp.src(files), manifest)
    .pipe(zip(xpiName))
    .pipe(dest);
});
