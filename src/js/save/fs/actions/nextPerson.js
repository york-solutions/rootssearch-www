/**
 * Move focus to the next person, if there is one.
 */

const changeFocusPerson = require('./changeFocusPerson');

module.exports = function(){
  return function(dispatch, getState){
    
    const state = getState();
    
    // Get current person ID
    const {currentPersonId} = state;
    
    // Calculate current person index
    const currentIndex = state.personOrder.indexOf(currentPersonId);
    
    // Get person ID of index + 1
    const nextPerson = state.personOrder[currentIndex + 1];
    
    // Change focus
    dispatch(changeFocusPerson(nextPerson));
    
  };
};