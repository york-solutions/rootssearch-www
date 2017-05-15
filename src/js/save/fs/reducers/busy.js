module.exports = function(state = false, action){
  switch(action.type){
    
    case 'SAVE_MATCH':
    case 'CREATING_PERSON':
      return true;
      
    case 'MATCH_SAVED':
    case 'PERSON_CREATED':
      return false;
      
    default:
      return state;
  }
};