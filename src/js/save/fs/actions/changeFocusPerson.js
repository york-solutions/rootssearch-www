/**
 * Manage state changes when we change focus to a different record person
 */
const getMatches = require('./getMatches');
const currentPersonSelector = require('../selectors/currentPerson');
 
module.exports = function(personId){
  return function(dispatch, getState){

    const state = getState(),
          currentPerson = currentPersonSelector(state),
          { personOrder } = state;
          
    if(personId === undefined){
      personId = personOrder[0];
    }
    
    dispatch({
      type: 'FOCUS_PERSON',
      personId
    });
    
    // Only request matches if they haven't already been requested
    if(currentPerson.possibleMatches.status === 'NOT_REQUESTED'){
      dispatch(getMatches(personId));
    }
  };
};