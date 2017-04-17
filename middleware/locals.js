/**
 * Set default values for local vars so that we don't have
 * to check whether or not they exist in the templates
 */
module.exports = function(req, res, next){
  res.locals.pageTitle = '';
  res.locals.css = [];
  res.locals.bundles = [];
  res.locals.bundle = function(name){
    // return bundles[name] ? '/assets/js/' + bundles[name].js : '';
    return `/assets/js/${name}.js`;
  };
  res.locals.bundleScript = function(name){
    return '<script src="' + res.locals.bundle(name) + '"></script>';
  };
  next();
};