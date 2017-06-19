const GedcomX = require('gedcomx-js');

/**
 * Get the date display string for a fact, if the date exists
 * 
 * @returns {String}
 */
GedcomX.Fact.prototype.getDateDisplayString = function(){
  if(this.getDate()){
    return this.getDate().getDisplayString();
  }
};

/**
 * Get the place name from a fact, if a place exists
 * 
 * @returns {String}
 */
GedcomX.Fact.prototype.getPlaceDisplayString = function(){
  if(this.getPlace()){
    return this.getPlace().getDisplayString();
  }
};

/**
 * Generate a display label for the fact type
 *
 * @returns {String}
 */
GedcomX.Fact.prototype.getTypeDisplayLabel = function(){
  const type = this.getType() || '';
  return type
    .replace('data:,','') // Remove data uri syntax for custom types
    .split('/').pop() // For spec type; remove the http://gedcomx.org/ prefix
    .match(/([A-Z]?[^A-Z]*)/g).slice(0,-1) // Split the string on uppercase letters
    .join(' '); // Join any split pieces together with a space
};

/**
 * Check whether a fact is empty, meaning it has no date or place
 * 
 * @return {Boolean}
 */
GedcomX.Fact.prototype.isEmpty = function(){
  return this.getDate() === undefined && this.getPlace() === undefined;
};

/**
 * Check whether a fact is a vital.
 * 
 * @returns {Boolean}
 */
GedcomX.Fact.prototype.isVital = function(){
  return GedcomX.vitals.indexOf(this.getType()) !== -1;
};