/**
 * Load and configure the gedcomx-js library.
 * Setup extensions to the gedcomx-js library.
 * Expose helper utitilies.
 */

const GedcomX = require('gedcomx-js');
GedcomX.enableRsExtensions();
GedcomX.enableRecordsExtensions();
GedcomX.enableAtomExtensions();
GedcomX.addExtensions(require('gedcomx-fs-js'));

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

module.exports = {
  
  /**
   * Get the GEDCOM X data off the page, if it exists
   */
  load: function(){
  
    let data;
      
    // gedxData is supposed to be included on the page but to be safe we're going make sure it's there
    if(typeof gedxData !== 'undefined'){
      data = gedxData;
    } else {
      data = {};
    }
    
    let gedx = GedcomX(data);
    clean(gedx);
    
    return gedx;
  }
};
  
/**
 * Massage the GEDCOM X data so that
 * - all persons have IDs (the only case where persons could have no ID is when
 *   they aren't part of a relationship; don't need an ID if nothing references you)
 */
function clean(gedx){
  
  // Make sure all persons have IDs. Get a list of existing IDs to make sure
  // any of our generated IDs don't conflict with existing IDs.
  let ids = gedx.getPersons().filter(p => p.getId() !== undefined).map(p => p.getId()),
      id = 0;
  gedx.getPersons().forEach(p => {
    
    // If a person doesn't have an ID...
    if(!p.getId()){
      
      // Loop until we find an ID that's not being used
      while(ids.indexOf(++id) !== -1){ }
      
      // Set and increment the ID
      p.setId(id);
    }
  });
}

/**
 * Get a person's display name. Optionally calculate a display name if one
 * isn't set in the display properties.
 * 
 * @param {Boolean=} calculateIfMissing Calculate the display name if one isn't
 * set in the display properties.
 * @returns {String} display name
 */
GedcomX.Person.prototype.getDisplayName = function(calculateIfMissing){
  let displayName = '';
  
  if(this.getDisplay()){
    displayName = this.getDisplay().getName();
  }
  
  if(!displayName && calculateIfMissing){
    
    // Choose the preferred name or the first name
    let name = this.getPreferredName() || this.getNames()[0];
    
    // Calculate the name
    if(name){
      displayName = name.getFullText();
    }
  }
  
  return displayName;
};

/**
 * Calculate the full text string of a name.
 * 
 * @returns {String} full text
 */
GedcomX.Name.prototype.getFullText = function(){
  let fullText = '';
  let nameForm = this.getNameForms()[0];
  if(nameForm){
    fullText = nameForm.getFullText(true);
  }
  return fullText;
};

/**
 * Get the first fact of a given type, if one exists
 * 
 * @param {String} type
 * @returns {Fact}
 */
GedcomX.Person.prototype.getFact = function(type){
  return this.getFactsByType(type)[0];
};

/**
 * Generate a display version of a string, when possible
 * 
 * @returns {String}
 */
GedcomX.Date.prototype.getDisplayString = function(){
  
  // Check for a normalized date
  if(this.getNormalized().length > 0){
    return this.getNormalized()[0].getValue();
  }
  
  // Parse the formal value if set
  if(this.getFormal()){
    let date = new Date(this.getFormal().replace('+',''));
    if(!isNaN(date.getTime())){
      return [date.getDate(), months[date.getMonth()], date.getFullYear()].join(' ');
    }
  }
  
  // Just return what we have if nothing else works
  return this.getOriginal();
};

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
 * Get a place name from a place
 * 
 * @returns {String}
 */
GedcomX.PlaceReference.prototype.getDisplayString = function(){
  if(this.getNormalized().length > 0){
    return this.getNormalized()[0].getValue();
  } else {
    return this.getOriginal();
  }
};

/**
 * COMPARING RESOURCEREFERENCES
 * https://github.com/rootsdev/gedcomx-js/issues/33
 * 
 * Override problematic methods discussed in the above issue. We can better
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