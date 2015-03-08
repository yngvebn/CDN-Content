var gulp 	= require('gulp'),
	fs 		= require('fs'),
	path	= require('path'),
	rename 	= require('gulp-rename'),
	concat	= require('gulp-concat'),
	uglify 	= require('gulp-uglify'),
	flatten	= require('gulp-flatten'),
	merge	= require('merge-stream'),
    argv    = require('yargs').argv;

var releaseVersion = argv.release;

var paths = {
	packages: 'src/',
	dest: 'build/'
}

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', ['minified', 'nonminified']);

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
			path.join(paths.packages, folder, '/**/*.js')];
		return gulp.src(scripts)
			.pipe(concat(folder+'.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(path.join(paths.dest, releaseFolder)))
			.pipe(gulp.dest(path.join(paths.dest, 'latest')));

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
			path.join(paths.packages, folder, '/**/*.js')];
		return gulp.src(scripts)
			.pipe(concat(folder+'.js'))
			.pipe(gulp.dest(path.join(paths.dest, releaseFolder)))
			.pipe(gulp.dest(path.join(paths.dest, 'latest')));

	});

	return merge(tasks);
});