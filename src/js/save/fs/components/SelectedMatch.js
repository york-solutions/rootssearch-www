/**
 * SelectedMatch displays the selected match.
 */

const React = require('react');
const connect = require('react-redux').connect;
const EditableFact = require('./EditableFact');
const Fact = require('./Fact');
const Name = require('./Name');
const Loader = require('./Loader');
const Family = require('./Family');
const saveMatchAction = require('../actions/saveMatch');
const savedSelector = require('../selectors/saved');

const SelectedMatch = function({ person, personId, matchId, gedcomx, loading, saved, dispatch, factOrder, factMap }){
  
  if(loading){
    return <Loader message="Loading match..." />;
  }
  
  const matchPerson = gedcomx.getPersonById(matchId);
  return (
    <div>
      <div className="person">
        <div className="label">Tree Person</div>
        <div className="box">
          <Name name={matchPerson.getNames()[0]} editable={true} />
          {factOrder.map(recordFactId => {
            let matchFact = factMap[recordFactId];
            return (
              <div key={recordFactId}>
                <hr />
                { saved ?
                  <Fact fact={matchFact} /> :
                  <EditableFact recordFactId={recordFactId} fact={matchFact} personId={personId} />
                }
              </div>
            );
          })}
          <hr />
          { saved && <button className="btn btn-lg disabled" disabled>Saved</button> }
          { !saved && <button className="btn btn-rs btn-lg" onClick={() => dispatch(saveMatchAction(personId))}>Save</button> }
        </div>
      </div>
      <Family gedcomx={gedcomx} personId={matchId} />
    </div>
  );
};

const mapStateToProps = state => {
  const {selectedMatches, currentPerson, persons, factOrder} = state,
        match = selectedMatches[currentPerson],
        {matchId, gedcomx, loading, factMap} = match;
  return {
    matchId,
    gedcomx,
    loading,
    personId: currentPerson,
    person: persons[currentPerson],
    factOrder: factOrder[currentPerson],
    factMap,
    saved: savedSelector(state)
  };
};

module.exports = connect(mapStateToProps)(SelectedMatch);