module.exports = function(state = {}, action){
  switch(action.type){
    
    case 'FS_AUTH_BEGIN':
      return 'FS_AUTH';
      
    case 'CREATE_PERSON':
      return 'CREATE_PERSON';
    
    case 'FS_AUTH_END':
    case 'CANCEL_CREATE_PERSON':
    case 'PERSON_CREATED':
      return null;
    
    default:
      return state;  
  }
};