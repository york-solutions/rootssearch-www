/**
 * Display a vital fact.
 */

const React = require('react');
const connect = require('react-redux').connect;

const Family = function({gedcomx, personId}){
  if(!(gedcomx && personId)){
    return null;
  }
  
  const person = gedcomx.getPersonById(personId),
        parents = gedcomx.getPersonsParents(person),
        spouses = gedcomx.getPersonsSpouses(person),
        children = gedcomx.getPersonsChildren(person);
        
  // Don't display the Family box when there is no family
  if(parents.length === 0 && spouses.length === 0 && children.length === 0){
    return null;
  }      
  
  return (
    <div>
      <div className="box">
        <div className="box-title">Family</div>
        <div className="box-body">
          <PersonList label="Parents" persons={parents} />
          {parents.length > 0 && <hr />}
          <PersonList label="Spouses" persons={spouses} />
          {(parents.length > 0 || spouses.length > 0) && <hr />}
          <PersonList label="Children" persons={children} />
        </div>
      </div>
    </div>
  );
};

function PersonList({label, persons}){
  if(persons.length === 0){
    return null;
  }
  return (
    <div>
      <div className="label">{label}</div>
      {persons.map(person => {
        return <PersonSummary person={person} key={person.getId()} />;
      })}
    </div>
  );
}

function PersonSummary({person}){
  return (
    <div className="person-summary">
      <span className="display-name">{person.getPreferredName().getFullText()}</span>
      &nbsp;&ndash;&nbsp;
      <span className="life-span">{person.getLifespan(true)}</span>
    </div>
  );
}

module.exports = connect()(Family);