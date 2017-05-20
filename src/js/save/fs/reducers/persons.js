const update = require('update-immutable').default,
      possibleMatches = require('./possibleMatches'),
      selectedMatch = require('./selectedMatch'),
      personSelector = require('../selectors/person');

module.exports = function(state = {}, action){
  const personId = action.personId || state.currentPersonId,
        person = personSelector(state, personId);
  return update(state.persons, {
    [personId]: {
      possibleMatches: {
        $set: possibleMatches(person.possibleMatches, action)
      },
      selectedMatch: {
        $set: selectedMatch(person.selectedMatch, action)
      }
    }
  });
};