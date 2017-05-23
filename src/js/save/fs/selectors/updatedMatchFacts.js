/**
 * Get a list of the updated matched facts, in order.
 * 
 * @returns [{fact, recordFactId, display}]
 */
const GedcomX = require('../utils/gedcomx');
const currentPersonSelector = require('./currentPerson');
 
module.exports = function(state){
  const currentPerson = currentPersonSelector(state),
        {factOrder, facts} = currentPerson,
        match = currentPerson.selectedMatch,
        {factMap, copiedDates, copiedPlaces, overrideDates, overridePlaces, reasons} = match;
        
  return factOrder.map(recordFactId => {
    
    // Copy so that we can make modifications; i.e. be immutable
    const fact = GedcomX.Fact(factMap[recordFactId].toJSON()),
          factId = fact.getId(),
          originalAttribution = fact.getAttribution();
    let display = fact.isVital(),
        modified = false;
    
    // Make any adjustments based on the copied dates and places
    if(copiedDates[recordFactId]){
      fact.setDate(facts[recordFactId].getDate().toJSON());
      modified = display = true;
    }
    if(copiedPlaces[recordFactId]){
      fact.setPlace(facts[recordFactId].getPlace().toJSON());
      modified = display = true;
    }
    
    // Overrides
    if(overrideDates[factId]){
      fact.setDate(overrideDates[factId]);
      modified = display = true;
    }
    if(overridePlaces[factId]){
      fact.setPlace(overridePlaces[factId]);
      modified = display = true;
    }
    
    if(reasons[factId]){
      fact.setAttribution({
        changeMessage: reasons[factId]
      });
    }
    
    return {
      recordFactId, 
      fact,
      display,
      modified,
      originalAttribution
    };
  });
};