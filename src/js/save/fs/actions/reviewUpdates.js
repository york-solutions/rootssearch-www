/**
 * If changes are being made to the person then show the modal.
 * If not then proceed to the saveMatch action
 */

const saveMatchAction = require('./saveMatch');
const selectedMatchSelector = require('../selectors/selectedMatch');

module.exports = function(){
  return function(dispatch, getState){
    
    const state = getState();
    const selectedMatch = selectedMatchSelector(state);
    
    if(hasChanges(selectedMatch)){
      dispatch({ type: 'REVIEW_UPDATES' });
    } else {
      dispatch(saveMatchAction());
    }
    
  };
};

/**
 * Calculate whether changes are being made
 * 
 * @param {Object} selectedMatch
 * @returns {Boolean}
 */
function hasChanges(selectedMatch){
  return selectedMatch.copyName 
    || hasData(selectedMatch.copiedDates)
    || hasData(selectedMatch.copiedPlaces)
    || hasData(selectedMatch.overrideName)
    || hasData(selectedMatch.overrideDates)
    || hasData(selectedMatch.overrideDates);
}

/**
 * Check whether an object has any data
 * 
 * @param {Object} obj
 * @returns {Boolean}
 */
function hasData(obj){
  return Object.keys(obj).length > 0;
}