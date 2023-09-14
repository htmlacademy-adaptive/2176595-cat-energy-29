import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';
import { stacksvg } from "gulp-stacksvg";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}


// HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(gulp.dest('build'));
  }

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }

  //Svg

const svg = () =>
  gulp.src(['source/img/**/*.svg'])
  .pipe(svgo({
    plugins: [
      'present-default',
      'removeDimensions',
      {
        removeViewBox: false,
      },
      {
        cleanipIDs: false,
      }
    ],
  }))
  .pipe(gulp.dest('build/img'));

//Stack

const makeStack = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(stacksvg({output: 'stack'}))
    .pipe(gulp.dest('build/img'))
}
  // Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }

  // Clean

const clean = () => {
  return del('build');
  };


  // Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

export const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}


// Build

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  makeStack
 ),
);

  // Default
export default gulp.series(
  clean,
  copy,
  gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  makeStack
  ),
  gulp.series(
  server,
  watcher
  ));
