module.exports = function(state = '', action){
  if(!action.personId){
    return state;
  }
  switch(action.type){
    case 'FOCUS_PERSON':
      return action.personId;
    default:
      return state;
  }
};