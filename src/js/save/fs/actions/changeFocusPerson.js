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
    let persons = getState().gedcomx.persons;
    dispatch(getMatches(persons[personIndex]));
  };
};