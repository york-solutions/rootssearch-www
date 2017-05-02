/**
 * Return the current match data block
 */
module.exports = function(state){
  const {currentPerson, matches} = state;
  return matches[currentPerson];
};