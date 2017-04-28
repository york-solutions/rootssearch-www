/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Vital = require('./Vital');
const Name = require('./Name');

const RecordPerson = function({ gedcomx, currentPersonIndex, matched }){
  const person = gedcomx.persons[currentPersonIndex],
        birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death'),
        parents = gedcomx.getPersonsParents(person),
        father = parents.find(p => p.isMale()),
        mother = parents.find(p => p.isFemale()),
        spouse = gedcomx.getPersonsSpouses(person)[0],
        children = gedcomx.getPersonsChildren(person);
  return (
    <div>
      <div className="person">
        <div className="label">Record Person</div>
        <div className="box">
          <Name name={person.getNames()[0]} copyable={true} />
          <Vital fact={birth} copyable={true} />
          <Vital fact={death} copyable={true} />
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
  const { gedcomx, currentPersonIndex } = state;
  return {
    gedcomx,
    currentPersonIndex,
    matched: !!state.matches[currentPersonIndex].match
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);