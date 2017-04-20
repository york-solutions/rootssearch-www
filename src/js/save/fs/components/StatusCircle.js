const React = require('react');

module.exports = function(props){
  return <div className="circle" title={props.person.id} />;
};