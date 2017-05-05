/**
 * Display a vital fact.
 */

const React = require('react');
const connect = require('react-redux').connect;
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const Vital = function({fact, recordFactId, personId}){
  if(!fact){
    return null;
  }
  return (
    <div className="vital">
      <span className="label">{fact.getType().split('/').pop()}</span>
      <DateInput fact={fact} personId={personId} recordFactId={recordFactId} />
      <PlaceInput fact={fact} personId={personId} recordFactId={recordFactId} />
    </div>
  );
};

module.exports = connect()(Vital);