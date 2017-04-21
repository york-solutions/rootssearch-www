module.exports = function(state, action){
  switch(action.type){
    
    case 'FS_AUTH_BEGIN':
      return Object.assign({}, state, {
        auth: {
          inProgress: true,
          onClick: action.onClick
        }
      });
    
    case 'FS_AUTH_END':
      return Object.assign({}, state, {
        auth: {
          inProgress: false
        }
      });
      
    case 'FOCUS_PERSON':
      return Object.assign({}, state, {
        currentPerson: action.personIndex
      });
  }
  return state;
};