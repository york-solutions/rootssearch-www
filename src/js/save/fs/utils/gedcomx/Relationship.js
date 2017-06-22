const GedcomX = require('gedcomx-js');

/**
 * Check whether a person is involved in this relationship
 * 
 * @param {Person|String} person A person or person ID
 * @returns {Boolean}
 */
GedcomX.Relationship.prototype.isInvolved = function(person){
  return this.getPerson1().matches(person) || this.getPerson2().matches(person);
};