const React = require('react');
const StatusBar = require('./StatusBar');
const store = require('../store');

module.exports = function(){
  const state = store.getState();
  
  // TODO: if we have no persons then show an error
  
  return (
    <StatusBar persons={state.gedcomx.persons} />  
  );
};