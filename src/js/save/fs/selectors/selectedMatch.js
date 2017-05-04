/**
 * Retrieve the selected match data for the current person
 */
module.exports = function(state){
  const {selectedMatches, currentPerson} = state;
  return selectedMatches[currentPerson];
};