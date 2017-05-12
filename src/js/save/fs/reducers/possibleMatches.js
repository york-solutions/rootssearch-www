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
      
      // Only save entries if the status is LOADING.
      // When using redux-devtools-extension with a persisted state you can have
      // the situation where an initial match request is sent before devtools
      // loads the persisted state, then when the request returns matches may
      // have already been loaded form the persisted state. In that case we
      // want to ignore the matches response.
      if(state[personId].status === 'LOADING'){
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
      } else {
        return state;
      }
      
    case 'MANUAL_ID':
      return update(state, {
        [personId]: {
          manualId: {
            $set: action.value
          }
        }
      });
      
    case 'LOAD_MATCH_ERROR':
      return update(state, {
        [personId]: {
          error: {
            $set: action.message
          },
          status: {
            $set: 'NOT_REQUESTED'
          }
        }
      });
      
    case 'LOADED_MATCH_PERSON':
      return update(state, {
        [personId]: {
          error: {
            $set: ''
          }
        }
      });
    
    default:
      return state;
  }
};