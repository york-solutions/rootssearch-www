const GedcomX = require('gedcomx-js');

/**
 * Add a parent to the relationship. Examine the gender to determine whether
 * they are the mother or father. Ignore unknown or missing gender.
 * 
 * @param {GedcomX.Person} parent
 * @returns {GedcomX.ChildAndParentsRelationship} this
 */
GedcomX.ChildAndParentsRelationship.prototype.addParent = function(parent){
  if(parent && parent.getGender() && parent.getId()){
    
    const parentId = parent.getId(),
          gender = parent.getGender().getType(),
          resourceReference = {
            resource: '#' + parentId,
            resourceId: parentId
          };
    
    if(gender === 'http://gedcomx.org/Male'){
      this.setFather(resourceReference);
    }
    else if(gender === 'http://gedcomx.org/Female'){
      this.setMother(resourceReference);
    }
  }
  return this;
};