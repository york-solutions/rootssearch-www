/**
 * Create a new person in FS.
 * 
 * @param {String} recordPersonId
 * @param {GedcomX.Person|Object} person
 */
 
const FS = require('../utils/fs');
const selectMatch = require('./selectMatch');
 
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
        
      // Remove loading status
      dispatch({
        type: 'PERSON_CREATED'
      });
      
      // Mark the new person as the selected match
      dispatch(selectMatch(recordPersonId, treePersonId));
      
    });
    
  };
};