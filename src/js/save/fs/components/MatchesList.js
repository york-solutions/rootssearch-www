/**
 * Generate and display a list of matches
 */
 
const React = require('react');
const connect = require('react-redux').connect;
const Loader = require('./Loader');
const Match = require('./Match');
const selectMatchAction = require('../actions/selectMatch');
const possibleMatchesSelector = require('../selectors/possibleMatches');
 
const MatchesList = function({ currentPerson, status, error, dispatch, manualId, entryIds = [], entries = {} }){
  
  if(status === 'LOADING'){
    return (
      <div className="matches-list">
        <Loader message="Loading matches..." />
      </div>
    );
  }
  
  return (
    <div className="matches-list">
      <div className="label">Possible Matches</div>
      {entryIds.length === 0 ? 
        (
          error ? <p className="text-danger">{error}</p> : <p>No matches were found.</p>
        ) : entryIds.map(id => {
          return <Match match={entries[id]} key={id} />;
        })
      }
      <p>Enter a person ID 
        <span className="input-group">
          <input type="text" className="manual-pid form-control" value={manualId} onChange={e => {
            dispatch({
              type: 'MANUAL_ID',
              value: e.target.value,
              personId: currentPerson
            });
          }} />
          <button className="btn btn-rs" onClick={() => {
            dispatch(selectMatchAction(currentPerson, manualId));
          }}>Select</button>
        </span>
      </p>
      <p>Or &nbsp;<button className="btn btn-rs" onClick={() => {
        dispatch({
          type: 'CREATE_PERSON'
        });
      }}>Create A Person</button></p>
    </div>
  );
};

const mapStateToProps = state => {
  const matches = possibleMatchesSelector(state) || {},
        {status, entries, entryIds, manualId, error} = matches;
  return {
    status,
    entries,
    entryIds,
    manualId,
    error,
    // TODO: get rid of currentPerson
    currentPerson: state.currentPerson
  };
};

module.exports = connect(mapStateToProps)(MatchesList);