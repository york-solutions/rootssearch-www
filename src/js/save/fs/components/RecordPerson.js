/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Vital = require('./Vital');

const RecordPerson = function({ gedcomx, currentPersonIndex }){
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
          <div className="person-name">{person.getDisplayName(true)}</div>
          {birth ? <Vital fact={birth} /> : null}
          {death ? <Vital fact={death} /> : null}
        </div>
      </div>
      <Relation person={father} relationship="Father" />
      <Relation person={mother} relationship="Mother" />
      <Relation person={spouse} relationship="Spouse" />
      {children.length && <div className="person">
        <div className="label">Children</div>
        {children.map(child => <Relation person={child} key={child.getId()} />)}
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
        <div className="person-name">{person.getDisplayName(true)}</div>
        <div className="life-span">{person.getLifespan(true)}</div>
      </div>
    </div>  
  );
}

const mapStateToProps = state => {
  const { gedcomx, currentPersonIndex } = state;
  return {
    gedcomx,
    currentPersonIndex
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);