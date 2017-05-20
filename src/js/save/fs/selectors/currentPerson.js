const personSelector = require('./person');

module.exports = function(state){
  return personSelector(state, state.currentPersonId);
};