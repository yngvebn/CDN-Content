var gulp 		= require('gulp'),
	fs 			= require('fs'),
	path		= require('path'),
	rename 		= require('gulp-rename'),
	concat		= require('gulp-concat'),
	runSequence	= require('run-sequence'),
	rimraf		= require('gulp-rimraf'),
	babel		= require('gulp-babel'),
	uglify 		= require('gulp-uglify'),
	flatten		= require('gulp-flatten'),
	merge		= require('merge-stream'),
	gulpif 		= require('gulp-if'),
    argv    	= require('yargs').argv;

var releaseVersion = argv.release;
var isRelease = !(!releaseVersion);
var paths = {
	packages: 'src/',
	dest: 'build/',
	unstable: 'build/unstable/'
}

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', function(callback){
	runSequence('clean', ['minified', 'nonminified'], callback);
});

gulp.task('clean', function(cb){
	return gulp.src(paths.dest, { read: false })
		.pipe(rimraf({force: true}));
})

gulp.task('minified', function(){
	var releaseFolder = 'latest';
	if(releaseVersion){
		releaseFolder = releaseVersion;
		console.log('Building release');
	}
	else{
		console.log('Building latest...')
	}

	var folders = getFolders(paths.packages);
	console.log(folders);

	var tasks = folders.map(function(folder){
		var scripts = 
			[path.join(paths.packages, folder, '/**/*module.js'),
			path.join(paths.packages, folder, '/**/*.js', '!/**/*.spec.js')];
		return gulp.src(scripts)
			.pipe(babel())
			.pipe(concat(folder+'.min.js'))
			.pipe(uglify())			
			.pipe(gulp.dest(paths.unstable))
			.pipe(gulpif(isRelease, gulp.dest(path.join(paths.dest, releaseFolder))))
			.pipe(gulpif(isRelease, gulp.dest(path.join(paths.dest, 'latest'))));

	});

	return merge(tasks);
});


gulp.task('nonminified', function(){
	var releaseFolder = 'latest';
	if(releaseVersion){
		releaseFolder = releaseVersion;
		console.log('Building release');
	}
	else{
		console.log('Building latest...')
	}

	var folders = getFolders(paths.packages);
	console.log(folders);

	var tasks = folders.map(function(folder){
		var scripts = 
			[path.join(paths.packages, folder, '/**/*module.js'),
			path.join(paths.packages, folder, '/**/*.js'), '!/**/*.spec.js'];
		return gulp.src(scripts)
			.pipe(babel())
			.pipe(concat(folder+'.js'))
			
			.pipe(gulp.dest(paths.unstable))
			.pipe(gulpif(isRelease, gulp.dest(path.join(paths.dest, releaseFolder))))
			.pipe(gulpif(isRelease, gulp.dest(path.join(paths.dest, 'latest'))));
	});

	return merge(tasks);
});