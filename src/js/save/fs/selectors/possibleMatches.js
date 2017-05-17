const currentPersonSelector = require('./currentPerson');

module.exports = function(state){
  return currentPersonSelector(state).possibleMatches;  
};