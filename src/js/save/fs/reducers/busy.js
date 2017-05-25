module.exports = function(state = false, action){
  switch(action.type){
    
    case 'SAVE_MATCH':
    case 'CREATING_PERSON':
    case 'SELECT_MATCH':
      return true;
      
    case 'MATCH_SAVED':
    case 'PERSON_CREATED':
    case 'LOADED_MATCH_PERSON':
    case 'LOADED_MATCH_ERROR':
      return false;
      
    default:
      return state;
  }
};