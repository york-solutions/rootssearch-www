module.exports = function(state = {}, action){
  
  const {personId} = action,
        match = state[personId];
        
  if(match === undefined){
    return state;
  }
  
  switch(action.type){
    
    case 'LOADING_MATCHES':
      return updateMatch(state, personId, {
        status: 'LOADING'
      });
      
    case 'MATCHES_LOADED':
      return updateMatch(state, personId, {
        status: 'LOADED',
        entries: action.matches.reduce((accumulator, match) => {
          accumulator[match.getId()] = match;
          return accumulator;
        }, {}),
        entryIds: action.matches.map(m => m.getId())
      });
    
    default:
      return state;
  }
};

function updateMatch(state, personId, newData){
  const match = state[personId];
  return Object.assign({}, state, {
    [personId]: Object.assign({}, match, newData)
  });
}