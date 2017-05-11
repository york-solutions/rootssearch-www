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
          match = state.selectedMatches[personId],
          matchId = match.matchId;
    
    // Set the state to saving
    dispatch({
      type: 'SAVE_MATCH',
      personId
    });
    
    const personUpdates = calculatePersonUpdates(state, personId);
    
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
  };
};

/**
 * Generate a list of changes to the person.
 * 
 * TODO: technically this is a selector, right?
 */
function calculatePersonUpdates(state, personId){
  const updates = {
    facts: calculateFactUpdates(state, personId),
    names: calculateNameUpdates(state, personId)
  };
  return updates;
}

/**
 * Generate the list of changed names
 */
function calculateNameUpdates(state, personId){
  const recordPerson = state.persons[personId],
        recordName = recordPerson.getPreferredName(),
        recordNameParts = namePartsMap(recordName),
        match = state.selectedMatches[personId],
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
      }]
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
function calculateFactUpdates(state, personId){
  const factOrder = state.factOrder[personId],
        facts = state.facts[personId],
        match = state.selectedMatches[personId],
        factMap = match.factMap;
  
  // Filter fact ID list to just those facts that are being copied
  // TODO: allow the user to modify matched vitals without copying
  factOrder.filter(factId => {
    return match.copiedDates[factId] || match.copiedPlaces[factId];
  })
  
  // Assemble fact updates
  .map(factId => {
    
    // First we copy the fact so that we don't modify the originals
    const matchFact = GedcomX.Fact(factMap[factId].toJSON()),
          matchFactId = matchFact.getId();
    let date, place;
    
    // Make any adjustments based on the copied dates and places
    if(match.copiedDates[factId]){
      matchFact.setDate(facts[factId].getDate().toJSON());
    }
    if(match.copiedPlaces[factId]){
      matchFact.setPlace(facts[factId].getPlace().toJSON());
    }
    
    date = matchFact.getDate();
    place = matchFact.getPlace();
    
    // Overrides
    if(match.overrideDates[matchFactId]){
      date.setOriginal(match.overrideDates[matchFactId]);
    }
    if(match.overridePlaces[matchFactId]){
      place.setOriginal(match.overridePlaces[matchFactId]);
    }
    
    // Add normalized data
    if(match.normalizedDates[matchFactId]){
      if(match.normalizedDates[matchFactId].formal){
        date.setFormal(match.normalizedDates[matchFactId].formal);
      }
      if(match.normalizedDates[matchFactId].normalized){
        date.setNormalized([{
          value: match.normalizedDates[matchFactId].normalized
        }]);
      }
    }
    if(match.normalizedPlaces[matchFactId]){
      place.setNormalized([{
        value: match.normalizedPlaces[matchFactId]
      }]);
      place.setOriginal(match.normalizedPlaces[matchFactId]);
    }
    
    // Delete IDs on new facts
    if(matchFact.getId().substring(0, 4) === 'NEW_'){
      matchFact.setId();
    }
    
    // Add to the update object
    return matchFact;
    
  });
}