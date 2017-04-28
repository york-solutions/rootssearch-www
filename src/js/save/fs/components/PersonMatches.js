/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const Match = require('./Match');
 
const PersonMatches = function({ status, entries = [] }){
  
  if(status === 'LOADING'){
    return <Loader message="Loading matches..." />;
  }
  
  return (
    <div>{entries.map(m => {
      return <Match match={m} key={m.getId()} />;
    })}
    </div>
  );
};

const mapStateToProps = state => {
  const matches = state.matches[state.currentPerson] || {},
        {status, entries} = matches;
  return {
    status,
    entries
  };
};

module.exports = connect(mapStateToProps)(PersonMatches);