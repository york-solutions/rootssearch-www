const React = require('react');
const connect = require('react-redux').connect;
const StatusCircle = require('./StatusCircle');
const changeFocusPerson = require('../actions/changeFocusPerson');

const StatusBar = function({personOrder, persons, currentPersonId, dispatch, saved}){
  const generateClickHandler = (i) => {
    return () => {
      dispatch(changeFocusPerson(i));
    };
  };
  const circles = personOrder.map(personId => {
    return <StatusCircle 
      person={persons[personId].gedcomx} 
      key={personId} 
      selected={personId === currentPersonId}
      saved={saved[personId]}
      onClick={generateClickHandler(personId)} />;
  });
  return <ul className="status-list">{circles}</ul>;
};

const mapStateToProps = state => {
  return {
    personOrder: state.personOrder,
    persons: state.persons,
    currentPersonId: state.currentPersonId,
    saved: state.personOrder.reduce((accumulator, personId) => {
      accumulator[personId] = state.persons[personId].selectedMatch.saved;
      return accumulator;
    }, {})
  };
};

module.exports = connect(mapStateToProps)(StatusBar);