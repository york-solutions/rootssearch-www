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
            const fact = getMatchingFact(matchPerson, recordFact);
            return <EditableFact key={recordFact.getId()} recordFactId={recordFact.getId()} fact={fact} personId={personId} />;
          })}
        </div>
      </div>
      <Family gedcomx={gedcomx} personId={matchId} />
    </div>
  );
};

function getMatchingFact(matchPerson, recordFact){
  const type = recordFact.getType();
  
  // Fot vitals we look for a matching type in the match person
  if(GedcomX.vitals.indexOf(type) !== -1){
    return matchPerson.getFactsByType(type)[0];
  }
  
  // A non-vital, create a new empty fact
  return GedcomX.Fact({
    type: recordFact.getType()
  });
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