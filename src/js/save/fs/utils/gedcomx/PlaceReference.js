const GedcomX = require('gedcomx-js');

/**
 * Get a place name from a place
 * 
 * @returns {String}
 */
GedcomX.PlaceReference.prototype.getDisplayString = function(){
  if(this.getNormalized().length > 0){
    return this.getNormalized()[0].getValue() || '';
  } else {
    return this.getOriginal() || '';
  }
};