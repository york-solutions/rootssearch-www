/**
 * Select a match from the list of possible matches and load their full data
 * from the FS api.
 */

const FS = require('../fs');

module.exports = function(personId, matchId){
  return function(dispatch){
    
    // Set the state to loading
    dispatch({
      type: 'SELECT_MATCH',
      personId,
      matchId
    });
    
    // Fetch the person
    FS.get(`/platform/tree/persons/${matchId}?relatives=true`, function(error, response){
      
      // TODO: error handling
      
      // Save the person and set the state to loaded
      dispatch({
        type: 'LOADED_MATCH_PERSON',
        personId,
        gedcomx: response.gedcomx
      });
    
    });
  };
};