const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      busy = require('./busy'),
      possibleMatches = require('./possibleMatches'),
      selectedMatches = require('./selectedMatches'),
      currentPerson = require('./currentPerson'),
      modal = require('./modal'),
      echo = state => state || {};

module.exports = combineReducers({
  auth,
  busy,
  modal,
  possibleMatches,
  selectedMatches,
  currentPerson,
  record: echo,
  personOrder: echo,
  persons: echo,
  facts: echo,
  factOrder: echo
});