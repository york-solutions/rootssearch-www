/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const Vital = require('./Vital');

module.exports = function({person}){
  let birth = person.getFact('http://gedcomx.org/Birth'),
      death = person.getFact('http://gedcomx.org/Death');
  return (
    <div className="box person">
      <span className="person-name">{person.getDisplayName(true)}</span> - {person.id}
      {birth ? <Vital fact={birth} /> : null}
      {death ? <Vital fact={death} /> : null}
    </div>
  );
};