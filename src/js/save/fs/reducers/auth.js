module.exports = function(state = {}, action){
  switch(action.type){
    
    case 'FS_AUTH_BEGIN':
      return Object.assign({}, state, {
        inProgress: true,
        // TODO: can we avoid storying an event handler in the store?
        onClick: action.onClick
      });
    
    case 'FS_AUTH_END':
      return Object.assign({}, state, {
        inProgress: false
      });
    
    default:
      return state;  
  }
};