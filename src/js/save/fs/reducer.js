module.exports = function(state, action){
  switch(action.type){
    
    case 'FS_AUTH_BEGIN':
      return Object.assign({}, state, {
        fs_auth: {
          in_progress: true,
          click_handler: action.onClick
        }
      });
    
    case 'FS_AUTH_END':
      return Object.assign({}, state, {
        fs_auth: {
          in_progress: false
        }
      });
  }
  return state;
};