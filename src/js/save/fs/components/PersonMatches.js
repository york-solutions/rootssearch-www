/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const Match = require('./Match');
 
const PersonMatches = function({ matchState, matches = [] }){
  
  if(matchState === 'LOADING'){
    return <Loader message="Loading matches..." />;
  }
  
  return <div>{matches.map(m => {
    return <Match match={m} key={m.id} />;
  })}</div>;
};

const mapStateToProps = state => {
  return {
    matchState: state.matches.state,
    matches: state.matches.entries
  };
};

module.exports = connect(mapStateToProps)(PersonMatches);