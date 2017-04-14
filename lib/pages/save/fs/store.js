const Redux = require('redux'),
      reducer = require('./reducer');

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(reducer, {});
module.exports = store;