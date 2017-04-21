const React = require('react');
const store = require('../store');
const StatusBar = require('./StatusBar');
const RecordPerson = require('./RecordPerson');
const FSAuthModal = require('./FSAuthModal');

module.exports = function(){
  const state = store.getState();
  
  // TODO: if we have no persons then show an error
  
  const person = state.gedcomx.persons[state.currentPerson];
  
  return (
    <div>
      <StatusBar persons={state.gedcomx.persons} />
      <div className="row">
        <div className="col-md-6">
          <RecordPerson person={person} />
        </div>
      </div>
      { state.fs_auth && state.fs_auth.in_progress ? <FSAuthModal onClick={state.fs_auth.click_handler} /> : null }
    </div>
  );
};