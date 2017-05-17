/**
 * Retrieve the selected match data for the current person
 */
const currentPersonSelector = require('./currentPerson') ;
 
module.exports = function(state){
  return currentPersonSelector(state).selectedMatch;
};