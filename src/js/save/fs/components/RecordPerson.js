/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');

module.exports = function({person}){
  return (
    <div className="box">
      <span className="person-name">{person.getDisplayName(true)}</span> - {person.id}
      <div>BIRTH</div>
      <div>DEATH</div>
    </div>
  );
};