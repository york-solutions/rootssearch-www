const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      matches = require('./matches'),
      currentPerson = require('./currentPerson'),
      echo = state => state || {};

module.exports = combineReducers({
  auth,
  matches,
  currentPerson,
  gedcomx: echo,
  personOrder: echo,
  persons: echo
});