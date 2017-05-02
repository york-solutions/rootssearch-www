/**
 * Get the selected match for the current person, if there is one.
 */
module.exports = function(state){
  const {currentPerson, selectedMatches, possibleMatches} = state;
  return possibleMatches[currentPerson].entries[selectedMatches[currentPerson].selectedMatchId];
};