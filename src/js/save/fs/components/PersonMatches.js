/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
 
const PersonMatches = function({ matches = [] }){
  return <div>{matches.length}</div>;
};

const mapStateToProps = state => {
  return {
    matches: state.matches.entries
  };
};

module.exports = connect(mapStateToProps)(PersonMatches);