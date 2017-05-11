/**
 * Save a match.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');

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
    
    });
  };
};

/**
 * Generate a list of changes to the person.
 * 
 * First we check the copied maps.
 * If a fact isn't being copied then we skip it.
 * For all facts being copied, we examine the overrides and normalized maps
 * to construct the resulting fact data.
 * If the fact is new then we delete the ID so that FS knows it's new.
 * TODO: technically this is a selector, right?
 */
function calculatePersonUpdates(state, personId){
  const updates = {
    facts: []
  };
  
  const factOrder = state.factOrder[personId],
        facts = state.facts[personId],
        match = state.selectedMatches[personId],
        factMap = match.factMap;
  
  // Filter fact ID list to just those facts that are being copied
  factOrder.filter(factId => {
    return match.copiedDates[factId] || match.copiedPlaces[factId];
  })
  
  // Assemble fact updates
  .forEach(factId => {
    
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
    updates.facts.push(matchFact);
    
  });
  
  return updates;
}