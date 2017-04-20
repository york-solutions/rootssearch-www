const Redux = require('redux'),
      reducer = require('./reducer'),
      gedx = require('./gedx');

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(reducer, {
  gedcomx: gedx.massage(gedx.load())
});
module.exports = store;

