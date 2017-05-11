const React = require('react');
const connect = require('react-redux').connect;
const StatusCircle = require('./StatusCircle');
const changeFocusPerson = require('../actions/changeFocusPerson');

const StatusBar = function({persons, currentPerson, dispatch, saved}){
  const generateClickHandler = (i) => {
    return () => {
      dispatch(changeFocusPerson(i));
    };
  };
  const circles = persons.map((p) => {
    return <StatusCircle 
      person={p} 
      key={p.getId()} 
      selected={p.getId() === currentPerson}
      saved={saved[p.getId()]}
      onClick={generateClickHandler(p.getId())} />;
  });
  return <ul className="status-list">{circles}</ul>;
};

const mapStateToProps = state => {
  return {
    persons: state.gedcomx.persons,
    currentPerson: state.currentPerson,
    saved: state.personOrder.reduce((accumulator, personId) => {
      accumulator[personId] = state.selectedMatches[personId].saved;
      return accumulator;
    }, {})
  };
};

module.exports = connect(mapStateToProps)(StatusBar);