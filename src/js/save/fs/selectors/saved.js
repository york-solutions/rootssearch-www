/**
 * Return true if a match has been saved for the current person
 */
const selectedMatchSelector = require('./selectedMatch');

module.exports = function(state){
  return selectedMatchSelector(state).saved;
};