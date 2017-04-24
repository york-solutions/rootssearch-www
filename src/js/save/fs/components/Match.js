const React = require('react');
const Vital = require('./Vital');

module.exports = function({match}){
  const data = match.getContent().getGedcomX(),
        person = data.getPersonById(match.getId()),
        birth = person.getFact('http://gedcomx.org/Birth'),
        death = person.getFact('http://gedcomx.org/Death');
  return (
    <div className="match box">
      <div>
        <span className="person-name">{person.getDisplayName(true)}</span>
        <span className="person-id">{person.getId()}</span>
      </div>
      {birth ? <Vital fact={birth} /> : null}
      {death ? <Vital fact={death} /> : null}
    </div>
  );
};