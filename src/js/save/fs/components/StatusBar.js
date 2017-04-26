const React = require('react');
const connect = require('react-redux').connect;
const StatusCircle = require('./StatusCircle');
const changeFocusPerson = require('../actions/changeFocusPerson');

const StatusBar = function({persons, currentPersonIndex, dispatch}){
  const generateClickHandler = (i) => {
    return () => {
      dispatch(changeFocusPerson(i));
    };
  };
  const circles = persons.map((p, i) => {
    return <StatusCircle person={p} key={p.id} selected={i === currentPersonIndex} onClick={generateClickHandler(i)}/>;
  });
  return <ul className="status-list">{circles}</ul>;
};

const mapStateToProps = state => {
  return {
    persons: state.gedcomx.persons,
    currentPersonIndex: state.currentPersonIndex
  };
};

module.exports = connect(mapStateToProps)(StatusBar);