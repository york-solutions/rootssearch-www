module.exports = function(state = 0, action){
  switch(action.type){
    case 'FOCUS_PERSON':
      return action.personIndex;
    default:
      return state;
  }
};