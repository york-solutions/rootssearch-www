/**
 * Display a vital fact.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Name = require('./Name');

const Family = function({gedcomx, personId}){
  if(!(gedcomx && personId)){
    return null;
  }
  
  const person = gedcomx.getPersonById(personId),
        parents = gedcomx.getPersonsParents(person),
        father = parents.find(p => p.isMale()),
        mother = parents.find(p => p.isFemale()),
        spouse = gedcomx.getPersonsSpouses(person)[0],
        children = gedcomx.getPersonsChildren(person);
  
  return (<div>
    <Relation person={father} relationship="Father" />
    <Relation person={mother} relationship="Mother" />
    <Relation person={spouse} relationship="Spouse" />
    {children.length === 0 ? null : <div className="person">
      <div className="label">Children</div>
      {children.map(child => { 
        return <Relation person={child} key={child.getId()} />;
      })}
    </div>}
  </div>);
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

module.exports = connect()(Family);