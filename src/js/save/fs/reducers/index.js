const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      possibleMatches = require('./possibleMatches'),
      selectedMatches = require('./selectedMatches'),
      currentPerson = require('./currentPerson'),
      echo = state => state || {};

module.exports = combineReducers({
  auth,
  possibleMatches,
  selectedMatches,
  currentPerson,
  gedcomx: echo,
  personOrder: echo,
  persons: echo
});