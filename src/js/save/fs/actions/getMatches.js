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
  
    const query = createMatchesQuery(getState(), personId);
    
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

/**
 * Generate a matches query
 * https://familysearch.org/developers/docs/api/tree/Person_Matches_Query_resource
 * 
 * @param {Object} state
 * @param {String} personId
 * @returns {String} query
 */
function createMatchesQuery(state, personId){
  
  const gedcomx = state.record,
        person = gedcomx.getPersonById(personId),
        gender = person.getGender(),
        birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death');
  
  const params = {
    name: person.getDisplayName(true)
  };
  
  if(gender){
    params.gender = gender.getType() === 'http://gedcomx.org/Female' ? 'female' : 'male';
  }
  
  if(birth){
    params.birthDate = birth.getDateDisplayString();
    params.birthPlace = birth.getPlaceDisplayString();
  }
  
  if(death){
    params.deathDate = death.getDateDisplayString();
    params.deathPlace = death.getPlaceDisplayString();
  }
  
  // Spouse
  const spouse = gedcomx.getPersonsSpouses(personId)[0];
  if(spouse){
    const matchedSpouseId = matchedPersonId(state, spouse.getId());
    if(matchedSpouseId){
      params.spouseId = matchedSpouseId;
    } else {
      params.spouseName = spouse.getDisplayName(true);
    }
  }
  
  // Father
  const father = gedcomx.getPersonsParents(personId).filter(p => p.isMale())[0];
  if(father){
    const matchedFatherId = matchedPersonId(state, father.getId());
    if(matchedFatherId){
      params.fatherId = matchedFatherId;
    } else {
      params.fatherName = father.getDisplayName(true);
    }
  }
  
  // Mother
  const mother = gedcomx.getPersonsParents(personId).filter(p => p.isFemale())[0];
  if(mother){
    const matchedMotherId = matchedPersonId(state, mother.getId());
    if(matchedMotherId){
      params.motherId = matchedMotherId;
    } else {
      params.motherName = mother.getDisplayName(true);
    }
  }
  
  // Turn the params object into a valid match query string
  // https://familysearch.org/developers/docs/api/tree/Person_Matches_Query_resource
  return 'q=' + Object.keys(params)
    .filter(k => params[k]) // removed undefined values
    .map(k => `${k}:"${encodeURIComponent(params[k])}"`)
    .join(' ');
}

/**
 * Get the matched personId for a record person if they've been saved.
 * 
 * @param {Object} state
 * @param {String} personId record person ID
 * @returns {String} matched person ID iff they've been matched and saved
 */
function matchedPersonId(state, personId){
  if(state.persons[personId].selectedMatch.matchId && state.persons[personId].selectedMatch.saved){
    return state.persons[personId].selectedMatch.matchId;
  }
}