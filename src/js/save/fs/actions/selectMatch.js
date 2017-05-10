/**
 * Select a match from the list of possible matches and load their full data
 * from the FS api.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const slimFacts = require('../selectors/slimFacts');

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
      
      // TODO: error handling
      
      // Calculate the mapping of record person fact IDs to match person fact IDs.
      // For facts which don't have a match, we must generate IDs. This allows
      // us to track the new fact's state for copying, overrides, normalization, etc.
      // TODO: should this be in the reducer?
      const idGenerator = IDGenerator(),
            state = getState(),
            recordFacts = state.facts[personId],
            recordFactsOrder = state.factOrder[personId],
            matchPerson = response.gedcomx.getPersonById(matchId),
            factMap = recordFactsOrder.reduce(function(accumulator, recordFactId){
              const recordFact = recordFacts[recordFactId],
                    type = recordFact.getType();
              let matchFactId;
              
              // Search for a matching vital
              if(GedcomX.vitals.indexOf(type) !== -1){
                let fact = matchPerson.getFactsByType(type)[0];
                if(fact && fact.getId()){
                  matchFactId = fact.getId();
                }
              }
              
              // If we found no matching vital or if this isn't a vital, then we
              // generate a new ID
              if(matchFactId === undefined){
                matchFactId = idGenerator();
              }
              
              accumulator[recordFact.getId()] = matchFactId;
              
              return accumulator;
            }, {});
      
      // Save the person and set the state to loaded
      dispatch({
        type: 'LOADED_MATCH_PERSON',
        personId,
        gedcomx: response.gedcomx,
        factMap: factMap
      });
    
    });
  };
};

function IDGenerator(){
  let nextId = 1;
  return () => `NEW_${nextId++}`;
}