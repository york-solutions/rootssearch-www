const React = require('react');
const store = require('../store');
const StatusBar = require('./StatusBar');
const RecordPerson = require('./RecordPerson');

module.exports = function(){
  const state = store.getState();
  
  // TODO: if we have no persons then show an error
  
  return (
    <div>
      <StatusBar persons={state.gedcomx.persons} />
      <div className="row">
        <div className="col-md-6">
          <RecordPerson person={state.gedcomx.persons[0]} />
        </div>
      </div>
    </div>
  );
};