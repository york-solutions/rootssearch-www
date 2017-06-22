/**
 * Create a new person in FS.
 * 
 * @param {String} recordPersonId
 * @param {GedcomX.Person|Object} person
 */
 
const FS = require('../utils/fs');
const GedcomX = require('../utils/gedcomx');
const selectMatch = require('./selectMatch');
const parallel = require('async/parallel');
 
module.exports = function(recordPersonId, person){
  return function(dispatch, getState){
    
    // Show loading status
    dispatch({
      type: 'CREATING_PERSON'
    });
    
    // Issue request
    FS.post('/platform/tree/persons', {
      body: {
        persons: [person.toJSON ? person.toJSON() : person]
      }
    }, function(error, response){
      
      // TODO: error handling
      
      const treePersonId = response.headers['x-entity-id'];
      
      // Do we need to create any relationships?
      const newRelationships = getNewRelationships(getState(), recordPersonId, treePersonId);
      
      // Create the relationships in parallel
      parallel(newRelationships.map(rel => {
        return (parallelCallback) => {
          FS.post('/platform/tree/relationships', {
            body: {
              relationships: [rel]
            }
          }, parallelCallback);
        };
      }), function(error, results){
        
        // TODO: error handling
        
        // Remove loading status
        dispatch({
          type: 'PERSON_CREATED'
        });
        
        // Mark the new person as the selected match
        dispatch(selectMatch(recordPersonId, treePersonId));
        
      });
      
    });
    
  };
};

/**
 * Calculate any relationships we need to add to the tree for the new person
 * 
 * @param {Object} state
 * @param {String} recordPersonId
 * @param {String} treePersonId
 * @returns {Relationship[]}
 */
function getNewRelationships(state, recordPersonId, treePersonId){
  
  // Get a list of record relationships the person is in and
  // check to see if the other person in the relationship has been matched
  return state.record.getRelationships().filter(recordRel => {
    
    // person1 is the person we just created so lets see if person2 is also matched
    if(recordRel.getPerson1().matches(recordPersonId)){
      return state.persons[recordRel.getPerson2().getResourceId()].selectedMatch.saved;
    }
    
    // person2 is the person we just created so lets see if person1 is also matched
    else if(recordRel.getPerson2().matches(recordPersonId)){
      return state.persons[recordRel.getPerson1().getResourceId()].selectedMatch.saved;
    }
    
    // The new person is not involved in this relationship
    return false;
  })
  
  // The resulting relationships involve the new person and another person that
  // has already been matched. For each of those relationship we create a new
  // rel that we add to the tree.
  .map(recordRel => {
    const person1RecordId = recordRel.getPerson1().getResourceId(),
          person2RecordId = recordRel.getPerson2().getResourceId();
    return GedcomX.Relationship({
      person1: {
        resource: person1RecordId === recordPersonId ? treePersonId : state.persons[person1RecordId].selectedMatch.matchId
      },
      person2: {
        resource: person2RecordId === recordPersonId ? treePersonId : state.persons[person2RecordId].selectedMatch.matchId
      },
      type: recordRel.getType()
    });
  });
  
}