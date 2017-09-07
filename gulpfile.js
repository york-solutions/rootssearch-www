const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const del = require('del');
const rev = require('gulp-rev');
const revcss = require('gulp-rev-css-url');
const revdel = require('gulp-rev-delete-original');
const sass = require('gulp-sass');

//
// JS
//

// In dev we constantly watch for changes. But in production we just build once.
gulp.task('js', ['clean:js'], function(cb){
  const compiler = webpack(webpackConfig);
  compiler.run((error, stats) => {
  
    // Return errors
    if(error){
      return cb(error);
    } 
    if(stats.hasErrors()) {
      const info = stats.toJson();
      return cb(info.errors);
    }
    
    // Success
    cb();
  });
});

gulp.task('js:watch', ['clean:js'], function(cb){
  const compiler = webpack(webpackConfig);
  compiler.watch({}, (error, stats) => {
  
    // Return errors
    if(error){
      return cb(error);
    } 
    if(stats.hasErrors()) {
      const info = stats.toJson();
      return cb(info.errors);
    }
    
    // Success
    console.log('webpack finished');
  });
});

gulp.task('clean:js', function(){
  return del('assets/js');
});

//
// CSS
//

gulp.task('css', ['clean:css'], function(){
  return gulp.src('src/css/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});
gulp.task('css:watch', ['css'], function () {
  gulp.watch('src/css/*', ['css']);
});

gulp.task('clean:css', function(){
  return del('assets/css');
});

//
// Images
//

gulp.task('img', ['clean:img'], function(){
  return gulp.src('src/img/**/*.*')
    .pipe(gulp.dest('assets/img'));
});

gulp.task('clean:img', function(){
  return del('assets/img');
});

//
// String them all together
//

gulp.task('clean:manifest', function(){
  return del('assets/manifest*');
});

gulp.task('build', ['clean:manifest', 'js', 'css', 'img']);
gulp.task('watch', ['js:watch', 'css:watch', 'img']);
gulp.task('default', ['build']);

// Load all files from the build directory, hash them, then write to the assets directory
gulp.task('production', ['build'], function(){
  return gulp.src('assets/**/!(*.map)')
    .pipe(rev())
    .pipe(revcss())
    .pipe(revdel())
    .pipe(gulp.dest('assets'))
    .pipe(rev.manifest('manifest.json'))
    .pipe(gulp.dest('assets'));
});
