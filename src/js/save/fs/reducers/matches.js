module.exports = function(state = {
  state: 'NOT_REQUESTED',
  entries: []
}, action){
  switch(action.type){
    case 'LOADING_MATCHES':
      return Object.assign({}, state, {
        state: 'LOADING'
      });
      
    case 'MATCHES_LOADED':
      return Object.assign({}, state, {
        state: 'LOADED',
        entries: action.matches
      });
    
    default:
      return state;
  }
};