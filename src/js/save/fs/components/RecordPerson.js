/**
 * RecordPerson displays a person from the POSTed GEDCOM X record data.
 */

const React = require('react');
const connect = require('react-redux').connect;
const Fact = require('./Fact');
const Name = require('./Name');
const Family = require('./Family');
const matchedSelector = require('../selectors/matched');
const savedSelector = require('../selectors/saved');

const RecordPerson = function({ person, record, matched = false, saved = false, factOrder, facts }){
  const copyable = matched && !saved;
  return (
    <div>
      <div className="person record">
        <div className="label">Record Person</div>
        <div className="box">
          <Name name={person.getPreferredName()} copyable={copyable} />
          {factOrder.map(id => {
            return (
              <div key={id}>
                <hr />
                <Fact fact={facts[id]} copyable={copyable} />
              </div>
            );
          })}
        </div>
      </div>
      <Family gedcomx={record} personId={person.getId()} />
    </div>
  );
};

const mapStateToProps = state => {
  const { persons, record, currentPerson, facts, factOrder } = state;
  return {
    record,
    person: persons[currentPerson],
    matched: matchedSelector(state),
    saved: savedSelector(state),
    facts: facts[currentPerson],
    factOrder: factOrder[currentPerson]
  };
};

module.exports = connect(mapStateToProps)(RecordPerson);