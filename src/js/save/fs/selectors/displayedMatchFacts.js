/**
 * Get a list of match facts that should be displayed.
 */
const selectedMatch = require('./selectedMatch');
const updatedMatchFacts = require('./updatedMatchFacts');

module.exports = function(state){
  const matchFacts = updatedMatchFacts(state),
        match = selectedMatch(state),
        {copiedDates, copiedPlaces} = match;
  
  return matchFacts.map(data => {
    const {fact, recordFactId} = data;
    
    // Set the placeholder for facts that aren't matched or aren't being copied
    if(fact.isEmpty() && !(copiedDates[recordFactId] || copiedPlaces[recordFactId])){
      data.display = false;
    } else {
      data.display = true;
    }
    
    return data;
  });
};