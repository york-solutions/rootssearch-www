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

const persons = data.getPersons();
const personIds = persons.map(p => p.getId());

// Initialize the store with site settings loaded from cookies
const store = Redux.createStore(
  reducer, 
  {
    record: data,
    
    modal: null,
    
    busy: false,
    
    // URL of the source description for this record that will get attached to
    // all updated persons during the match session
    sourceDescriptionUrl: null,
    
    // List of person IDs
    personOrder: personIds,
    
    currentPersonId: persons[0].getId(),
    
    // Map of person IDs to GedcomX Person objects
    persons: persons.reduce((accumulated, person) => {
      const personId = person.getId();
      
      accumulated[personId] = {
        
        // GedcomX.Person object from the record
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
