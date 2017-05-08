/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Fact = require('./Fact');
const Name = require('./Name');
const Family = require('./Family');
const slimFacts = require('../selectors/slimFacts');
const matchedSelector = require('../selectors/matched');

const RecordPerson = function({ person, gedcomx, matched }){
  return (
    <div>
      <div className={"person record" + (matched ? ' matched' : '')}>
        <div className="label">Record Person</div>
        <div className="box">
          <Name name={person.getNames()[0]} copyable={true} />
          {slimFacts(person).map(f => {
            return <Fact key={f.getId()} fact={f} copyable={true} />;
          })}
        </div>
      </div>
      <Family gedcomx={gedcomx} personId={person.getId()} />
    </div>
  );
};

const mapStateToProps = state => {
  const { persons, gedcomx, currentPerson } = state;
  return {
    gedcomx,
    person: persons[currentPerson],
    matched: matchedSelector(state)
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);