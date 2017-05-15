/**
 * Calculate the updated name parts for the current person and match.
 */
const namePartsMap = require('./namePartsMap');
const selectedMatch = require('./selectedMatch');
 
module.exports = function(state){
  const recordPerson = state.persons[state.currentPerson],
        match = selectedMatch(state);
  return Object.assign({},
    namePartsMap(match.gedcomx.getPersonById(match.matchId).getPreferredName()),
    match.copyName ? namePartsMap(recordPerson.getPreferredName()) : {},
    match.overrideName
  );
};