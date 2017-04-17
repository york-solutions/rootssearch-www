const gulp = require('gulp');
const webpack = require('webpack');

// In dev we constantly watch for changes. But in production we just build once.
gulp.task('js', function(cb){
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