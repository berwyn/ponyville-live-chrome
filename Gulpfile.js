var gulp        = require('gulp'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    ngInject    = require('gulp-ng-annotate'),
    sass        = require('gulp-sass'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    del         = require('del'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    through2    = require('through2');

var paths = {
    js: [
        '!src/scripts/background.js',
        'src/scripts/*.js'
    ],
    vendor: [
        'bower_components/commonjs/common.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-aria/angular-aria.js',
        'bower_components/angular-material/angular-material.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/moment/min/moment-with-locales.js',
        'bower_components/socket.io-client/socket.io.js',
        'bower_components/color-thief/dist/color-thief.min.js'
    ],
    sass: [
        'bower_components/angular/angular-csp.css',
        'bower_components/angular-material/angular-material.css',
        'src/**/*.scss'
    ],
    html: [
        'src/*.html'
    ],
    images: [
        'src/images/*',
        'bower_components/material-design-icons/av/svg/production/ic_play_arrow_48px.svg',
        'bower_components/material-design-icons/av/svg/production/ic_stop_48px.svg',
        'bower_components/material-design-icons/av/svg/production/ic_volume_down_48px.svg',
        'bower_components/material-design-icons/av/svg/production/ic_volume_up_48px.svg',
        'bower_components/material-design-icons/navigation/svg/production/ic_close_48px.svg'
    ],
    fonts: [
        'src/fonts/*',
        'bower_components/font-awesome/fonts/*'
    ],
    manifest: 'src/manifest.json',
    background: 'src/scripts/background.js',
    svg: [
        'bower_components/material-design-icons/sprites/svg-sprite/*.svg'
    ]
};

gulp.task('build', [
    'js',
    'vendor',
    'sass',
    'html',
    'images',
    'fonts',
    'manifest',
    'background',
    'svg'
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
    var jshintConfig = {
        esnext: true
    };

    var browserified = through2.obj(function(file, enc, next) {
        browserify(file.path)
            .transform(babelify)
            .bundle(function(err, res) {
                file.contents = res;
                next(null, file);
            });
    });

    return gulp.src(paths.js)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish))
        .pipe(browserified)
        .pipe(sourcemaps.init())
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

gulp.task('svg', function() {
    return gulp.src(paths.svg)
        .pipe(gulp.dest('compiled/svg'));
});