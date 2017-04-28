/**
 * Return true if a match has been selected for the current person
 */
module.exports = function(state){
  const { currentPerson, matches } = state;
  return !!matches[currentPerson].match;
};