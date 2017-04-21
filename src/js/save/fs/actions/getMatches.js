/**
 * Manage the state changes for requesting matches from the FS API
 */

const FS = require('../fs');

module.exports = function(person){
  return function (dispatch){
  
    dispatch({
      type: 'REQUESTING_MATCHES'
    });
  
    const query = createMatchesQuery(person);
    FS.get(`/platform/tree/matches?${query}`, {
      headers: {
        Accept: 'application/x-gedcomx-atom+json'
      }
    }, function(error, response){
      
      // TODO: handle error
      
      if(response.gedcomx){
        dispatch({
          type: 'MATCHES_LOADED',
          matches: response.gedcomx.getEntries()
        });
      }
    });
  };
};

function createMatchesQuery(person){
  
  const params = {
    name: person.getDisplayName(true)
  };
  
  // TODO: process relationships
  
  // Turn the params object into a valid match query string
  // https://familysearch.org/developers/docs/api/tree/Person_Matches_Query_resource
  return 'q=' + Object.keys(params)
    .map(k => `${k}:${encodeURIComponent(params[k])}`)
    .join(' ');
}