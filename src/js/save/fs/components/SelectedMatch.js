/**
 * SelectedMatch displays the selected match.
 */

const React = require('react');
const connect = require('react-redux').connect;
const EditableFact = require('./EditableFact');
const Name = require('./Name');
const Loader = require('./Loader');
const GedcomX = require('gedcomx-js');
const Family = require('./Family');
const slimFacts = require('../selectors/slimFacts');

const SelectedMatch = function({ person, personId, matchId, gedcomx, loading }){
  
  if(loading){
    return <Loader message="Loading match..." />;
  }
  
  const matchPerson = gedcomx.getPersonById(matchId);
  return (
    <div>
      <div className="person">
        <div className="label">Record Person</div>
        <div className="box">
          <Name name={matchPerson.getNames()[0]} editable={true} />
          {slimFacts(person).map(recordFact => {
            const recordFactId = recordFact.getId();
            let matchFact = getMatchingFact(matchPerson, recordFact);
            return <EditableFact key={recordFactId} recordFactId={recordFactId} fact={matchFact} personId={personId} />;
          })}
        </div>
      </div>
      <Family gedcomx={gedcomx} personId={matchId} />
    </div>
  );
};

/**
 * For vital facts we look for a matching fact by type in the match person.
 * Returns undefined when a matching fact wasn't found or the fact isn't a vital.
 */
function getMatchingFact(matchPerson, recordFact){
  const type = recordFact.getType();
  let fact;
  
  // Search for a matching vital
  if(GedcomX.vitals.indexOf(type) !== -1){
    fact = matchPerson.getFactsByType(type)[0];
  }
  
  // If we found no matching vital or if this isn't a vital, then we create an
  // empty fact with the same type.
  if(fact === undefined){
    fact = GedcomX.Fact({
      type: recordFact.getType()
    });
  }
  
  return fact;
}

const mapStateToProps = state => {
  const {selectedMatches, currentPerson, persons} = state,
        match = selectedMatches[currentPerson],
        {matchId, gedcomx, loading} = match;
  return {
    matchId,
    gedcomx,
    loading,
    personId: currentPerson,
    person: persons[currentPerson]
  };
};

module.exports = connect(mapStateToProps)(SelectedMatch);