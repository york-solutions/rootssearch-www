/**
 * Get the selected match for the current person, if there is one.
 */
const matchDataSelector = require('./matchData');

module.exports = function(state){
  const matchData = matchDataSelector(state);
  return matchData.entries[matchData.selectedMatchId];
};