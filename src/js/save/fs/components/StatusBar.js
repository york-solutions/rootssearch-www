const React = require('react');
const connect = require('react-redux').connect;
const StatusCircle = require('./StatusCircle');
const changeFocusPerson = require('../actions/changeFocusPerson');

const StatusBar = function({persons, currentPerson, dispatch}){
  const generateClickHandler = (i) => {
    return () => {
      dispatch(changeFocusPerson(i));
    };
  };
  const circles = persons.map((p) => {
    return <StatusCircle person={p} key={p.id} selected={p.getId() === currentPerson} onClick={generateClickHandler(p.getId())}/>;
  });
  return <ul className="status-list">{circles}</ul>;
};

const mapStateToProps = state => {
  return {
    persons: state.gedcomx.persons,
    currentPerson: state.currentPerson
  };
};

module.exports = connect(mapStateToProps)(StatusBar);