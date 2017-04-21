const React = require('react');
const connect = require('react-redux').connect;
const StatusCircle = require('./StatusCircle');

const StatusBar = function(props){
  const persons = props.persons;
  const circles = persons.map(p => {
    return <StatusCircle person={p} key={p.id} />;
  });
  return <ul className="status-list">{circles}</ul>;
};

const mapStateToProps = state => {
  return {
    persons: state.gedcomx.persons
  };
};

module.exports = connect(mapStateToProps)(StatusBar);