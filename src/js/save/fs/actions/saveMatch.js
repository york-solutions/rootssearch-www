/**
 * Save a match.
 */

const FS = require('../utils/fs');

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
    
    // Generate a list of changes to the person
    return;
    
    // Update the person
    FS.post(`/platform/tree/persons/${matchId}`, function(error, response){
      
      // TODO: error handling
      
      // Save the person and set the state to loaded
      dispatch({
        type: 'MATCH_SAVED',
        personId
      });
    
    });
  };
};