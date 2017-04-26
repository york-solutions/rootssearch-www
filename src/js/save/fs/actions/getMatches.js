/**
 * Manage the state changes for requesting matches from the FS API
 */

const FS = require('../fs');

module.exports = function(person){
  return function (dispatch){
  
    dispatch({
      type: 'LOADING_MATCHES',
      personId: person.getId()
    });
  
    const query = createMatchesQuery(person);
    FS.get(`/platform/tree/matches?${query}`, {
      headers: {
        Accept: 'application/x-gedcomx-atom+json'
      }
    }, function(error, response){
      // TODO: handle error
      dispatch({
        type: 'MATCHES_LOADED',
        matches: response.gedcomx ? response.gedcomx.getEntries() : [],
        personId: person.getId()
      });
    });
  };
};

function createMatchesQuery(person){
  
  const birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death');
  
  const params = {
    name: person.getDisplayName(true),
    gender: person.getGender().getType() === 'http://gedcomx.org/Female' ? 'female' : 'male',
    birthDate: birth.getDateDisplayString(),
    birthPlace: birth.getPlaceDisplayString(),
    deathDate: death.getDateDisplayString(),
    deathPlace: death.getPlaceDisplayString()
  };
  
  // TODO: process relationships
  
  // Turn the params object into a valid match query string
  // https://familysearch.org/developers/docs/api/tree/Person_Matches_Query_resource
  return 'q=' + Object.keys(params)
    .map(k => `${k}:"${encodeURIComponent(params[k])}"`)
    .join(' ');
}