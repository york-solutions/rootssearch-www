const selectedMatchSelector = require('./selectedMatch');
const currentPersonSelector = require('./currentPerson');

module.exports = function(state, factId){
  const currentPerson = currentPersonSelector(state),
        isCopied = !!selectedMatchSelector(state).copiedPlaces[factId];
  return isCopied ? currentPerson[factId].getPlaceDisplayString() : undefined;
};