(function(){
	'use strict';

	var gulp = require('gulp'),
		watch = require('gulp-watch'),
		pug = require('gulp-pug'),
		data = require('gulp-data'),
		dest = require('gulp-dest'),
		fs = require('fs'),
		plumber = require('gulp-plumber'),
		mergeJson = require('gulp-merge-json'),
		paths = {
			pug: "app/**/*.pug",
			json: "app/**/*.json",
			pages: "app/pages/",
			data: "app/data/",
			html: "dist/"
		};

	gulp.task('pug', function() {
		return gulp.src(paths.pages + "*.pug")
			.pipe(plumber({
				errorHandler: function (err) {
					console.log(err);
					this.emit('end');
				}
			}))
			.pipe(data(function(file) {
				return JSON.parse(fs.readFileSync(paths.data + 'data.json', 'utf8'));
			}))
			.pipe(pug({
				pretty: true
			}))
			.pipe(gulp.dest(paths.html));
	});

	gulp.task('merge-json', function() {
		gulp.src(paths.json)
			.pipe(mergeJson('data.json'))
			.pipe(gulp.dest(paths.data));
	});

	gulp.task('watch', function () {
	    gulp.watch(
			[ paths.json ],
			[ "merge-json" ]);
	    gulp.watch(
			[ paths.pug ],
			[ "pug" ]);
	});

	gulp.task('build', [ 'merge-json', 'pug', 'watch' ]);

	gulp.task('default', [ 'build' ]);

})();
