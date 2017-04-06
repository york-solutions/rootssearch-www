var bundles = require('../webpack-assets.json');

/**
 * Set default values for local vars so that we don't have
 * to check whether or not they exist in the templates
 */
module.exports = function(req, res, next){
  res.locals.pageTitle = '';
  res.locals.css = [];
  res.locals.js = [];
  res.locals.bundles = [];
  res.locals.bundle = function(name){
    return bundles[name] ? '/public/' + bundles[name].js : '';
  };
  res.locals.bundleScript = function(name){
    return '<script src="' + res.locals.bundle(name) + '"></script>';
  };
  next();
};