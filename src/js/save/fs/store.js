const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducers'),
      gedx = require('./gedx'),
      data = gedx.load();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

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
    
    possibleMatches: data.persons.reduce((accumulated, person) => {
      accumulated[person.getId()] = {
        status: 'NOT_REQUESTED',
        entries: {},
        entryIds: []
      };
      return accumulated;
    }, {}),
    
    selectedMatches: data.persons.reduce((accumulated, person) => {
      accumulated[person.getId()] = {
        selectedMatchId: null,
        copiedFacts: [],
        copiedNames: [],
        overrideNames: [],
        overrideFacts: []
      };
      return accumulated;
    }, {})
  },
  composeEnhancers(Redux.applyMiddleware(thunk))
);

module.exports = store;
