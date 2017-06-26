/**
 * Save a match.
 */

const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const nextPersonAction = require('./nextPerson');
const namePartsMap = require('../selectors/namePartsMap');
const series = require('async/series');

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
            
      // Do we need to create any relationships?
      const newRelationships = getNewRelationships(getState(), personId, matchId);
      
      // Create the relationships in series. If we try to run them in parallel
      // then we'll get 409 db conflicts because of trying to update the same
      // person record with concurent requests.
      series(newRelationships.map(rel => {
        const body = GedcomX.ChildAndParentsRelationship.isInstance(rel) ? {
          childAndParentsRelationships: [rel]
        } : {
          relationships: [rel]
        };
        return (parallelCallback) => {
          FS.post('/platform/tree/relationships', {
            body: body
          }, parallelCallback);
        };
      }), function(error, results){
        
        // TODO: error handling
        
        // Save the person and set the state to loaded
        dispatch({
          type: 'MATCH_SAVED',
          personId
        });
        
        dispatch(nextPersonAction());
        
      });      
            
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

/**
 * Calculate any relationships we need to add to the tree for the new person
 * 
 * @param {Object} state
 * @param {String} recordPersonId
 * @param {String} treePersonId
 * @returns {Relationship[]}
 */
function getNewRelationships(state, recordPersonId, treePersonId){
  
  // First we create temporary indexes of recordId => treeId and treeId => recordId.
  // These will simplify and hopefully speedup calculations.
  // Only matched persons are added to this, including the newly created person.
  const recordToTreeIds = {},
        treeToRecordIds = {};
  
  // Add already matched persons to the indexes      
  state.personOrder.forEach(recordId => {
    const treeId = state.persons[recordId].selectedMatch.matchId;
    if(treeId && state.persons[recordId].selectedMatch.matchId){
      recordToTreeIds[recordId] = treeId;
      treeToRecordIds[treeId] = recordId;
    }
  });
  
  // Add the newly created person to the indexes
  recordToTreeIds[recordPersonId] = treePersonId;
  treeToRecordIds[treePersonId] = recordPersonId;
  
  // Get a list of record relationships the person is in and
  // check to see if the other person in the relationship has been matched
  const newRelationships = state.record.getRelationships().filter(recordRel => {
    
    // Here we verify that both persons have been matched and saved and that
    // one of them is the newly created person. 
    return recordRel.isInvolved(recordPersonId) 
      && recordToTreeIds[recordRel.getPerson1().getResourceId()]
      && recordToTreeIds[recordRel.getPerson2().getResourceId()];
  })
  
  // The resulting relationships involve the new person and another person that
  // has already been matched. For each of those relationship we create a new
  // rel that we add to the tree.
  .map(recordRel => {
    return GedcomX.Relationship({
      person1: {
        resource: '#' + recordToTreeIds[recordRel.getPerson1().getResourceId()]
      },
      person2: {
        resource: '#' + recordToTreeIds[recordRel.getPerson2().getResourceId()]
      },
      type: recordRel.getType()
    });
  });
  
  // Now we need to convert ParentChild rels into ChildAndParents rels.
  // We start by separating the relationships by type.
  const coupleRels = newRelationships.filter(r => r.getType() === 'http://gedcomx.org/Couple'),
        parentChildRels = newRelationships.filter(r => r.getType() === 'http://gedcomx.org/ParentChild'),
        childAndParentsRels = [],
        
        // Now we group the ParentChild rels by the childId
        childRelsMap = parentChildRels.reduce((map, rel) => {
          const childId = rel.getPerson2().getResourceId();
          if(!Array.isArray(map[childId])){
            map[childId] = [];
          }
          map[childId].push(rel);
          return map;
        }, {});
        
  // Now we convert ParentChild rels into ChildAndParent rels, combining when appropriate.
  Object.keys(childRelsMap).forEach(childId => {
    const childRels = childRelsMap[childId];
    
    // The method works for cases of both 1 and 2 ParentChild rels by allowing
    // the second to be undefined.
    // TODO: handle more than two ParentChild rels.
    // TODO: account for the possibility that the two parents shouldn't be in
    // the same ChildAndParents rel
    const capr = createChildAndParents(childRels[0], childRels[1]);
    
    // Here we verify that we have at least one of the parents set. This is
    // necessary because we don't add parents of unknown gender so if there isn't
    // at least one parent with a known gender then we won't have any parents.
    if(capr.getFather() || capr.getMother()){
      childAndParentsRels.push(capr);
    }
  });
  
  return coupleRels.concat(childAndParentsRels);
  
  /**
   * Convert one or two ParentChild relationships into one ChildAndParents relationship.
   * 
   * This method is intentionally incapsulated inside getNewRelationships() so
   * that we get access to the state and ID indexes.
   * 
   * @param {GedcomX.Relationship} rel1
   * @param {GedcomX.Relationship=} rel2
   * @returns {GedcomX.ChildAndParents}
   */
  function createChildAndParents(rel1, rel2){
    const capr = GedcomX.ChildAndParentsRelationship({
      child: {
        resource: rel1.getPerson2().getResource()
      }
    });
    
    // Add parent from rel1
    const parent1TreeId = rel1.getPerson1().getResourceId(),
          parent1RecordId = treeToRecordIds[parent1TreeId];
    const parent = state.persons[parent1RecordId].selectedMatch.gedcomx.getPersonById(parent1TreeId);
    capr.addParent(parent);
    
    // Add parent from rel2
    if(GedcomX.Relationship.isInstance(rel2)){
      const parent2TreeId = rel2.getPerson1().getResourceId(),
            parent2RecordId = treeToRecordIds[parent2TreeId],
            parent = state.persons[parent2RecordId].selectedMatch.gedcomx.getPersonById(parent2TreeId);
      capr.addParent(parent);
    }
    
    return capr;
  }
  
}