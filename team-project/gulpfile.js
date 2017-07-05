const config = require('./config/config').dev;

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const minify = require('gulp-minify');

const app = require('./config')();
let server = null;

gulp.task('start', () => {
  server = app.listen(config.port, () =>
    console.log('Express server listening on port ' + config.port)
  );
});

gulp.task('server:restart', () => {
  const pr = Promise.resolve();
  if (server) {
    pr.then(() => server.close());
  }

  return pr.then(() => {
    server = app.listen(config.port, () =>
      console.log('Express server listening on port ' + config.port)
    );
  });
});

gulp.task('dev', ['server:restart'], () => {
  return nodemon({
    ext: 'js',
    tasks: ['server:restart'],
    script: 'server.js',
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
  'dev',
]);
