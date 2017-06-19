/**
 * Wrapper around gedcomx-js
 * 
 * Load and configure the gedcomx-js library.
 * Setup extensions to the gedcomx-js library.
 * Expose helper utitilies.
 */

const uuid = require('../uuid');

const GedcomX = require('gedcomx-js');
GedcomX.enableRsExtensions();
GedcomX.enableRecordsExtensions();
GedcomX.enableAtomExtensions();
GedcomX.addExtensions(require('gedcomx-fs-js'));

/**
 * Custom extensions
 */

require('./Date');
require('./Fact');
require('./Name');
require('./Person');
require('./PlaceReference');
require('./ResourceReference');
require('./Root');

/**
 * Get the GEDCOM X data off the page, if it exists
 */
GedcomX.load = function(){
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
};
  
GedcomX.vitals = [
  'http://gedcomx.org/Birth',
  'http://gedcomx.org/Christening',
  'http://gedcomx.org/Death',
  'http://gedcomx.org/Burial'
];
  
/**
 * Massage the GEDCOM X data so that
 * 
 * - all persons have an ID (the only case where persons could have no ID is when
 *   they aren't part of a relationship; don't need an ID if nothing references you)
 * - all facts have an ID
 * - all names have an ID
 */
function clean(gedx){
  
  const ensureID = (obj) => {
    if(!obj.getId()){
      obj.setId(uuid());
    }
  };
  
  // Make sure all persons have an ID
  gedx.getPersons().forEach(person => {
    
    ensureID(person);
    
    // Make sure all their facts have IDs
    person.getFacts().forEach(ensureID);
    
    // Make sure all their names have IDs
    person.getNames().forEach(ensureID);
  });
}

module.exports = GedcomX;