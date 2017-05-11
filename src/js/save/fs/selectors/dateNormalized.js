const selectedMatchSelector = require('./selectedMatch');

module.exports = function(state, factId){
  const normalized = selectedMatchSelector(state).normalizedDates[factId];
  if(normalized){
    return normalized.normalized;
  }
};