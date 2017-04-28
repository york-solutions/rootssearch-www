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
    
    personOrder: data.persons.map(p => p.getId()),
    
    persons: data.persons.reduce((accumulated, person) => {
      accumulated[person.getId()] = person;
      return accumulated;
    }, {}),
    
    currentPerson: data.persons[0].getId(),
    
    matches: data.persons.reduce((accumulated, person) => {
      accumulated[person.getId()] = {
        match: null,
        status: 'NOT_REQUESTED',
        copiedFacts: [],
        copiedNames: [],
        overrideNames: [],
        overrideFacts: [],
        entries: []
      };
      return accumulated;
    }, {})
  },
  Redux.applyMiddleware(thunk)
);

module.exports = store;
