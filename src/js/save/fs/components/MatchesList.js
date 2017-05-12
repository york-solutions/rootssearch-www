/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const Match = require('./Match');
const selectMatchAction = require('../actions/selectMatch');
 
const MatchesList = function({ currentPerson, status, dispatch, entryIds = [], entries = {} }){
  
  if(status === 'LOADING'){
    return <Loader message="Loading matches..." />;
  }
  
  let pidInput = null;
  
  return (
    <div className="matches-list">
      <div className="label">Possible Matches</div>
      {entryIds.length === 0 ? 
        (
          <p>No matches were found.</p>
        ) : entryIds.map(id => {
          return <Match match={entries[id]} key={id} />;
        })
      }
      <p>Enter a person ID 
        <span className="input-group">
          <input type="text" className="manual-pid form-control" ref={(input) => { pidInput = input; }} />
          <button className="btn btn-rs" onClick={() => {
            dispatch(selectMatchAction(currentPerson, pidInput.value));
          }}>Select</button>
        </span>
      </p>
      <p>Or &nbsp;<button className="btn" disabled>Create A Person</button></p>
    </div>
  );
};

const mapStateToProps = state => {
  const matches = state.possibleMatches[state.currentPerson] || {},
        {status, entries, entryIds} = matches;
  return {
    status,
    entries,
    entryIds,
    currentPerson: state.currentPerson
  };
};

module.exports = connect(mapStateToProps)(MatchesList);