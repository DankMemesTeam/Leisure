const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
// const plumber = require('gulp-plumber');
const livereload = require('gulp-livereload');
const mocha = require('gulp-mocha');
const minify = require('gulp-minify');


gulp.task('develop', function() {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false,
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('test:unit', () => {
  gulp.src('tests/**/*.js')
    .pipe(mocha({
      reporter: 'nyan',
    }));
});

// Useless atm
gulp.task('minify:js', () => {
  gulp.src(['app/**/*.js', 'config/**/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', [
  'develop',
]);
