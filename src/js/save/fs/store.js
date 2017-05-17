const Redux = require('redux'),
      thunk = require('redux-thunk').default,
      reducer = require('./reducers'),
      serializer = require('./serializer'),
      gedcomx = require('./utils/gedcomx'),
      slimFacts = require('./selectors/slimFacts'),
      initialSelectedMatch = require('./selectors/initialSelectedMatch'),
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
    record: data,
    
    modal: null,
    
    busy: false,
    
    // List of person IDs
    personOrder: personIds,
    
    currentPersonId: data.persons[0].getId(),
    
    // Map of person IDs to GedcomX Person objects
    persons: data.persons.reduce((accumulated, person) => {
      const personId = person.getId();
      
      accumulated[personId] = {
        
        // GedcomX.Person object
        gedcomx: person,
        
        // List of fact IDs
        factOrder: personsSlimFacts[personId].map(f => f.getId()),
        
        // Map of relevant (slimmed) facts
        facts: personsSlimFacts[personId].reduce((accumulated, fact) => {
          accumulated[fact.getId()] = fact;
          return accumulated;
        }, {}),
        
        possibleMatches: {
          status: 'NOT_REQUESTED',
          entries: {},
          entryIds: [],
          manualId: '',
          error: ''
        },
        
        selectedMatch: initialSelectedMatch()
        
      };
      
      return accumulated;
    }, {})

  },
  composeEnhancers(Redux.applyMiddleware(thunk))
);

module.exports = store;
