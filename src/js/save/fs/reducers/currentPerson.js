module.exports = function(state = '', action){
  switch(action.type){
    case 'FOCUS_PERSON':
      return action.personId;
    default:
      return state;
  }
};