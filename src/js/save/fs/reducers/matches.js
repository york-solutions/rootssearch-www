module.exports = function(state = [], action){
  switch(action.type){
    
    case 'LOADING_MATCHES':
      return updatePerson(state, action, {
        status: 'LOADING'
      });
      
    case 'MATCHES_LOADED':
      return updatePerson(state, action, {
        status: 'LOADED',
        entries: action.matches
      });
      
    case 'SELECT_MATCH':
      return updatePerson(state, action, {
        match: action.matchId
      });
    
    default:
      return state;
  }
};

function updatePerson(personList, action, newData){
  let {personIndex} = action;
  
  // Allow the action to specify a personId instead of a personIndex. When a
  // personId is provided we map that to an index.
  if(action.personId){
    for(let i = 0; i < personList.length; i++){
      if(personList[i].id === action.personId){
        personIndex = i;
        break;
      }
    }
  }
  
  // If we have a personIndex then update that entry
  if(personIndex !== undefined){
    return personList.map((person, index) => {
      if(index === personIndex){
        return Object.assign({}, person, newData);
      } else {
        return person;
      }
    });
  } 
  
  // Just return without modifying anything when we can't find a person to update
  else {
    return personList;
  }
}