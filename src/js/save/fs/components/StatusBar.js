const React = require('react');
const StatusCircle = require('./StatusCircle');

module.exports = function(props){
  const persons = props.persons;
  const circles = persons.map(p => {
    return <StatusCircle person={p} key={p.id} />;
  });
  return <ul className="status-list">{circles}</ul>;
};