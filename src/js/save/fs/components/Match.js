const React = require('react');
const Vital = require('./Vital');

module.exports = function({match}){
  const data = match.getContent().getGedcomX(),
        person = data.getPersonById(match.getId()),
        birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death'),
        parents = data.getPersonsParents(person),
        father = parents.find(p => p.isMale()),
        mother = parents.find(p => p.isFemale()),
        spouse = data.getPersonsSpouses(person)[0];
  console.log(parents);
  return (
    <div className="match box">
      <div>
        <span className="person-name">{person.getDisplayName(true)}</span>
        <span className="person-id label">{person.getId()}</span>
      </div>
      {birth ? <Vital fact={birth} /> : null}
      {death ? <Vital fact={death} /> : null}
      <div className="relations">
        <Relation person={father} relationship="Father" />
        <Relation person={mother} relationship="Mother" />
        <Relation person={spouse} relationship="Spouse" />
      </div>
    </div>
  );
};

function Relation({person, relationship}){
  if(!person) return null;
  
  return (
    <div className="relation">
      {relationship && <span className="label">{relationship}</span>}
      <div>{person.getDisplayName(true)}</div>
    </div>  
  );
}