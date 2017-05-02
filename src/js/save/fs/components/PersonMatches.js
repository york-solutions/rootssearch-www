/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const Match = require('./Match');
 
const PersonMatches = function({ status, entryIds = [], entries = {} }){
  
  if(status === 'LOADING'){
    return <Loader message="Loading matches..." />;
  }
  
  return (
    <div>{entryIds.map(id => {
      return <Match match={entries[id]} key={id} />;
    })}
    </div>
  );
};

const mapStateToProps = state => {
  const matches = state.possibleMatches[state.currentPerson] || {},
        {status, entries, entryIds} = matches;
  return {
    status,
    entries,
    entryIds
  };
};

module.exports = connect(mapStateToProps)(PersonMatches);