/**
 * Display an editable fact.
 */

const React = require('react');
const connect = require('react-redux').connect;
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const EditableFact = function({fact, recordFactId, personId}){
  if(!fact){
    return null;
  }
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <DateInput fact={fact} personId={personId} recordFactId={recordFactId} />
      <PlaceInput fact={fact} personId={personId} recordFactId={recordFactId} />
    </div>
  );
};

module.exports = connect()(EditableFact);