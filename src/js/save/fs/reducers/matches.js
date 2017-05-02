module.exports = function(state = {}, action){
  
  const {personId} = action,
        match = state[personId];
        
  if(match === undefined){
    return state;
  }
  
  switch(action.type){
    
    case 'LOADING_MATCHES':
      return updateMatch(state, personId, {
        status: 'LOADING'
      });
      
    case 'MATCHES_LOADED':
      return updateMatch(state, personId, {
        status: 'LOADED',
        entries: action.matches.reduce((accumulator, match) => {
          accumulator[match.getId()] = match;
          return accumulator;
        }, {}),
        entryIds: action.matches.map(m => m.getId())
      });
      
    case 'SELECT_MATCH':
      return updateMatch(state, personId, {
        selectedMatchId: action.matchId
      });
      
    case 'COPY_FACT':
      return updateMatch(state, personId, {
        copiedFacts: add(match.copiedFacts, action.dataId)
      });
      
    case 'UNCOPY_FACT':
      return updateMatch(state, personId, {
        copiedFacts: remove(match.copiedFacts, action.dataId)
      });
      
    case 'COPY_NAME':
      return updateMatch(state, personId, {
        copiedNames: add(match.copiedNames, action.dataId)
      });
      
    case 'UNCOPY_NAME':
      return updateMatch(state, personId, {
        copiedNames: remove(match.copiedNames, action.dataId)
      });
    
    default:
      return state;
  }
};

function add(list, value){
  const newList = list.slice();
  newList.push(value);
  return newList;
}

function remove(list, value){
  const index = list.indexOf(value);
  return list.filter( (item, i) => i !== index);
}

function updateMatch(state, personId, newData){
  const match = state[personId];
  return Object.assign({}, state, {
    [personId]: Object.assign({}, match, newData)
  });
}