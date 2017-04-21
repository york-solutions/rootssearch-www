const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducer'),
      gedx = require('./gedx');

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(
  reducer, 
  {
    currentPerson: 0,
    step: 'MATCHING',
    auth: {
      inProgress: false
    },
    gedcomx: gedx.load(),
    matches: {
      state: 'NOT_REQUESTED',
      entries: []
    }
  },
  Redux.applyMiddleware(thunk)
);

module.exports = store;
