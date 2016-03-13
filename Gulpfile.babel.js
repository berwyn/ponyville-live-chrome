import gulp        from 'gulp';
import sourcemaps  from 'gulp-sourcemaps';
import concat      from 'gulp-concat';
import ngannotate  from 'gulp-ng-annotate';
import sass        from 'gulp-sass';
import eslint      from 'gulp-eslint';
import gulpif      from 'gulp-if';
import del         from 'del';
import browserify  from 'browserify';
import buffer      from 'vinyl-buffer';
import source      from 'vinyl-source-stream';
import merge       from 'merge2';

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

gulp.task('clean:nuclear', function(cb) {
    del(['compiled', 'typings', 'node_modules', 'bower_componets'], cb);
});

gulp.task('watch', function() {
    for(var task in paths) {
        gulp.watch(paths[task], [task]);
    }
    gulp.watch('src/**/*.ts', ['js']);
});

gulp.task('lint:js', () => {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js', ['lint:js'], () => {
    let browserifyOpts = {
        entries: './src/scripts/app.js',
        debug: true
    };
    
    let stream = browserify(browserifyOpts)
        .transform('babelify', { presets: ['es2015'] })
        .plugin('tsify')
        .add('typings/browser.d.ts');

    return stream.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(ngannotate())
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
    let sassCheck = file => {
        return /scss$/i.test(file.basename);
    }
    
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(gulpif(sassCheck, sass()))
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