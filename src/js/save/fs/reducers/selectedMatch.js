const update = require('update-immutable').default;
const initialSelectedMatch = require('../selectors/initialSelectedMatch');

module.exports = function(state = {}, action){
  
  const {dataId} = action;
        
  switch(action.type){
      
    case 'SELECT_MATCH':
      return update(state, {
        matchId: {
          $set: action.matchId
        },
        loading: {
          $set: true
        },
        gedcomx: {
          $set: null
        }
      });
    
    case 'LOAD_MATCH_ERROR':  
    case 'CANCEL_MATCH':
      return update(state, {
        $set: initialSelectedMatch()
      });
      
    case 'LOADED_MATCH_PERSON':
      return update(state, {
        loading: {
          $set: false
        },
        gedcomx: {
          $set: action.gedcomx
        },
        factMap: {
          $set: action.factMap
        }
      });
      
    case 'COPY_PLACE':
      return update(state, {
        copiedPlaces: {
          [dataId]: {
            $set: true
          }
        }
      });
      
    case 'UNCOPY_PLACE':
      return update(state, {
        copiedPlaces: {
          [dataId]: {
            $set: undefined
          }
        }
      });
      
    case 'COPY_DATE':
      return update(state, {
        copiedDates: {
          [dataId]: {
            $set: true
          }
        }
      });
      
    case 'UNCOPY_DATE':
      return update(state, {
        copiedDates: {
          [dataId]: {
            $set: undefined
          }
        }
      });
      
    case 'COPY_NAME':
      return update(state, {
        copyName: {
          $set: true
        }
      });
      
    case 'UNCOPY_NAME':
      return update(state, {
        copyName: {
          $set: false
        }
      });
      
    case 'OVERRIDE_DATE':
      return update(state, {
        overrideDates: {
          [dataId]: {
            $set: action.value
          }
        }
      });
      
    case 'OVERRIDE_PLACE':
      return update(state, {
        overridePlaces: {
          [dataId]: {
            $set: action.value
          }
        }
      });
      
    case 'OVERRIDE_NAMEPART':
      return update(state, {
        overrideName: {
          [action.partType]: {
            $set: action.value
          }
        }
      });
      
    case 'SAVE_MATCH':
      return update(state, {
        saving: {
          $set: true
        }
      });
      
    case 'MATCH_SAVED':
      return update(state, {
        saving: {
          $set: false
        },
        saved: {
          $set: true
        }
      });
    
    default:
      return state;
  }
};