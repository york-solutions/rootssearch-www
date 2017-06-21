const GedcomX = require('gedcomx-js');

/**
 * Get a person's parents.
 * 
 * @param {Person|String} person Person or person ID
 * @return {Person[]}
 */
GedcomX.Root.prototype.getPersonsParents = function(person){
  var root = this;
  return this.getPersonsParentRelationships(person).map(function(rel){
    return root.getPersonById(rel.getPerson1().getResourceId());
  })
  
  // Remove any falsy values from the array. That can happen if the rel -> person
  // mapping fails to find a matching person.
  .filter(Boolean);
};

/**
 * Get a person's spouses.
 * 
 * @param {Person|String} person Person or person ID
 * @return {Person[]}
 */
GedcomX.Root.prototype.getPersonsSpouses = function(person){
  var root = this;
  return this.getPersonsCoupleRelationships(person).map(function(rel){
    return root.getPersonById(rel.getOtherPerson(person).getResourceId());
  })
  
  // Remove any falsy values from the array. That can happen if the rel -> person
  // mapping fails to find a matching person.
  .filter(Boolean);
};

/**
 * Get the source description pointed to be the description property of the document
 * 
 * @return {GedcomX.SourceDescription}
 */
GedcomX.Root.prototype.getRootSourceDescription = function(){
  const descriptionId = this.getDescription().replace('#', '');
  return this.getSourceDescriptionById(descriptionId);
};

/**
 * Get a source description by ID
 * 
 * @param {String}
 * @return {GedcomX.SourceDescription}
 */
GedcomX.Root.prototype.getSourceDescriptionById = function(descriptionId){
  return this.getSourceDescriptions().find(sd => {
    return sd.getId() === descriptionId;
  });
};