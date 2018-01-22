let gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    browserSync = require("browser-sync"),
    uglify = require('gulp-uglify'),
    prefixCss = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber');

//IMG
gulp.task('img', () => {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: true}],
      use: [pngquant()]
      })))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('clearCache', () => {
  return cache.clearAll();
});

//BABEL && MIN JS
gulp.task('babel', () => {
  return gulp.src('./js/*')
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.reload({stream: true}));
});

//SASS && MIN CSS && AUTOPREFIX CSS
gulp.task('sass', () => {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixCss({browsers: ['last 8 version', '> 2%', 'firefox 15', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({stream: true}));
})

//Browser-sync
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: './'
    }
  });
})

//Server
gulp.task('server', ['img', 'browser-sync', 'sass', 'babel'], () =>{
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('./*.html', browserSync.reload);
    gulp.watch('./js/**/*.js', ['babel']);
});
gulp.task('default', ['server']);
