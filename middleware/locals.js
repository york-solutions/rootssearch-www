/**
 * Set default values for local vars so that we don't have
 * to check whether or not they exist in the templates
 */
module.exports = function(req, res, next){
  res.locals.pageTitle = '';
  res.locals.css = [];
  res.locals.js = [];
  next();
};