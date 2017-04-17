const gulp = require('gulp');
const webpack = require('webpack');
const del = require('del');

// In dev we constantly watch for changes. But in production we just build once.
gulp.task('js', ['clean-js'], function(cb){
  const compiler = webpack(require('./webpack.config.js'));
  
  if(process.env.NODE_ENV === 'production'){
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
  } else {
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
  }
});

gulp.task('clean-js', function(){
  return del('assets/js');
});

gulp.task('css', ['clean-css'], function(){
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('assets/css'));
});

gulp.task('clean-css', function(){
  return del('assets/css');
});

gulp.task('img', ['clean-img'], function(){
  return gulp.src('src/img/**/*.*')
    .pipe(gulp.dest('assets/img'));
});

gulp.task('clean-img', function(){
  return del('assets/img');
});

gulp.task('default', ['js', 'css', 'img']);