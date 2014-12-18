var gulp        = require('gulp'),
    traceur     = require('gulp-traceur'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    ngInject    = require('gulp-ng-annotate'),
    sass        = require('gulp-sass'),
    del         = require('del');

var paths = {
    js: [
        '!src/scripts/background.js',
        'src/scripts/app.js', // Defines the module, so needs to come 1st
        'src/scripts/*.js'
    ],
    vendor: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/lodash/dist/lodash.min.js',
        'bower_components/moment/min/moment-with-locales.min.js',
        'bower_components/socket.io-client/socket.io.js',
        'bower_components/color-thief/dist/color-thief.min.js'
    ],
    sass: [
        'src/**/*.scss'
    ],
    html: [
        'src/*.html'
    ],
    images: 'src/images/*',
    fonts: [
        'src/fonts/*',
        'bower_components/font-awesome/fonts/*'
    ],
    manifest: 'src/manifest.json',
    background: 'src/scripts/background.js'
};

gulp.task('build', [
    'js',
    'vendor',
    'sass',
    'html',
    'images',
    'fonts',
    'manifest',
    'background'
]);

gulp.task('clean', function(cb) {
    del(['compiled'], cb);
});

gulp.task('watch', function() {
    for(var task in paths) {
        gulp.watch(paths[task], [task]);
    }
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(traceur())
        .pipe(ngInject())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/scripts'));
});

gulp.task('vendor', function() {
    return gulp.src(paths.vendor)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/scripts'));
});

gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('mane.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/styles'));
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('compiled'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('compiled/images'));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('compiled/fonts'));
});

gulp.task('manifest', function() {
    return gulp.src(paths.manifest)
        .pipe(gulp.dest('compiled'));
});

gulp.task('background', function() {
    return gulp.src(paths.background)
        .pipe(gulp.dest('compiled/scripts'));
});