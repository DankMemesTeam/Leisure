// const config = require('./config/config');
// const logger = require('./config/logger-conf');
// will get uncommented later

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

// const app = require('./config')(logger);
let server = null;

gulp.task('start', () => {
	return app
		.then((application) => {
			application.listen(config.port, () =>
				logger.debug('Express server listening on port ' + config.port)
			);
		});
});

gulp.task('server:restart', () => {
	const pr = Promise.resolve();
	if (server) {
		pr.then(() => server.close());
	}

	return pr.then(() => {
		server = app.listen(config.port, () =>
			logger.debug('Express server listening on port ' + config.port)
		);
	});
});

gulp.task('dev', ['server:restart'], () => {
	return nodemon({
		ext: 'js',
		tasks: ['server:restart'],
		script: 'app.js',
	});
});

gulp.task('test:unit', ['pre-test'], () => {
	return gulp.src(['./tests/unit-tests/**/*.js'])
		.pipe(mocha())
		.pipe(istanbul.writeReports());
});

gulp.task('test:integration', ['pre-test'], () => {
	return gulp.src('./tests/integration-tests/**/*.js', { read: false })
		.pipe(mocha({
			colors: true,
			reporter: 'spec',
		}))
		.pipe(istanbul.writeReports());
});

gulp.task('pre-test', () => {
	return gulp
		.src(['./lib/**/*.js',
			'./data/**/*.js'])
		.pipe(istanbul({
			includeUntested: true,
		}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
	return gulp
		.src([
			'./tests/integration-tests/**/*.js',
			'./tests/unit-tests/**/*.js',
		])
		.pipe(mocha())
		.pipe(istanbul.writeReports());
});

gulp.task('default', [
	'dev',
]);
