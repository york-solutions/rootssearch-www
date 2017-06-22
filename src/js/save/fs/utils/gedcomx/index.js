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
require('./Relationship');
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

// See https://familysearch.org/developers/docs/guides/facts
const FSSupportedFactTypes = [
  'http://gedcomx.org/Birth',
  'http://gedcomx.org/Christening',
  'http://gedcomx.org/Death',
  'http://gedcomx.org/Burial',
  'http://gedcomx.org/Stillbirth',
  'http://gedcomx.org/BarMitzvah',
  'http://gedcomx.org/BatMitzvah',
  'http://gedcomx.org/MilitaryService',
  'http://gedcomx.org/Naturalization',
  'http://gedcomx.org/Residence',
  'http://gedcomx.org/Religion',
  'http://gedcomx.org/Occupation',
  'http://gedcomx.org/Cremation',
  'http://gedcomx.org/Caste',
  'http://gedcomx.org/Clan',
  'http://gedcomx.org/NationalId',
  'http://gedcomx.org/Nationality',
  'http://gedcomx.org/PhysicalDescription',
  'http://gedcomx.org/Ethnicity',
  'http://familysearch.org/v1/Affiliation',
  'http://familysearch.org/v1/BirthOrder',
  'http://familysearch.org/v1/DiedBeforeEight',
  'http://familysearch.org/v1/LifeSketch',
  'http://familysearch.org/v1/TitleOfNobility',
  'http://familysearch.org/v1/TribeName',
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
    
    // FS doesn't support all GEDCOM X spec types so here we convert unsupported
    // types into custom types, or closely related types that are supported.
    // We do this on load instead of on save so that we can accurately compare
    // the record data to the tree data
    person.getFacts().forEach(fact => {
      const type = fact.getType();
      
      // Convert Census to Residence
      if(type === 'http://gedcomx.org/Census'){
        fact.setType('http://gedcomx.org/Residence');
      }
      
      // Convert all other unsupported fact types to custom types
      else if(FSSupportedFactTypes.indexOf(type) === -1){
        fact.setType('data:,' + encodeURIComponent(type.replace('http://gedcomx.org/', '')));
      }
    });
    
    // Make sure all their names have IDs
    person.getNames().forEach(ensureID);
  });
  
  // Make sure all ResourceReferences in rels have both resource and resourceId (makes our life easy)
  gedx.getRelationships().forEach(rel => {
    rel.getPerson1().ensureResourceId();
    rel.getPerson2().ensureResourceId();
  });
}

module.exports = GedcomX;