const auth = require('./auth'),
      busy = require('./busy'),
      currentPersonId = require('./currentPersonId'),
      modal = require('./modal'),
      persons = require('./persons');

module.exports = function(state = {}, action){
  return {
    auth: auth(state.auth, action),
    busy: busy(state.busy, action),
    modal: modal(state.modal, action),
    currentPersonId: currentPersonId(state.currentPersonId, action),
    record: state.record,
    personOrder: state.personOrder,
    persons: persons(state, action)
  };
};