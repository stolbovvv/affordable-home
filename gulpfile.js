import gulp from 'gulp';
import path from 'path';
import cssnano from 'cssnano';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import browserSync from 'browser-sync';
import autoprefixer from 'autoprefixer';
import gzip from 'gulp-zip';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import { deleteAsync } from 'del';

// Setting: plugin
const sass = gulpSass(dartSass);

// Setting: dir
const dir = {
  root: path.basename(path.resolve()),
  build: 'dist',
  source: 'src',
};

// Setting: mode
const mode = {
  dev: !process.argv.includes('--production'),
  prod: process.argv.includes('--production'),
};

// Task: views
const handleViews = () => {
  return gulp
    .src(`${dir.source}/**/*.html`)
    .pipe(gulp.dest(`${dir.build}`))
    .pipe(browserSync.stream({ once: true }));
};

// Task: styles
const handleStyles = () => {
  return gulp
    .src([`${dir.source}/styles/index.scss`], { sourcemaps: mode.dev })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(`${dir.build}/styles`))
    .pipe(postcss([cssnano({ preset: 'default' })]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${dir.build}/styles`, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

// Task: scripts
const handleScripts = () => {
  return gulp
    .src([`${dir.source}/scripts/index.js`], { sourcemaps: mode.dev })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest(`${dir.build}/scripts`))
    .pipe(terser({ toplevel: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${dir.build}/scripts`, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

// Task: copy
const handleCopy = () => {
  return gulp
    .src(
      [
        `${dir.source}/fonts/**/*`,
        `${dir.source}/images/**/*`,
        `${dir.source}/{site.webmanifest,favicon.ico}`,
        `${dir.source}/{favicon*,android*,apple*}.png`,
      ],
      {
        base: `${dir.source}`,
      },
    )
    .pipe(gulp.dest(`${dir.build}`))
    .pipe(browserSync.stream({ once: true }));
};

// Task: archive
const handleArchive = () => {
  return gulp
    .src(`${dir.build}/**/*`)
    .pipe(gzip(`${dir.root}.zip`))
    .pipe(gulp.dest('.'));
};

// Task: run server
const runServer = () => {
  browserSync.init({
    ui: false,
    port: 1234,
    open: true,
    online: true,
    notify: false,
    server: {
      baseDir: `${dir.build}`,
    },
  });
};
// Task: run watch
const runWatch = () => {
  gulp.watch([`${dir.source}/**/*.html`], gulp.series(handleViews));
  gulp.watch([`${dir.source}/styles/**/*.scss`], gulp.series(handleStyles));
  gulp.watch([`${dir.source}/scripts/**/*.js`], gulp.series(handleScripts));
  gulp.watch(
    [
      `${dir.source}/fonts/**/*`,
      `${dir.source}/images/**/*`,
      `${dir.source}/{site.webmanifest,favicon.ico}`,
      `${dir.source}/{favicon*,android*,apple*}.png`,
    ],
    gulp.series(handleCopy),
  );
};

// Clean tasks
const cleanBuild = async () => await deleteAsync([`${dir.build}`]);
const cleanArchive = async () => await deleteAsync([`${dir.root}.zip`]);

// Gulp scripts
export const clean = gulp.series(cleanBuild, cleanArchive);
export const build = gulp.series(cleanBuild, cleanArchive, handleViews, handleStyles, handleScripts, handleCopy);
export const archive = gulp.series(
  cleanBuild,
  cleanArchive,
  handleViews,
  handleStyles,
  handleScripts,
  handleCopy,
  handleArchive,
);

// Gulp default script
export default gulp.series(
  gulp.parallel(handleViews, handleStyles, handleScripts, handleCopy),
  gulp.parallel(runServer, runWatch),
);
