const update = require('update-immutable').default;

module.exports = function(state = {}, action){
  
  const {personId, dataId} = action;
        
  if(state[personId] === undefined){
    return state;
  }
  
  switch(action.type){
      
    case 'SELECT_MATCH':
      return update(state, {
        [personId]: {
          matchId: {
            $set: action.matchId
          },
          loading: {
            $set: true
          },
          gedcomx: {
            $set: null
          }
        }
      });
      
    case 'LOADED_MATCH_PERSON':
      return update(state, {
        [personId]: {
          loading: {
            $set: false
          },
          gedcomx: {
            $set: action.gedcomx
          },
          factMap: {
            $set: action.factMap
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
      
    case 'OVERRIDE_DATE':
      return update(state, {
        [personId]: {
          overrideDates: {
            [dataId]: {
              $set: action.value
            }
          }
        }
      });
      
    case 'OVERRIDE_PLACE':
      return update(state, {
        [personId]: {
          overridePlaces: {
            [dataId]: {
              $set: action.value
            }
          }
        }
      });
      
    case 'NORMALIZED_DATE':
      return update(state, {
        [personId]: {
          normalizedDates: {
            [dataId]: {
              $set: action.value
            }
          }
        }
      });
      
    case 'NORMALIZED_PLACE':
      return update(state, {
        [personId]: {
          normalizedPlaces: {
            [dataId]: {
              $set: action.value
            }
          }
        }
      });
      
    case 'SAVE_MATCH':
      return update(state, {
        [personId]: {
          saving: {
            $set: true
          }
        }
      });
    
    default:
      return state;
  }
};