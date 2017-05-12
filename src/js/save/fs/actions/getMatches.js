/**
 * Manage the state changes for requesting matches from the FS API
 */

const FS = require('../utils/fs');

module.exports = function(personId){
  return function (dispatch, getState){
  
    dispatch({
      type: 'LOADING_MATCHES',
      personId
    });
  
    const query = createMatchesQuery(getState().gedcomx, personId);
    FS.get(`/platform/tree/matches?${query}`, {
      headers: {
        Accept: 'application/x-gedcomx-atom+json'
      }
    }, function(error, response){
      
      // Here we don't examine the errors directly. If we don't have a response
      // or data then we treat as though the query returned no results.
      dispatch({
        type: 'MATCHES_LOADED',
        matches: response && response.gedcomx ? response.gedcomx.getEntries() : [],
        personId
      });
    });
  };
};

function createMatchesQuery(gedcomx, personId){
  
  const person = gedcomx.getPersonById(personId),
        birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death');
  
  const params = {
    name: person.getDisplayName(true),
    gender: person.getGender().getType() === 'http://gedcomx.org/Female' ? 'female' : 'male'
  };
  
  if(birth){
    params.birthDate = birth.getDateDisplayString();
    params.birthPlace = birth.getPlaceDisplayString();
  }
  
  if(death){
    params.deathDate = death.getDateDisplayString();
    params.deathPlace = death.getPlaceDisplayString();
  }
  
  // Spouse
  let spouse = gedcomx.getPersonsSpouses(personId)[0];
  if(spouse){
    params.spouseName = spouse.getDisplayName(true);
  }
  
  // Father
  let father = gedcomx.getPersonsParents(personId).filter(p => p.isMale())[0];
  if(father){
    params.fatherName = father.getDisplayName(true);
  }
  
  // Mother
  let mother = gedcomx.getPersonsParents(personId).filter(p => p.isFemale())[0];
  if(mother){
    params.fatherName = mother.getDisplayName(true);
  }
  
  // Turn the params object into a valid match query string
  // https://familysearch.org/developers/docs/api/tree/Person_Matches_Query_resource
  return 'q=' + Object.keys(params)
    .map(k => `${k}:"${encodeURIComponent(params[k])}"`)
    .join(' ');
}