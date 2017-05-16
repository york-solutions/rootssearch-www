/**
 * Display an editable fact.
 */

const React = require('react');
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const EditableFact = function({fact, onDateChange, onPlaceChange}){
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <DateInput date={fact.getDate()} onChange={onDateChange} />
      <PlaceInput place={fact.getPlace()} onChange={onPlaceChange} />
    </div>
  );
};

module.exports = EditableFact;