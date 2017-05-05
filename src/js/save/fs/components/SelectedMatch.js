/**
 * SelectedMatch displays the selected match.
 */

const React = require('react');
const connect = require('react-redux').connect;
const EditableVital = require('./EditableVital');
const Name = require('./Name');
const Loader = require('./Loader');
const GedcomX = require('gedcomx-js');
const slimFacts = require('../selectors/slimFacts');

const SelectedMatch = function({ person, personId, matchId, gedcomx, loading }){
  
  if(loading){
    return <Loader message="Loading match..." />;
  }
  
  const matchPerson = gedcomx.getPersonById(matchId),
        parents = gedcomx.getPersonsParents(matchPerson),
        father = parents.find(p => p.isMale()),
        mother = parents.find(p => p.isFemale()),
        spouse = gedcomx.getPersonsSpouses(matchPerson)[0],
        children = gedcomx.getPersonsChildren(matchPerson);
  return (
    <div>
      <div className="person">
        <div className="label">Record Person</div>
        <div className="box">
          <Name name={matchPerson.getNames()[0]} editable={true} />
          {slimFacts(person).map(recordFact => {
            const fact = getMatchingFact(matchPerson, recordFact);
            return <EditableVital key={recordFact.getId()} recordFactId={recordFact.getId()} fact={fact} personId={personId} />;
          })}
        </div>
      </div>
      <Relation person={father} relationship="Father" />
      <Relation person={mother} relationship="Mother" />
      <Relation person={spouse} relationship="Spouse" />
      {children.length === 0 ? null : <div className="person">
        <div className="label">Children</div>
        {children.map(child => { 
          return <Relation person={child} key={child.getId()} />;
        })}
      </div>}
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

function Relation({person, relationship}){
  if(!person) return null;
  return (
    <div className="person relation">
      {relationship && <div className="label">{relationship}</div>}
      <div className="box">
        <Name name={person.getNames()[0]} />
        <div className="life-span">{person.getLifespan(true)}</div>
      </div>
    </div>  
  );
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