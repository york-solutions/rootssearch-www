/**
 * Get a list of the updated matched facts, in order.
 * 
 * @returns [{fact, recordFactId, display}]
 */
const selectedMatch = require('./selectedMatch');
const GedcomX = require('../utils/gedcomx');
 
module.exports = function(state){
  const factOrder = state.factOrder[state.currentPerson],
        facts = state.facts[state.currentPerson],
        match = selectedMatch(state),
        {factMap, copiedDates, copiedPlaces, overrideDates, overridePlaces} = match;
        
  return factOrder.map(recordFactId => {
    
    // Copy so that we can make modifications; i.e. be immutable
    const fact = GedcomX.Fact(factMap[recordFactId].toJSON()),
          factId = fact.getId();
    let display = fact.isVital();
    
    // Make any adjustments based on the copied dates and places
    if(copiedDates[recordFactId]){
      fact.setDate(facts[recordFactId].getDate().toJSON());
      display = true;
    }
    if(copiedPlaces[recordFactId]){
      fact.setPlace(facts[recordFactId].getPlace().toJSON());
      display = true;
    }
    
    // Overrides
    if(overrideDates[factId]){
      fact.setDate(overrideDates[factId]);
      display = true;
    }
    if(overridePlaces[factId]){
      fact.setPlace(overridePlaces[factId]);
      display = true;
    }
    
    return {
      recordFactId, 
      fact,
      display
    };
  });
};