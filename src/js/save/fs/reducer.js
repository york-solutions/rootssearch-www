module.exports = function(state, action){
  let newState;
  
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
      
    case 'LOADING_MATCHES':
      newState = Object.assign({}, state);
      newState.matches.state = 'LOADING';
      return newState;
      
    case 'MATCHES_LOADED':
      newState = Object.assign({}, state);
      newState.matches.state = 'LOADED';
      newState.matches.entries = action.matches;
      return newState;
  }
  return state;
};