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
        resource: rel2.getPerson2().getResource()
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