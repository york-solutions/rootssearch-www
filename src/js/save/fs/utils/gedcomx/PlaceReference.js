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

/**
 * Check whether this place reference is equal to another place reference
 * 
 * @param {GedcomX.PlaceReference} other
 * @returns {Boolean}
 */
GedcomX.PlaceReference.prototype.equals = function(other){
  // TODO: compare normalized values?
  
  return this.getOriginal() === other.getOriginal();
};