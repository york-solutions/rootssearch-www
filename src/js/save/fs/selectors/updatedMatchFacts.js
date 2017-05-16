/**
 * Get a list of the updated matched facts, in order.
 * 
 * @returns [{fact, recordFactId}] fact is null when the fact isn't being matched and copied
 */
const selectedMatch = require('./selectedMatch');
 
module.exports = function(state){
  const factOrder = state.factOrder[state.currentPerson],
        match = selectedMatch(state),
        {factMap} = match;
  return factOrder.map(recordFactId => {
    const fact = factMap[recordFactId];
    return {
      recordFactId, 
      fact
    };
  });
};