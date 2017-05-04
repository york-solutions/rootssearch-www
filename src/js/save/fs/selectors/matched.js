/**
 * Return true if a match has been selected for the current person
 */

module.exports = function(state){
  const {selectedMatches, currentPerson} = state;
  return !!selectedMatches[currentPerson].matchId;
};