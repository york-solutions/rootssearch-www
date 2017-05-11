const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      busy = require('./busy'),
      possibleMatches = require('./possibleMatches'),
      selectedMatches = require('./selectedMatches'),
      currentPerson = require('./currentPerson'),
      echo = state => state || {};

module.exports = combineReducers({
  auth,
  busy,
  possibleMatches,
  selectedMatches,
  currentPerson,
  gedcomx: echo,
  personOrder: echo,
  persons: echo,
  facts: echo,
  factOrder: echo
});