module.exports = function(state = {}, action){
  switch(action.type){
    
    case 'FS_AUTH_BEGIN':
      return 'FS_AUTH';
    
    case 'FS_AUTH_END':
      return null;
      
    case 'CREATE_PERSON':
      return 'CREATE_PERSON';
    
    default:
      return state;  
  }
};