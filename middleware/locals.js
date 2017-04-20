const manifest = process.env.NODE_ENV === 'production' ? require('../assets/manifest.json') : {};

/**
 * Set default values for local vars so that we don't have
 * to check whether or not they exist in the templates
 */
module.exports = function(req, res, next){
  res.locals.pageTitle = '';
  res.locals.css = [];
  res.locals.js = [];
  res.locals.asset = function(name){
    if(manifest[name]){
      return `/assets/${manifest[name]}`;
    } else {
      return `/assets/${name}`;
    }
  };
  next();
};