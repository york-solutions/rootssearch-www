const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      matches = require('./matches'),
      gedcomx = require('./gedcomx'),
      currentPerson = require('./currentPerson');

module.exports = combineReducers({
  auth,
  matches,
  currentPerson,
  gedcomx
});