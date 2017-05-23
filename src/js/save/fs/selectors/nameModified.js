/**
 * Calculate whether the person's name has been modifed.
 * 
 * @returns {Boolean}
 */

const selectedMatchSelector = require('./selectedMatch'); 

module.exports = function(state){
  const match = selectedMatchSelector(state);
  return match.copyName || Object.keys(match.overrideName).length > 0;
};