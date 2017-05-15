/**
 * Create a new person in FS.
 * 
 * @param {String} recordPersonId
 * @param {GedcomX.Person|Object} person
 */
 
const FS = require('../utils/fs');
const selectMatch = require('./selectMatch');
 
module.exports = function(recordPersonId, person){
  return function(dispatch){
    
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
      
      // Remove loading status
      dispatch({
        type: 'PERSON_CREATED'
      });
      
      // Process response
      dispatch(selectMatch(recordPersonId, response.headers['x-entity-id']));
      
    });
    
  };
};