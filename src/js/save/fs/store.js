const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducers'),
      gedx = require('./gedx'),
      data = gedx.load();

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(
  reducer, 
  {
    gedcomx: data,
    
    // List of match statuses
    matches: data.persons.map(person => {
      return {
        id: person.getId(),
        match: null,
        status: null,
        entries: []
      };
    }, {})
  },
  Redux.applyMiddleware(thunk)
);

module.exports = store;
