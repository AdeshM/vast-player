const gulp = require('gulp');
const connect	= require('gulp-connect');
const uglify	= require('gulp-uglify');
const uglifycss	= require('gulp-uglifycss');
const concat	= require('gulp-concat');
const rename	= require('gulp-rename');
const opn 	= require('opn');

const eslint = require('gulp-eslint');
//const prompt = require('gulp-prompt');
//const clean = require('gulp-clean');
const babel = require('gulp-babel');


var CFG = {};
CFG.srcDir = './src/';
CFG.buildDir = './build';
CFG.destDir = './app/';	// './dest/'
CFG.testDir = './';
CFG.docRoot = './src/';

CFG.appName	= 'Vast Player - Sample App';
CFG.domain	= 'localhost';
CFG.port	= 80;
CFG.startUrl= 'index.html?dev=true';


gulp.task('webServer', () => {
	// Starts simpleHTTPServer with current DocRoot
	var startUrl = 'http://'+CFG.domain+':'+CFG.port+CFG.testDir.replace('.', '')+CFG.startUrl;
	var domain = CFG.domain.split(':');
	connect.server({
		name: CFG.appName,
		root: CFG.docRoot,
		port: CFG.port || 80,
		host: CFG.domain || 'localhost',
		livereload: true
	});
	opn(startUrl, {app: ['chrome' /*, '--incognito' */ ]});
	console.log('Started at '+'http://'+CFG.domain+':'+ CFG.port);
});

gulp.task('lint', () => {
    console.info('<<< Starting Code Verification >>>');
    return gulp.src(['**/*.js', '!.min.js$', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
        .pipe(eslint())
        .pipe(eslint.format());
        //.pipe(eslint.failAfterError());
});

gulp.task('deployJS', function () {
	console.log('<<< Building JS >>>');
	return gulp.src(['**/*.js', '!.min.js$', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
		.pipe(gulp.dest(CFG.buildDir))
		.pipe(uglify())
		.pipe(gulp.dest(CFG.destDir))
		.pipe(connect.reload());
});

gulp.task('deployCSS', function () {
	console.log('<<< Building CSS >>>');
	return gulp.src(['**/*.css', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
		.pipe(gulp.dest(CFG.buildDir))
		.pipe(uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
		}))
		.pipe(gulp.dest(CFG.destDir));
});

gulp.task('deployImages', function () {
	console.log('<<< Copying Images >>>');
    return gulp.src(['WSDK/imgs/**/*', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
        .pipe(babel())
		.pipe(gulp.dest(CFG.buildDir))
		.pipe(gulp.dest(CFG.destDir))
		.pipe(connect.reload());
});

gulp.task('deployAllResources', function () {
	console.log('<<< Copying All Resources >>>');
	return gulp.src(['**/*', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
	.pipe(gulp.dest(CFG.buildDir))
	.pipe(gulp.dest(CFG.destDir))
	.pipe(connect.reload());
});


gulp.task('compileJS', () => {
    console.info('<<< Compiling JavaScript Source >>>');
    return gulp.src(['**/*.js', '!.min.js$', '!node_modules/**'], {cwd: CFG.srcDir, base: CFG.srcDir})
    .pipe(babel()/*({
        presets: ['env']
    })*/)
    .pipe(gulp.dest(CFG.buildDir))
    .pipe(uglify())
    .pipe(gulp.dest(CFG.destDir));
 });


gulp.task('watch', () => {
	console.log('<<< Auto Build / Deploy Started >>>');
	gulp.watch(CFG.srcDir+'**/*.js', ['deployJS']);
	gulp.watch(CFG.srcDir+'**/*.css', ['deployCSS']);
	gulp.watch(CFG.srcDir+'imgs/**/*', ['deployImages']);
});

gulp.task('default', ['watch']);
gulp.task('deployAll', ['deployJS', 'deployCSS', 'deployImages']);
gulp.task('serv', ['webServer', 'deployAll', 'autoDeploy']);