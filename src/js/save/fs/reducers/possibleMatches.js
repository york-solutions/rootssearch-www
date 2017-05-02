const update = require('update-immutable').default;

module.exports = function(state = {}, action){
  
  const {personId} = action,
        match = state[personId];
        
  if(match === undefined){
    return state;
  }
  
  switch(action.type){
    
    case 'LOADING_MATCHES':
      return update(state, {
        [personId]: {
          status: {
            $set: 'LOADING'
          }
        }
      });
      
    case 'MATCHES_LOADED':
      return update(state, {
        [personId]: {
          status: {
            $set: 'LOADED'
          },
          entries: {
            $set: action.matches.reduce((accumulator, match) => {
              accumulator[match.getId()] = match;
              return accumulator;
            }, {})
          },
          entryIds: {
            $set: action.matches.map(m => m.getId())
          }
        }
      });
    
    default:
      return state;
  }
};