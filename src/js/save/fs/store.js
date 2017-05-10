const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducers'),
      serializer = require('./serializer'),
      gedcomx = require('./utils/gedcomx'),
      slimFacts = require('./selectors/slimFacts'),
      data = gedcomx.load();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: serializer,
    shouldCatchErrors: false
  }) : Redux.compose;

// Map of person IDs to slimmed list of their facts. These lists are used
// multiple times when initializing the store state.
const personsSlimFacts = data.getPersons().reduce((accumulated, person) => {
  accumulated[person.getId()] = slimFacts(person);
  return accumulated;
}, {});

const personIds = data.persons.map(p => p.getId());

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(
  reducer, 
  {
    // Record data
    gedcomx: data,
    
    // List of person IDs
    personOrder: personIds,
    
    // Map of person IDs to GedcomX Person objects
    persons: data.persons.reduce((accumulated, person) => {
      accumulated[person.getId()] = person;
      return accumulated;
    }, {}),
    
    // Map of person IDs to a list of fact IDs
    factOrder: personIds.reduce((accumulated, id) => {
      accumulated[id] = personsSlimFacts[id].map(f => f.getId());
      return accumulated;
    }, {}),
    
    // Map of person IDs to maps of relevant (slimmed) facts
    facts: personIds.reduce((accumulated, id) => {
      accumulated[id] = personsSlimFacts[id].reduce((accumulated, fact) => {
        accumulated[fact.getId()] = fact;
        return accumulated;
      }, {});
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
        matchId: null,
        gedcomx: null,
        loading: false,
        saving: false,
        saved: false,
        
        // Map of record person fact IDs to match person fact IDs
        factMap: {},
        
        // copied maps are keyed by record conclusion ID
        copiedDates: {},
        copiedPlaces: {},
        copiedNames: {},
        
        // override maps are keyed by match conclusion ID
        overrideNames: {},
        overrideDates: {},
        overridePlaces: {},
        
        // normalized maps are keyed by match conclusion ID
        normalizedDates: {},
        normalizedPlaces: {}
      };
      return accumulated;
    }, {})
  },
  composeEnhancers(Redux.applyMiddleware(thunk))
);

module.exports = store;
