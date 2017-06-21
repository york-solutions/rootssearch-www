/**
 * Manage state changes when we change focus to a different record person
 */
const getMatches = require('./getMatches');
const currentPersonSelector = require('../selectors/currentPerson');
 
module.exports = function(personId){
  return function(dispatch, getState){

    const state = getState(),
          { personOrder } = state;
          
    if(personId === undefined){
      personId = personOrder[0];
    }
    
    dispatch({
      type: 'FOCUS_PERSON',
      personId
    });
    
    // After the focus person is updated we recalculate the current person
    // and check to see if we should load their matches
    const currentPerson = currentPersonSelector(getState());
    
    // Only request matches if they haven't already been requested
    if(currentPerson.possibleMatches.status === 'NOT_REQUESTED'){
      dispatch(getMatches(personId));
    }
  };
};