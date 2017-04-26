const combineReducers = require('redux').combineReducers;
const auth = require('./auth'),
      matches = require('./matches'),
      gedcomx = require('./gedcomx'),
      currentPersonIndex = require('./currentPersonIndex');

module.exports = combineReducers({
  auth,
  matches,
  currentPersonIndex,
  gedcomx
});