const GedcomX = require('gedcomx-js');
const dateUtils = require('../date');

/**
 * Generate a display version of a string, when possible
 * 
 * @returns {String}
 */
GedcomX.Date.prototype.getDisplayString = function(){
  
  // Check for a normalized date
  if(this.getNormalized().length > 0){
    return this.getNormalized()[0].getValue() || '';
  }
  
  // Parse the formal value if set
  if(this.getFormal()){
    let date = new Date(this.getFormal().replace('+',''));
    if(!isNaN(date.getTime())){
      return dateUtils.displayString(date);
    }
  }
  
  // Just return what we have if nothing else works
  return this.getOriginal() || '';
};

/**
 * Get the year of a date, if possible.
 * 
 * @return {String} year
 */
GedcomX.Date.prototype.getYear = function(){
  if(this.normalized){
    let matches = this.normalized[0].value.match(/\+(\d{4})/);
    if(matches){
      return matches[1];
    }
  }
  if(this.original){
    let matches = this.original.match(/\b\d{4}\b/);
    if(matches){
      return matches[0];
    }
  }
  return '';
};