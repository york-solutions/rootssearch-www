/**
 * Display an editable fact.
 */

const React = require('react');
const Attribution = require('./Attribution');
const Reason = require('./Reason');
const DateInput = require('./DateInput');
const PlaceInput = require('./PlaceInput');

const EditableFact = function({fact, modified, originalAttribution, onDateChange, onPlaceChange, onReasonChange}){
  const attribution = fact.getAttribution();
  return (
    <div className="fact">
      <span className="label">{fact.getTypeDisplayLabel()}</span>
      <DateInput date={fact.getDate()} onChange={onDateChange} />
      <PlaceInput place={fact.getPlace()} onChange={onPlaceChange} />
      <Attribution attribution={originalAttribution} />
      {modified && 
        <Reason reason={attribution ? attribution.getChangeMessage() : ''} 
          onChange={onReasonChange} />}
    </div>
  );
};

module.exports = EditableFact;