const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const del = require('del');
const rev = require('gulp-rev');
const revcss = require('gulp-rev-css-url');
const sass = require('gulp-sass');

const PRODUCTION = process.env.NODE_ENV === 'production';

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
  return cleanAssetType('js');
});

//
// CSS
//

gulp.task('css', ['clean:css'], function(){
  return gulp.src('src/css/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PRODUCTION ? 'build/css' : 'assets/css'));
});
gulp.task('css:watch', ['css'], function () {
  gulp.watch('src/css/*', ['css']);
});

gulp.task('clean:css', function(){
  return cleanAssetType('css');
});

//
// Images
//

gulp.task('img', ['clean:img'], function(){
  return gulp.src('src/img/**/*.*')
    .pipe(gulp.dest(PRODUCTION ? 'build/img' : 'assets/img'));
});

gulp.task('clean:img', function(){
  return cleanAssetType('img');
});

//
// String them all together
//

gulp.task('build', ['js', 'css', 'img']);
gulp.task('default', ['build']);

gulp.task('watch', ['js:watch', 'css:watch', 'img']);

// Load all files from the build directory, hash them, then write to the assets directory
gulp.task('production', ['build'], function(){
  return gulp.src('build/**/*.*')
    .pipe(rev())
    .pipe(revcss())
    .pipe(gulp.dest('assets'))
    .pipe(rev.manifest('manifest.json'))
    .pipe(gulp.dest('assets'))
    .on('end', function(){
      del('build');
    });
});

function cleanAssetType(type){
  const paths = [`assets/${type}`];
  if(PRODUCTION){
    paths.push(`build/${type}`);
  }
  return del(paths);
}