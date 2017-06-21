/**
 * Save a match.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const nextPersonAction = require('./nextPerson');
const namePartsMap = require('../selectors/namePartsMap');

module.exports = function(personId){
  return function(dispatch, getState){
    
    const state = getState();
    
    // Default to current person
    if(!personId){
      personId = state.currentPersonId;
    }
    
    const person = state.persons[personId],
          matchId = person.selectedMatch.matchId,
          gedcomx = person.selectedMatch.gedcomx;
    
    // Set the state to saving
    dispatch({
      type: 'SAVE_MATCH',
      personId
    });
    
    const personUpdates = calculatePersonUpdates(person);
    
    // Do we need to create a soure? Not if the person already has this source
    // attached to them.
    const existingSource = recordAlreadyAttached(state.record, gedcomx, matchId);
    
    // Response handler for the person update request
    const updateResponseHandler = (error, response) => {
      // TODO: error handling
            
      // Save the person and set the state to loaded
      dispatch({
        type: 'MATCH_SAVED',
        personId
      });
      
      dispatch(nextPersonAction());
    };
    
    // If the source is already attached then we skip creating an additional source description.
    if(existingSource){
      updatePerson(matchId, personUpdates, updateResponseHandler);
    }
    
    // The source isn't already attached. Before attaching we check to see if
    // we've previously already created a source description.
    else {
      getSourceDescriptionUrl(state, function(error, sourceDescriptionUrl){
        
        // TODO: error handling
        
        dispatch({
          type: 'SOURCE_DESCRIPTION_URL',
          url: sourceDescriptionUrl
        });
        
        // Setup the source reference
        personUpdates.sources = [{
          description: sourceDescriptionUrl,
          // TODO: only add tags supported by the FS UI?
          tags: personUpdates.facts.map(fact => {
            return {
              resource: fact.getType()
            };
          })
          // TODO: changeMessage
        }];
      
        updatePerson(matchId, personUpdates, updateResponseHandler);
      
      });
    }
  };
};

/**
 * Update a person in the FS family tree
 * 
 * @param {String} personId
 * @param {Object} personUpdates person data that is POSTed for updates
 * @param {Function} callback function(error, response)
 */
function updatePerson(personId, personUpdates, callback){
  // Update the person
  FS.post(`/platform/tree/persons/${personId}`, {
    body: {
      persons: [ personUpdates ]
    }
  }, callback);
}

/**
 * Generate a list of changes to the person.
 * 
 * TODO: technically this is a selector, right?
 */
function calculatePersonUpdates(person){
  const updates = {
    facts: calculateFactUpdates(person),
    names: calculateNameUpdates(person)
  };
  return updates;
}

/**
 * Generate the list of changed names
 */
function calculateNameUpdates(person){
  const recordPerson = person.gedcomx,
        recordName = recordPerson.getPreferredName(),
        recordNameParts = namePartsMap(recordName),
        match = person.selectedMatch,
        reason = match.nameReason,
        matchName = match.gedcomx.getPersonById(match.matchId).getPreferredName(),
        matchNameParts = namePartsMap(matchName),
        copiedParts = match.copyName ? recordNameParts : {};
        
  // Has anything changed?
  if(Object.keys(copiedParts).length === 0 && Object.keys(match.overrideName).length === 0) {
    return [];
  }
  
  // Generate name parts by seeding with original match name parts so that the
  // user could override just one part but not the others
  const newNamePartsMap = Object.assign({}, matchNameParts, copiedParts, match.overrideName),
        newNameParts = Object.keys(newNamePartsMap).map(type => {
          return {
            type,
            value: newNamePartsMap[type]
          };
        });
        
  return [
    GedcomX.Name({
      preferred: true,
      id: matchName.getId(),
      nameForms: [{
        parts: newNameParts
      }],
      attribution: {
        changeMessage: reason
      }
    }) 
  ];
}

/**
 * Generate a list of fact updates for the matched person.
 * 
 * First we check the copied maps.
 * If a fact isn't being copied then we skip it.
 * For all facts being copied, we examine the overrides and normalized maps
 * to construct the resulting fact data.
 * If the fact is new then we delete the ID so that FS knows it's new.
 */
function calculateFactUpdates(person){
  const factOrder = person.factOrder,
        facts = person.facts,
        match = person.selectedMatch,
        {factMap, factReasons} = match;
  
  // Filter fact ID list to just those facts that are being copied
  // TODO: allow the user to modify matched vitals without copying. Right now
  // vitals are matched and can be modified without copying but the code here 
  // ignores facts that aren't marked for copying
  return factOrder.filter(factId => {
    return match.copiedDates[factId] || match.copiedPlaces[factId];
  })
  
  // Assemble fact updates
  .map(factId => {

    // First we copy the fact so that we don't modify the originals
    const matchFact = GedcomX.Fact(factMap[factId].toJSON()),
          matchFactId = matchFact.getId();
    
    // Make any adjustments based on the copied dates and places
    if(match.copiedDates[factId]){
      matchFact.setDate(facts[factId].getDate().toJSON());
    }
    if(match.copiedPlaces[factId]){
      matchFact.setPlace(facts[factId].getPlace().toJSON());
    }
    
    // Overrides
    if(match.overrideDates[matchFactId]){
      matchFact.setDate(match.overrideDates[matchFactId]);
    }
    if(match.overridePlaces[matchFactId]){
      matchFact.setPlace(match.overridePlaces[matchFactId]);
    }
    
    // Delete IDs on new facts
    if(matchFact.getId().substring(0, 4) === 'NEW_'){
      matchFact.setId();
    }
    
    if(factReasons[matchFactId]){
      matchFact.setAttribution({
        changeMessage: factReasons[matchFactId]
      });
    }
    
    // Add to the update object
    return matchFact;
    
  });
}

/**
 * Create a source description (if we haven't already)
 * and return the source description's URL.
 * 
 * @param {Function} callback function(error, sourceDescriptionUrl)
 */
function getSourceDescriptionUrl(state, callback){
  
  // Return the source description URL if we already have it
  if(state.sourceDescriptionUrl){
    setTimeout(function(){
      callback(null, state.sourceDescriptionUrl);
    });
  } 
  
  // Create a source description if we don't already have one
  else {
    FS.post('/platform/sources/descriptions', {
      body: {
        sourceDescriptions: [ state.record.getRootSourceDescription() ]
      }
    }, function(error, response){
      callback(error, response ? response.headers.location : undefined);
    });
  }
}

/**
 * Calculate whether the record is already attached to the person as a source
 * 
 * @param {GedcomX} record
 * @param {GedcomX} tree the gedcomx document that contains the person and their sources
 * @param {String} personId ID of the person who's sources we are checking
 * @returns {Boolean}
 */
function recordAlreadyAttached(record, tree, personId){
  
  // Get the list of source references from the person
  return !!tree.getPersonById(personId).getSources()
    
  // Map source references to source descriptions
  .map(sourceReference => {
    return tree.getSourceDescriptionById(sourceReference.getDescription().substring(1));
  })
  
  // Filter out undefined value
  .filter(sourceDescription => {
    return !!sourceDescription;
  })
  
  // Get a list of their URLs
  .map(sourceDescription => {
    return sourceDescription.getAbout();
  })
  
  // Find one that matches, if any
  .find(url => {
    return url === record.getRootSourceDescription().getAbout();
  });
}