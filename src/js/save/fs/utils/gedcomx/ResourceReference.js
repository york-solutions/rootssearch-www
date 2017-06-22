const GedcomX = require('gedcomx-js');

/**
 * COMPARING RESOURCEREFERENCES
 * https://github.com/rootsdev/gedcomx-js/issues/33
 * 
 * Override problematic methods discussed in the above issue. We can make better
 * assumptions tied to our specific context (FS API).
 */
 
/**
 * Check whether this reference matches the given resource.
 * 
 * @param {Base|String} resource Resource or ID
 * @return {Boolean}
 */
GedcomX.ResourceReference.prototype.matches = function(resource){
  if(resource === undefined){
    return false;
  }
  
  // If we have a resource object then get it's ID. Otherwise assume we were
  // given an ID.
  var id = typeof resource === 'string' ? resource : resource.getId();
  
  return this.getResourceId() === id;
};

/**
 * Make sure the resourceId is set, when possible. We can't set it if resource
 * is a full URI, only if it's a local doc ref that starts with #. When a full
 * URI is present we don't know how to parse out the ID.
 */
GedcomX.ResourceReference.prototype.ensureResourceId = function(){
  const resource = this.getResource();
  if(!this.getResourceId() && typeof resource === 'string' && resource.indexOf(0) === '#'){
    this.setResourceId(resource.substring(1));
  }
};