module.exports = function(state = false, action){
  switch(action.type){
    case 'SAVE_MATCH':
      return true;
      
    case 'MATCH_SAVED':
      return false;
      
    default:
      return state;
  }
};