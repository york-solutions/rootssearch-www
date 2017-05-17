const currentPersonSelector = require('./currentPerson');

module.exports = function(state, factId){
  const currentPerson = currentPersonSelector(state),
        isCopied = !!currentPerson.selectedMatch.copiedDates[factId];
  return isCopied ? currentPerson.facts[factId].getDateDisplayString() : undefined;
};