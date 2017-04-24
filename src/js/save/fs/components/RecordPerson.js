/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Vital = require('./Vital');

const RecordPerson = function({person}){
  let birth = person.getFact('http://gedcomx.org/Birth'),
      death = person.getFact('http://gedcomx.org/Death');
  return (
    <div className="box person">
      <div className="person-name">{person.getDisplayName(true)}</div>
      {birth ? <Vital fact={birth} /> : null}
      {death ? <Vital fact={death} /> : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    person: state.gedcomx.persons[state.currentPerson]
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);