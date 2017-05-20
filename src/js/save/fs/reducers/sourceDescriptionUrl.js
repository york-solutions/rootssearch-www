module.exports = function(state = {}, action){
  switch(action.type){
    case 'SOURCE_DESCRIPTION_URL':
      return action.url;
    default:
      return state;
  }
};