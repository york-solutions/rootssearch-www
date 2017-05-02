const update = require('update-immutable').default;

module.exports = function(state = {}, action){
  
  const {personId, dataId} = action,
        match = state[personId];
        
  if(match === undefined){
    return state;
  }
  
  switch(action.type){
      
    case 'SELECT_MATCH':
      return update(state, {
        [personId]: {
          selectedMatchId: {
            $set: action.matchId
          }
        }
      });
      
    case 'COPY_PLACE':
      return update(state, {
        [personId]: {
          copiedPlaces: {
            [dataId]: {
              $set: true
            }
          }
        }
      });
      
    case 'UNCOPY_PLACE':
      return update(state, {
        [personId]: {
          copiedPlaces: {
            [dataId]: {
              $set: undefined
            }
          }
        }
      });
      
    case 'COPY_DATE':
      return update(state, {
        [personId]: {
          copiedDates: {
            [dataId]: {
              $set: true
            }
          }
        }
      });
      
    case 'UNCOPY_DATE':
      return update(state, {
        [personId]: {
          copiedDates: {
            [dataId]: {
              $set: undefined
            }
          }
        }
      });
      
    case 'COPY_NAME':
      return update(state, {
        [personId]: {
          copiedNames: {
            [dataId]: {
              $set: true
            }
          }
        }
      });
      
    case 'UNCOPY_NAME':
      return update(state, {
        [personId]: {
          copiedNames: {
            [dataId]: {
              $set: undefined
            }
          }
        }
      });
    
    default:
      return state;
  }
};