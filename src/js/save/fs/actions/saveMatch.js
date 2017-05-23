/**
 * Save a match.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const nextPersonAction = require('./nextPerson');
const namePartsMap = require('../selectors/namePartsMap');

module.exports = function(personId){
  return function(dispatch, getState){
    
    const state = getState(),
          person = state.persons[personId],
          matchId = person.selectedMatch.matchId;
    
    // Set the state to saving
    dispatch({
      type: 'SAVE_MATCH',
      personId
    });
    
    const personUpdates = calculatePersonUpdates(person);
    
    // Create a source, if we haven't already created one
    getSourceDescriptionUrl(state, function(error, sourceDescriptionUrl){
      
      // TODO: error handling
      
      dispatch({
        type: 'SOURCE_DESCRIPTION_URL',
        url: sourceDescriptionUrl
      });
      
      // Setup the source reference
      personUpdates.sources = [{
        description: sourceDescriptionUrl
        // TODO: tags, changeMessage
      }];
    
      // Update the person
      FS.post(`/platform/tree/persons/${matchId}`, {
        body: {
          persons: [ personUpdates ]
        }
      }, function(error, response){
        
        // TODO: error handling
            
        // Save the person and set the state to loaded
        dispatch({
          type: 'MATCH_SAVED',
          personId
        });
        
        dispatch(nextPersonAction());
            
      });
    
    });
  };
};

/**
 * Generate a list of changes to the person.
 * 
 * TODO: technically this is a selector, right?
 */
function calculatePersonUpdates(person){
  const updates = {
    facts: calculateFactUpdates(person),
    names: calculateNameUpdates(person)
  };
  return updates;
}

/**
 * Generate the list of changed names
 */
function calculateNameUpdates(person){
  const recordPerson = person.gedcomx,
        recordName = recordPerson.getPreferredName(),
        recordNameParts = namePartsMap(recordName),
        match = person.selectedMatch,
        reason = match.nameReason,
        matchName = match.gedcomx.getPersonById(match.matchId).getPreferredName(),
        matchNameParts = namePartsMap(matchName),
        copiedParts = match.copyName ? recordNameParts : {};
        
  // Has anything changed?
  if(Object.keys(copiedParts).length === 0 && Object.keys(match.overrideName).length === 0) {
    return [];
  }
  
  // Generate name parts by seeding with original match name parts so that the
  // user could override just one part but not the others
  const newNamePartsMap = Object.assign({}, matchNameParts, copiedParts, match.overrideName),
        newNameParts = Object.keys(newNamePartsMap).map(type => {
          return {
            type,
            value: newNamePartsMap[type]
          };
        });
        
  return [
    GedcomX.Name({
      preferred: true,
      id: matchName.getId(),
      nameForms: [{
        parts: newNameParts
      }],
      attribution: {
        changeMessage: reason
      }
    }) 
  ];
}

/**
 * Generate a list of fact updates for the matched person.
 * 
 * First we check the copied maps.
 * If a fact isn't being copied then we skip it.
 * For all facts being copied, we examine the overrides and normalized maps
 * to construct the resulting fact data.
 * If the fact is new then we delete the ID so that FS knows it's new.
 */
function calculateFactUpdates(person){
  const factOrder = person.factOrder,
        facts = person.facts,
        match = person.selectedMatch,
        {factMap, factReasons} = match;
  
  // Filter fact ID list to just those facts that are being copied
  // TODO: allow the user to modify matched vitals without copying. Right now
  // vitals are matched and can be modified without copying but the code here 
  // ignores facts that aren't marked for copying
  return factOrder.filter(factId => {
    return match.copiedDates[factId] || match.copiedPlaces[factId];
  })
  
  // Assemble fact updates
  .map(factId => {

    // First we copy the fact so that we don't modify the originals
    const matchFact = GedcomX.Fact(factMap[factId].toJSON()),
          matchFactId = matchFact.getId();
    
    // Make any adjustments based on the copied dates and places
    if(match.copiedDates[factId]){
      matchFact.setDate(facts[factId].getDate().toJSON());
    }
    if(match.copiedPlaces[factId]){
      matchFact.setPlace(facts[factId].getPlace().toJSON());
    }
    
    // Overrides
    if(match.overrideDates[matchFactId]){
      matchFact.setDate(match.overrideDates[matchFactId]);
    }
    if(match.overridePlaces[matchFactId]){
      matchFact.setPlace(match.overridePlaces[matchFactId]);
    }
    
    // Delete IDs on new facts
    if(matchFact.getId().substring(0, 4) === 'NEW_'){
      matchFact.setId();
    }
    
    if(factReasons[matchFactId]){
      matchFact.setAttribution({
        changeMessage: factReasons[matchFactId]
      });
    }
    
    // Add to the update object
    return matchFact;
    
  })
  
  // FS doesn't support all GEDCOM X spec types so here we convert unsupported
  // types into custom types, or closely related types that are supported
  .map(fact => {
    const type = fact.getType();
    
    // Convert Census to Residence
    if(type === 'http://gedcomx.org/Census'){
      fact.setType('http://gedcomx.org/Residence');
    }
    
    // Convert all other unsupported fact types to custom types
    else if(FS.supportedFactTypes.indexOf(type) === -1){
      fact.setType('data:,' + encodeURIComponent(type.replace('http://gedcomx.org/', '')));
    }
    
    return fact;
  });
}

/**
 * Create a source description (if we haven't already)
 * and return the source description's URL.
 * 
 * @param {Function} callback function(error, sourceDescriptionUrl)
 */
function getSourceDescriptionUrl(state, callback){
  
  // Return the source description URL if we already have it
  if(state.sourceDescriptionUrl){
    setTimeout(function(){
      callback(null, state.sourceDescriptionUrl);
    });
  } 
  
  // Create a source description if we don't already have one
  else {
    FS.post('/platform/sources/descriptions', {
      body: {
        sourceDescriptions: [ calculateSourceDescription(state) ]
      }
    }, function(error, response){
      callback(error, response ? response.headers.location : undefined);
    });
  }
}

/**
 * Get the source description for the record.
 */
function calculateSourceDescription(state){
  const gedcomx = state.record,
        aboutId = gedcomx.getDescription().replace('#', '');
  return gedcomx.getSourceDescriptions().find(sd => {
    return sd.getId() === aboutId;
  });
}