/**
 * Select a match from the list of possible matches and load their full data
 * from the FS api.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const currentPersonSelector = require('../selectors/currentPerson');

module.exports = function(personId, matchId){
  return function(dispatch, getState){
    
    // Set the state to loading
    dispatch({
      type: 'SELECT_MATCH',
      personId,
      matchId
    });
    
    // Fetch the person
    FS.get(`/platform/tree/persons/${matchId}?relatives=true`, function(error, response){
      
      // When we fail to load the person, cancel the match and show an error
      if(error || response.statusCode !== 200){
        dispatch({
          type: 'LOAD_MATCH_ERROR',
          personId,
          message: `Unable to load person ${matchId}.`
        });
        return;
      }
      
      // Calculate the mapping of record person fact IDs to match person facts.
      // For facts which don't have a match, we must generate IDs. This allows
      // us to track the new fact's state for copying, overrides, normalization, etc.
      // TODO: should this be in the reducer?
      const idGenerator = IDGenerator(),
            state = getState(),
            currentPerson = currentPersonSelector(state),
            recordFacts = currentPerson.facts,
            recordFactsOrder = currentPerson.factOrder,
            matchPerson = response.gedcomx.getPersonById(matchId),
            copiedDates = {},
            copiedPlaces = {},
            factMap = recordFactsOrder.reduce(function(accumulator, recordFactId){
              const recordFact = recordFacts[recordFactId],
                    type = recordFact.getType();
              let matchFact;
              
              // Match vitals on type only since FS only supports on fact per vital
              if(GedcomX.vitals.indexOf(type) !== -1){
                let fact = matchPerson.getFactsByType(type)[0];
                if(fact && fact.getId()){
                  matchFact = fact;
                }
              }
              
              // Match non-vitals by type, date, and place
              // TODO: support fact values
              else {
                matchPerson.getFactsByType(type).forEach(fact => {
                  if(fact.equals(recordFact)){
                    matchFact = fact;
                  }
                });
              }
              
              // If we found no matching vital or if this isn't a vital, then we
              // generate a new ID
              if(matchFact === undefined){
                matchFact = new GedcomX.Fact({
                  id: idGenerator(),
                  type: type
                });
              }
              
              // Automatically copy dates and places that are missing in the tree
              if(!matchFact.getDate()){
                copiedDates[recordFactId] = true;
              }
              if(!matchFact.getPlace()){
                copiedPlaces[recordFactId] = true;
              }
              
              accumulator[recordFact.getId()] = matchFact;
              
              return accumulator;
            }, {});
      
      // Save the person and set the state to loaded
      dispatch({
        type: 'LOADED_MATCH_PERSON',
        personId,
        gedcomx: response.gedcomx,
        factMap,
        copiedDates,
        copiedPlaces
      });
    
    });
  };
};

function IDGenerator(){
  let nextId = 1;
  return () => `NEW_${nextId++}`;
}