const update = require('update-immutable').default;

module.exports = function(state = {}, action){
  
  switch(action.type){
    
    case 'LOADING_MATCHES':
      return update(state, {
        status: {
          $set: 'LOADING'
        }
      });
      
    case 'MATCHES_LOADED':
      
      // Only save entries if the status is LOADING.
      // When using redux-devtools-extension with a persisted state you can have
      // the situation where an initial match request is sent before devtools
      // loads the persisted state, then when the request returns matches may
      // have already been loaded form the persisted state. In that case we
      // want to ignore the matches response.
      if(state.status === 'LOADING'){
        return update(state, {
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
        });
      } else {
        return state;
      }
      
    case 'MANUAL_ID':
      return update(state, {
        manualId: {
          $set: action.value
        }
      });
      
    case 'LOAD_MATCH_ERROR':
      return update(state, {
        error: {
          $set: action.message
        },
        status: {
          $set: 'NOT_REQUESTED'
        }
      });
      
    case 'LOADED_MATCH_PERSON':
      return update(state, {
        error: {
          $set: ''
        }
      });
      
    case 'CREATE_PERSON':
      return update(state, {
        status: {
          $set: 'CREATE_PERSON'
        }
      });
      
    case 'CANCEL_CREATE_PERSON':
      return update(state, {
        status: {
          $set: 'LOADED'
        }
      });
    
    default:
      return state;
  }
};