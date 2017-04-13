require('./polyfills');

module.exports = function(){
  console.log('loaded');
  document.querySelector('.page-loader').remove();
};