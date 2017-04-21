const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducers'),
      gedx = require('./gedx');

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(
  reducer, 
  {
    // TODO: can we put this anywhere else? Initial values of other store
    // properties are set in the reducers default state param value
    gedcomx: gedx.load()
  },
  Redux.applyMiddleware(thunk)
);

module.exports = store;
