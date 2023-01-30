"use strict";

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('node-sass'));
const sassGlob = require('gulp-sass-glob');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const data = require('gulp-data');
const twig = require('gulp-twig');
const fs = require('fs');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const w3cjs = require('gulp-w3cjs');

const paths = {
  images: {
    root: './src/images/',
    base: './src/images/',
    files: ['./**/*.*'],
    watch: ['**/*.*'],
    dist: './dist/images/',
    public: './public/images/'
  },
  styles: {
    root: './src/styles/',
    base: './src/styles/',
    files: ['./**/*.scss'],
    watch: ['**/*.scss'],
    dist: './dist/css/',
    public: './public/css/'
  },
  scripts: {
    root: './src/scripts/',
    base: './src/scripts/',
    files: ['vendor/**/*.js', './*.js'],
    watch: ['**/*.js'],
    dist: './dist/js/',
    public: './public/js/'
  },
  html: {
    data: './src/data/data.json',
    builddata: './src/data/data-build.json',
    root: './src/templates/',
    base: './src/templates/',
    files: ['./*.twig'],
    watch: ['./*.twig', './**/*.twig', '../data/**/*.json'],
    dist: './dist/',
    public: './public/'
  }
};

function clean() {
  return del([
    paths.images.public,
    paths.images.dist,
    paths.scripts.dist,
    paths.styles.dist,
    paths.html.public + '*.html',
    paths.html.dist + '*.html',
  ]);
}

function images() {
  const taskPath = paths.images;
  return gulp.src(taskPath.files, { cwd: taskPath.root, base: taskPath.base })
    .pipe(gulp.dest(taskPath.public));
}

function html_public() {
  const taskPath = paths.html;
  return gulp.src(taskPath.files, { cwd: taskPath.root, base: taskPath.base })
    .pipe(plumber({ errorHandler: notify.onError("Gulp error in HTML task: <%= error.message %>") }))
    .pipe(data(function () {
      return JSON.parse(fs.readFileSync(taskPath.data));
    }))
    .pipe(twig({
      base: taskPath.base
    }))
    .pipe(gulp.dest(taskPath.public))
    .pipe(browserSync.stream());
}

function styles() {
  const taskPath = paths.styles;
  return gulp.src(taskPath.files, { cwd: taskPath.root, base: taskPath.base })
    .pipe(plumber({ errorHandler: notify.onError("Gulp error in STYLES task: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: [
        require('node-normalize-scss').includePaths
      ],
      outputStyle: 'compressed',
      sourceComments: false,
      errLogToConsole: true
    }))
    .pipe(postcss([
      require('autoprefixer'),
      require('cssnano')({ zindex: false }),
      require('postcss-flexbugs-fixes')
    ]))
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(taskPath.public));
}

function scripts() {
  const taskPath = paths.scripts;
  return gulp.src(taskPath.files, { cwd: taskPath.root, base: taskPath.base })
    .pipe(plumber({ errorHandler: notify.onError("Gulp error in SCRIPTS task: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(taskPath.public));
}

function w3cvalidate() {
  const taskPath = paths.html;
  return gulp.src(taskPath.dist + '*.html', { cwd: '.', base: '.' })
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './public/'
    },
    port: 8000,
    open: true,
  });
  done();
}

function watchFiles() {
  gulp.watch(paths.images.watch, { cwd: paths.images.root }, images);
  gulp.watch(paths.scripts.watch, { cwd: paths.scripts.root }, scripts);
  gulp.watch(paths.styles.watch, { cwd: paths.styles.root }, gulp.series(styles, html_public));
  gulp.watch(paths.html.watch, { cwd: paths.html.root }, gulp.series(html_public));
}

const build = gulp.series(clean, gulp.series(gulp.parallel(images, styles, scripts), gulp.parallel(html_public)));
const watch = gulp.parallel(watchFiles, serve);

exports.w3check = gulp.series(build, w3cvalidate);
exports.build = build;
exports.default = gulp.series(build, watch);
