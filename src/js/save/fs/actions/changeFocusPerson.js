/**
 * Manage state changes when we change focus to a different record person
 */
const getMatches = require('./getMatches') ;
 
module.exports = function(personIndex){
  return function(dispatch, getState){
    
    dispatch({
      type: 'FOCUS_PERSON',
      personIndex
    });
    
    const state = getState(),
          persons = state.gedcomx.persons,
          matches = state.matches;
    
    // Only request matches if they haven't already been requested
    if(matches[personIndex].status === 'NOT_REQUESTED'){
      dispatch(getMatches(persons[personIndex]));
    }
  };
};