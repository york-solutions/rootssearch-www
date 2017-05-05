const selectedMatchSelector = require('./selectedMatch');

module.exports = function(state, factId){
  const isCopied = !!selectedMatchSelector(state).copiedDates[factId];
  return isCopied ? state.persons[state.currentPerson]
    .getFacts()
    .find(f => f.getId() === factId)
    .getDateDisplayString() : undefined;
};