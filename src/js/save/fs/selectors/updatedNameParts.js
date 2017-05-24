/**
 * Calculate the updated name parts for the current person and match.
 */
const namePartsMap = require('./namePartsMap');
const currentPersonSelector = require('./currentPerson');

module.exports = function(state){
  const currentPerson = currentPersonSelector(state),
        recordPerson = currentPerson.gedcomx,
        match = currentPerson.selectedMatch;
  return Object.assign({},
    match.gedcomx ? namePartsMap(match.gedcomx.getPersonById(match.matchId).getPreferredName()) : {},
    match.copyName ? namePartsMap(recordPerson.getPreferredName()) : {},
    match.overrideName
  );
};