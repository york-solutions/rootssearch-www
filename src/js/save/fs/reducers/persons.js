const update = require('update-immutable').default,
      possibleMatches = require('./possibleMatches'),
      selectedMatch = require('./selectedMatch'),
      currentPersonSelector = require('../selectors/currentPerson');

module.exports = function(state = {}, action){
  const person = currentPersonSelector(state);
  return update(state.persons, {
    [state.currentPersonId]: {
      possibleMatches: {
        $set: possibleMatches(person.possibleMatches, action)
      },
      selectedMatch: {
        $set: selectedMatch(person.selectedMatch, action)
      }
    }
  });
};