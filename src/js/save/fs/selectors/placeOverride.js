const selectedMatchSelector = require('./selectedMatch');

module.exports = function(state, factId){
  return selectedMatchSelector(state).overridePlaces[factId];
};