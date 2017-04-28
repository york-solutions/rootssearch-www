/**
 * Return true if a match has been selected for the current person
 */
module.exports = function(state){
  const { currentPersonIndex, matches } = state;
  return !!matches[currentPersonIndex].match
};